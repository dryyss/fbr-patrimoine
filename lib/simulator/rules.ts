import type { BuildingType, StyleId } from "./types";

/**
 * La matrice métier qui dit, pour chaque type de bâtiment détecté :
 * - quels styles sont compatibles
 * - lequel pré-sélectionner par défaut
 * - quels styles bloquer (avec raison affichée au visiteur)
 * - quel "boost" de prompt ajouter à la génération
 *
 * Tout vit ici en JS pur — modifiable à la volée, zéro coût IA.
 */

export type RuleSet = {
  allowedStyles: StyleId[];
  recommended: StyleId;
  blockedStyles: { id: StyleId; reason: string }[];
  /** Phrase ajoutée au prompt de génération pour respecter les contraintes du type */
  promptBoost: string;
  /** Phrase affichée au visiteur pour expliquer la reco */
  visitorTip: string;
};

const ALL_STYLES: StyleId[] = ["chaux", "moderne", "ite", "ite-enduit"];

const RULES: Record<BuildingType, RuleSet> = {
  haussmannien: {
    allowedStyles: ["chaux", "moderne"],
    recommended: "chaux",
    blockedStyles: [
      { id: "ite", reason: "L'ITE bardage bois est inadaptée et souvent interdite sur un bâti haussmannien (zones ABF)." },
      { id: "ite-enduit", reason: "L'ITE altérerait les modénatures, balcons et corniches d'origine." },
    ],
    promptBoost:
      "preserve all stone moldings, cornices, balconies, mascarons and architectural details; respect haussmannian identity",
    visitorTip:
      "Bâtiment haussmannien identifié — pour préserver les modénatures et corniches, un enduit à la chaux est recommandé.",
  },

  "pavillon-ancien": {
    allowedStyles: ["chaux", "moderne", "ite-enduit"],
    recommended: "chaux",
    blockedStyles: [
      { id: "ite", reason: "Le bardage bois est rarement compatible avec l'esthétique d'un pavillon ancien." },
    ],
    promptBoost: "preserve original window proportions, roof line and traditional joinery",
    visitorTip:
      "Pavillon ancien identifié — l'enduit à la chaux conserve l'esprit traditionnel, l'ITE finition enduit ajoute de la performance énergétique.",
  },

  "pavillon-moderne": {
    allowedStyles: ALL_STYLES,
    recommended: "ite-enduit",
    blockedStyles: [],
    promptBoost: "modern clean envelope, contemporary aesthetic",
    visitorTip:
      "Pavillon récent identifié — tous les styles sont envisageables. L'ITE finition enduit est souvent le meilleur compromis performance / esthétique.",
  },

  "copropriete-annees-60-80": {
    allowedStyles: ["moderne", "ite", "ite-enduit"],
    recommended: "ite-enduit",
    blockedStyles: [
      { id: "chaux", reason: "L'enduit à la chaux n'apporte pas la performance énergétique attendue sur ce type de bâti." },
    ],
    promptBoost:
      "clean envelope retrofit, hide thermal bridges, modern minimal aesthetic, repair concrete defects",
    visitorTip:
      "Copropriété des années 60–80 identifiée — priorité à la performance énergétique. L'ITE est éligible MaPrimeRénov' et CEE.",
  },

  "copropriete-recente": {
    allowedStyles: ["moderne", "ite-enduit"],
    recommended: "moderne",
    blockedStyles: [
      { id: "chaux", reason: "Style traditionnel non adapté à un bâti récent." },
      { id: "ite", reason: "Le bardage bois change radicalement l'aspect d'une copropriété récente." },
    ],
    promptBoost: "subtle refresh, modern clean finish",
    visitorTip:
      "Copropriété récente identifiée — un ravalement classique ou une remise à neuf de l'enveloppe suffit dans la plupart des cas.",
  },

  religieux: {
    allowedStyles: ["chaux"],
    recommended: "chaux",
    blockedStyles: [
      { id: "moderne", reason: "Inadapté au caractère patrimonial d'un édifice religieux." },
      { id: "ite", reason: "Interdit sur un édifice patrimonial classé/inscrit." },
      { id: "ite-enduit", reason: "Interdit sur un édifice patrimonial classé/inscrit." },
    ],
    promptBoost:
      "heritage restoration, traditional lime-based materials only, respect ecclesiastical character, absolutely no thermal cladding, preserve stone carvings",
    visitorTip:
      "Édifice religieux identifié — restauration patrimoniale à la chaux uniquement. FBR Patrimoine est habilitée à intervenir sur ce type de bâti.",
  },

  "industriel-reconverti": {
    allowedStyles: ["moderne", "ite", "ite-enduit"],
    recommended: "ite",
    blockedStyles: [
      { id: "chaux", reason: "Style traditionnel inadapté à un bâti industriel." },
    ],
    promptBoost: "industrial loft aesthetic, raw materials retained, modern envelope",
    visitorTip:
      "Bâti industriel reconverti identifié — l'ITE bardage bois s'intègre bien à l'esthétique industrielle.",
  },

  inconnu: {
    allowedStyles: ALL_STYLES,
    recommended: "chaux",
    blockedStyles: [],
    promptBoost: "",
    visitorTip:
      "Notre IA n'a pas pu identifier précisément le type de bâtiment. Tous les styles sont proposés — nos équipes affineront avec vous lors du diagnostic.",
  },
};

export function getRulesFor(type: BuildingType): RuleSet {
  return RULES[type] ?? RULES.inconnu;
}
