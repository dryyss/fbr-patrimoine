import type { BuildingType, StyleId } from "./types";

// Gemini 2.5 Flash is the cheapest tier with structured output decent enough
// for prompt-engineering tasks. Switch to 2.5 Pro only if quality degrades.
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Hard timeout so a stalled Gemini call doesn't block the whole simulator
// pipeline (which would lock the visitor on the loading screen).
const TIMEOUT_MS = 5000;

const SYSTEM_PROMPT = `You are a prompt engineer for an SDXL image generator that visualizes building facade renovations.

Your job: rewrite a French-language wish from a homeowner into ONE concise English clause (max 35 words) that can be appended to an image-generation prompt.

Strict rules:
- Output ONLY the clause, no quotes, no preamble, no "Here is...".
- Stick to what the user wrote. Do NOT invent colors, materials, or features they did not mention.
- Focus on visible architectural details: colors, materials, elements to preserve or change.
- Phrase as instructions to the image model (e.g. "preserve wooden shutters, beige tinted plaster, accentuate cornice").
- Do NOT add quality terms like "high quality", "photorealistic", "8k" — those are handled elsewhere.
- If the user input is irrelevant to a facade (off-topic, abuse, empty), output exactly: SKIP`;

/**
 * Refine a free-form French description from the visitor into a clean English
 * prompt clause for SDXL. Returns `null` if Gemini is not configured, errors,
 * or considers the input off-topic (model outputs "SKIP").
 *
 * The original raw description is NEVER lost — it's still shown to FBR in the
 * notification email. This function only enriches what goes to the image model.
 */
export async function refinePromptViaGemini(
  description: string,
  style: StyleId,
  buildingType: BuildingType
): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;

  const clean = description.trim();
  if (!clean) return null;

  const userTurn = `Style chosen by visitor: ${style}
Detected building type: ${buildingType}
Visitor's request (French): """${clean}"""

Rewrite as one English clause:`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userTurn }] }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 120,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("[gemini] refine HTTP error", res.status, txt.slice(0, 400));
      return null;
    }

    const json = (await res.json()) as GeminiResponse;
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") return null;

    const cleaned = text
      .trim()
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/[\r\n]+/g, " ")
      .trim();

    if (!cleaned || cleaned.toUpperCase() === "SKIP") return null;
    return cleaned;
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      console.warn("[gemini] refine timeout (>5s) — falling back to raw description");
    } else {
      console.error("[gemini] refine error:", e);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};
