import type { BuildingType, VisionResult } from "./types";

/**
 * Vision check : "cette image est-elle une façade exploitable ?"
 *
 * Deux modes :
 *   - STUB (par défaut, gratuit) : renvoie un VisionResult déterministe basé
 *     sur la taille du fichier — utile pour tester l'UI sans clé.
 *     Le type de bâtiment "tourne" entre les valeurs pour qu'on puisse
 *     voir toutes les branches du UI en uploadant différentes photos.
 *
 *   - GEMINI (mode réel) : appelle gemini-2.5-flash en mode vision, avec
 *     JSON schema forcé pour garantir une réponse structurée. Quasi
 *     gratuit (free tier 1500 req/jour).
 *
 * Pour activer Gemini : poser `GEMINI_API_KEY` dans Vercel env.
 */

const TYPE_CYCLE: BuildingType[] = [
  "haussmannien",
  "pavillon-ancien",
  "copropriete-annees-60-80",
  "pavillon-moderne",
  "religieux",
  "industriel-reconverti",
  "copropriete-recente",
];

export async function checkFacade(file: File): Promise<VisionResult> {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return stubVision(file);
  }

  return geminiVision(file, key);
}

/* ------------------------------------------------------------------ */
/* STUB                                                               */
/* ------------------------------------------------------------------ */

function stubVision(file: File): Promise<VisionResult> {
  // déterministe — la même photo donne toujours le même verdict
  const hash = (file.size + file.name.length) % TYPE_CYCLE.length;
  const type = TYPE_CYCLE[hash];

  // Pour tester le rejet : un fichier de moins de 5 Ko = "pas une façade"
  if (file.size < 5_000) {
    return Promise.resolve({
      is_facade: false,
      confidence: 0.9,
      building_type: "inconnu",
      rejection_reason:
        "L'image semble vide ou ne contient pas de façade exploitable. Réessayez avec une photo plus précise.",
    });
  }

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          is_facade: true,
          confidence: 0.85,
          building_type: type,
          estimated_era: eraFor(type),
          current_material: materialFor(type),
          current_state: "patine_legere",
          notable_features: featuresFor(type),
          protected_likely: type === "haussmannien" || type === "religieux",
        }),
      1200
    )
  );
}

function eraFor(type: BuildingType): string | undefined {
  switch (type) {
    case "haussmannien": return "1850-1900";
    case "pavillon-ancien": return "1900-1950";
    case "pavillon-moderne": return "1980-2010";
    case "copropriete-annees-60-80": return "1960-1985";
    case "copropriete-recente": return "2005-aujourd'hui";
    case "religieux": return "XVIII-XIXe siècle";
    case "industriel-reconverti": return "1900-1960";
    default: return undefined;
  }
}

function materialFor(type: BuildingType): string | undefined {
  switch (type) {
    case "haussmannien": return "pierre de taille calcaire";
    case "pavillon-ancien": return "moellons + enduit chaux";
    case "pavillon-moderne": return "parpaing + enduit ciment";
    case "copropriete-annees-60-80": return "béton préfabriqué";
    case "copropriete-recente": return "béton + bardage";
    case "religieux": return "pierre de taille";
    case "industriel-reconverti": return "brique + acier";
    default: return undefined;
  }
}

function featuresFor(type: BuildingType): string[] {
  switch (type) {
    case "haussmannien": return ["modénatures", "balcons fer forgé", "lucarnes", "corniches"];
    case "pavillon-ancien": return ["volets bois", "toiture tuile", "entourages pierre"];
    case "religieux": return ["arcs", "vitraux", "clocher", "porte sculptée"];
    case "copropriete-annees-60-80": return ["balcons béton", "claustras", "menuiseries alu"];
    case "industriel-reconverti": return ["grandes ouvertures", "structure métallique apparente"];
    default: return [];
  }
}

/* ------------------------------------------------------------------ */
/* GEMINI                                                             */
/* ------------------------------------------------------------------ */

const VISION_PROMPT = `Tu es un expert en bâtiment et patrimoine français. On te montre une photo téléversée par un visiteur d'un site de ravalement / restauration. Ton rôle est de :

1. Déterminer si l'image est bien la photo extérieure d'une façade ou d'un bâtiment réel pouvant faire l'objet de travaux de ravalement, ITE ou restauration.
2. Si oui, classifier le bâtiment selon les types français possibles.
3. Estimer l'époque, le matériau, l'état apparent.

REJETER (is_facade=false) si l'image est : un intérieur, une personne, un véhicule, un objet, un dessin/croquis, un schéma technique, ou si la qualité ne permet pas un travail sérieux.

Réponds STRICTEMENT au format JSON suivant.`;

const VISION_SCHEMA = {
  type: "object",
  properties: {
    is_facade: { type: "boolean" },
    confidence: { type: "number" },
    building_type: {
      type: "string",
      enum: [
        "haussmannien",
        "pavillon-ancien",
        "pavillon-moderne",
        "copropriete-annees-60-80",
        "copropriete-recente",
        "religieux",
        "industriel-reconverti",
        "inconnu",
      ],
    },
    estimated_era: { type: "string", nullable: true },
    current_material: { type: "string", nullable: true },
    current_state: {
      type: "string",
      enum: ["neuf", "patine_legere", "degrade", "tres_degrade"],
      nullable: true,
    },
    notable_features: { type: "array", items: { type: "string" }, nullable: true },
    protected_likely: { type: "boolean", nullable: true },
    rejection_reason: { type: "string", nullable: true },
  },
  required: ["is_facade", "confidence", "building_type"],
};

async function geminiVision(file: File, key: string): Promise<VisionResult> {
  const buf = Buffer.from(await file.arrayBuffer());
  const dataB64 = buf.toString("base64");
  const mime = file.type || "image/jpeg";

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": key,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: VISION_PROMPT },
              { inline_data: { mime_type: mime, data: dataB64 } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: VISION_SCHEMA,
          temperature: 0.1,
        },
      }),
    }
  );

  if (!res.ok) {
    const txt = await res.text();
    console.error("Gemini vision error:", res.status, txt);
    return {
      is_facade: true,
      confidence: 0,
      building_type: "inconnu",
    };
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

  try {
    return JSON.parse(text) as VisionResult;
  } catch {
    console.error("Gemini vision: invalid JSON", text);
    return {
      is_facade: true,
      confidence: 0,
      building_type: "inconnu",
    };
  }
}
