import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Génération image-to-image via Gemini 2.5 Flash Image ("Nano Banana").
 * Préserve la structure du bâtiment et applique uniquement le revêtement
 * décrit dans le prompt — exactement le cas d'usage du simulateur façade.
 *
 * Pourquoi Gemini Image plutôt que Replicate SDXL + ControlNet :
 *   - Édition image native (pas besoin de ControlNet à tuner)
 *   - Latence 5–15 s vs 20–40 s côté Replicate
 *   - Une seule API à gérer (Gemini sert déjà à raffiner le prompt + la vision)
 */

const MODEL = "gemini-2.5-flash-image";

export type GenerateResult =
  | { ok: true; dataUrl: string; mimeType: string }
  | { ok: false; error: string };

export async function generateFacadeImage(
  file: File,
  prompt: string,
  negativePrompt: string
): Promise<GenerateResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return { ok: false, error: "GEMINI_API_KEY non configurée." };

  const buf = Buffer.from(await file.arrayBuffer());
  const inputBase64 = buf.toString("base64");
  const inputMime = file.type || "image/jpeg";

  // Gemini Image n'a pas de champ "negative_prompt" dédié — on intègre les
  // contraintes négatives en clauses naturelles dans le prompt principal.
  const finalPrompt = [
    "Edit the attached photograph of a building facade.",
    prompt,
    `Constraints (must AVOID): ${negativePrompt}.`,
    "Critical: keep the building's geometry, window/door positions, roof shape and proportions exactly as in the input photo. Only modify the facade surface treatment and finish. Match the input lighting, perspective and surroundings. Output a single photorealistic image of the renovated facade.",
  ].join(" ");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: finalPrompt },
            { inlineData: { mimeType: inputMime, data: inputBase64 } },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.IMAGE],
        // Image generation is pretty deterministic — a low temperature keeps
        // the output close to the input building.
        temperature: 0.6,
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      const inline = part.inlineData;
      if (inline?.data && inline.mimeType?.startsWith("image/")) {
        return {
          ok: true,
          mimeType: inline.mimeType,
          dataUrl: `data:${inline.mimeType};base64,${inline.data}`,
        };
      }
    }

    // No image part in the response → either safety filter or the model
    // returned only text (e.g. a refusal explanation).
    const textOut = parts.find((p) => typeof p.text === "string")?.text;
    console.error("[gemini-image] no image part in response", { textOut });
    return {
      ok: false,
      error:
        textOut?.slice(0, 200) ??
        "La génération n'a pas renvoyé d'image. Réessayez avec une autre photo.",
    };
  } catch (e) {
    console.error("[gemini-image] error:", e);
    return {
      ok: false,
      error: "Le service de génération est temporairement indisponible.",
    };
  }
}
