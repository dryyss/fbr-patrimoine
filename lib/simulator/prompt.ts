import type { Intensity, StyleId, VisionResult } from "./types";
import { INTENSITIES } from "./types";
import { getRulesFor } from "./rules";

/**
 * Compose le prompt final de génération à partir de :
 *  - le résultat de la vision (type, matériau, features)
 *  - le style choisi par le visiteur
 *  - l'intensité de rénovation
 *
 * La logique est ici en JS pur — on peut tweaker sans recoût IA.
 */

const STYLE_BASE: Record<StyleId, string> = {
  chaux:
    "the same building facade, freshly renovated with traditional lime plaster (enduit à la chaux) in warm cream tones, restored stonework, soft natural daylight, architectural photography, photorealistic, sharp focus, high detail",
  moderne:
    "the same building facade, renovated with smooth modern mineral plaster in light neutral tones, contemporary clean finish, restored windows and balconies, natural daylight, architectural photography, photorealistic, high detail",
  ite:
    "the same building facade, retrofitted with exterior wood cladding for thermal insulation (ITE bardage bois), vertical wood panels in warm natural tones, contemporary look, restored window frames, natural daylight, architectural photography, photorealistic",
  "ite-enduit":
    "the same building facade, retrofitted with external thermal insulation finished with smooth tinted mineral plaster, clean modern envelope, restored joinery, natural daylight, architectural photography, photorealistic, high detail",
};

const NEGATIVE =
  "people, cars, vehicles, blurry, low quality, distorted, text, watermark, logo, signage, " +
  "altered window positions, demolished, ruined";

export function composePrompt(
  vision: VisionResult,
  styleId: StyleId,
  intensity: Intensity,
  /** Free-form text the visitor typed describing what they want. May be in
   *  French — modern SDXL handles it. Newlines are stripped so it stays a
   *  single clause inside the comma-separated prompt. */
  userDescription?: string
): { prompt: string; negative_prompt: string } {
  const base = STYLE_BASE[styleId];
  const rules = getRulesFor(vision.building_type);
  const intensityMod = INTENSITIES[intensity].modifier;

  const featureHint =
    vision.notable_features && vision.notable_features.length > 0
      ? `preserve existing ${vision.notable_features.slice(0, 4).join(", ")}`
      : "";

  const userClause = userDescription?.trim()
    ? `client requirements (must be respected): ${userDescription.trim().replace(/[\r\n]+/g, " ")}`
    : "";

  const parts = [base, intensityMod, rules.promptBoost, featureHint, userClause].filter(Boolean);

  return {
    prompt: parts.join(", "),
    negative_prompt: NEGATIVE,
  };
}
