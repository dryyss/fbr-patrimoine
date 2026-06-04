/**
 * Shared types for the AI simulator pipeline.
 *
 * Flow:
 *   1. Visitor uploads photo
 *   2. Vision step → VisionResult (analyse l'image, détecte le type)
 *   3. Front filters styles via getRulesFor(building_type)
 *   4. Visitor picks style + intensity
 *   5. Generation step → image rendue
 */

export type StyleId =
  | "chaux"
  | "moderne"
  | "ite"
  | "ite-enduit";

export type BuildingType =
  | "haussmannien"
  | "pavillon-ancien"
  | "pavillon-moderne"
  | "copropriete-annees-60-80"
  | "copropriete-recente"
  | "religieux"
  | "industriel-reconverti"
  | "inconnu";

export type Intensity = 1 | 2 | 3;

export type VisionResult = {
  is_facade: boolean;
  /** 0–1, confidence du modèle dans is_facade */
  confidence: number;
  building_type: BuildingType;
  /** Ex: "1850-1900" */
  estimated_era?: string;
  /** Ex: "pierre de taille", "béton enduit", "brique" */
  current_material?: string;
  /** "neuf" | "patine_legere" | "degrade" | "tres_degrade" */
  current_state?: "neuf" | "patine_legere" | "degrade" | "tres_degrade";
  /** Liste de features remarquables détectées (modénatures, balcons, etc.) */
  notable_features?: string[];
  /** Bâtiment potentiellement protégé (ABF, monument historique, etc.) */
  protected_likely?: boolean;
  /** Si is_facade=false : explication courte pour le visiteur */
  rejection_reason?: string;
};

export type StyleDef = {
  id: StyleId;
  name: string;
  desc: string;
};

export const STYLES: StyleDef[] = [
  {
    id: "chaux",
    name: "Enduit à la chaux",
    desc: "Patine traditionnelle, ton pierre — pour bâti ancien et façades haussmanniennes.",
  },
  {
    id: "moderne",
    name: "Enduit moderne",
    desc: "Finition lisse, tons minéraux clairs — idéal copropriétés récentes.",
  },
  {
    id: "ite",
    name: "ITE bardage bois",
    desc: "Isolation thermique avec parement bois — performance + esthétique chaleureuse.",
  },
  {
    id: "ite-enduit",
    name: "ITE finition enduit",
    desc: "Isolation thermique recouverte d'un enduit minéral teinté.",
  },
];

export const INTENSITIES: Record<Intensity, { label: string; modifier: string }> = {
  1: { label: "Restauration douce", modifier: "subtle refresh, gentle cleaning, conservative" },
  2: { label: "Rénovation classique", modifier: "thorough renovation, restored finish, clean" },
  3: { label: "Restauration profonde", modifier: "deep restoration, like new, vibrant" },
};
