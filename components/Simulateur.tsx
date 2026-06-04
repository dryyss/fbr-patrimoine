"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Style = {
  id: string;
  name: string;
  desc: string;
};

const styles: Style[] = [
  {
    id: "chaux",
    name: "Enduit à la chaux",
    desc: "Patine traditionnelle, ton pierre — pour bâti ancien et façades haussmanniennes.",
  },
  {
    id: "moderne",
    name: "Enduit moderne",
    desc: "Finition lisse et contemporaine, tons clairs minéraux — idéal copropriétés récentes.",
  },
  {
    id: "ite",
    name: "ITE bardage bois",
    desc: "Isolation thermique extérieure avec parement bois — performance + esthétique chaleureuse.",
  },
  {
    id: "ite-enduit",
    name: "ITE finition enduit",
    desc: "Isolation thermique extérieure recouverte d'un enduit minéral teinté.",
  },
];

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const MAX_DESCRIPTION = 500;
const LEAD_KEY = "fbr-sim-lead";
const DESC_KEY = "fbr-sim-description";

type Phase = "upload" | "style" | "generating" | "result" | "error";

type Lead = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  cp: string;
};

const emptyLead: Lead = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  ville: "",
  cp: "",
};

export default function Simulateur() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("upload");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [style, setStyle] = useState<string>("chaux");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // Lead form (visible alongside the simulator from the start)
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [rgpd, setRgpd] = useState(false);
  const [leadErr, setLeadErr] = useState<string>("");

  // Free-form description of the renovation project, fed into the AI prompt
  // and sent to FBR in the notification email so they have richer context
  // before calling the prospect.
  const [description, setDescription] = useState<string>("");

  // Pre-fill from sessionStorage so the form persists across reloads / step changes
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LEAD_KEY);
      if (raw) setLead({ ...emptyLead, ...(JSON.parse(raw) as Partial<Lead>) });
      const d = sessionStorage.getItem(DESC_KEY);
      if (d) setDescription(d.slice(0, MAX_DESCRIPTION));
    } catch {
      // ignore
    }
  }, []);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Le fichier doit être une image (JPG, PNG, WebP).");
      setPhase("error");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Image trop lourde (max 8 Mo). Réessayez avec une photo plus légère.");
      setPhase("error");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
    setPhase("style");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    onFile(e.dataTransfer.files?.[0]);
  };

  const reset = () => {
    setPhase("upload");
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    setError("");
  };

  const setLeadField = <K extends keyof Lead>(k: K, v: Lead[K]) => {
    setLead((prev) => ({ ...prev, [k]: v }));
  };

  const validateLead = (): boolean => {
    setLeadErr("");
    if (!lead.prenom.trim() || !lead.nom.trim() || !lead.email.trim() || !lead.telephone.trim() || !lead.ville.trim()) {
      setLeadErr("Merci de compléter tous les champs marqués d'un *.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) {
      setLeadErr("L'adresse email ne semble pas valide.");
      return false;
    }
    if (!rgpd) {
      setLeadErr("Merci d'accepter le traitement de vos données pour continuer.");
      return false;
    }
    return true;
  };

  const generate = async () => {
    if (!file) {
      setLeadErr("Merci d'ajouter une photo de votre façade avant de lancer la simulation.");
      return;
    }
    if (!validateLead()) return;

    sessionStorage.setItem(LEAD_KEY, JSON.stringify(lead));
    sessionStorage.setItem(DESC_KEY, description.trim());
    setPhase("generating");
    setError("");

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("style", style);
      fd.append("description", description.trim().slice(0, MAX_DESCRIPTION));
      fd.append("lead_prenom", lead.prenom.trim());
      fd.append("lead_nom", lead.nom.trim());
      fd.append("lead_email", lead.email.trim());
      fd.append("lead_telephone", lead.telephone.trim());
      fd.append("lead_ville", lead.ville.trim());
      if (lead.cp.trim()) fd.append("lead_cp", lead.cp.trim());

      const res = await fetch("/api/simulator", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? "Une erreur est survenue lors de la génération.");
        setPhase("error");
        return;
      }

      setResult(json.result ?? preview);
      setPhase("result");
    } catch {
      setError("Impossible de joindre le simulateur. Vérifiez votre connexion.");
      setPhase("error");
    }
  };

  const stepClass = (s: Phase) => {
    const order: Phase[] = ["upload", "style", "generating", "result"];
    const curIdx = order.indexOf(phase);
    const sIdx = order.indexOf(s);
    if (curIdx === sIdx) return "sim-step active";
    if (curIdx > sIdx) return "sim-step done";
    return "sim-step";
  };

  // ===== form fields (shared block, used in the right column) =====
  const formBlock = (
    <aside className="sim-form">
      <div className="sim-form-head">
        <div className="section-label">Vos coordonnées</div>
        <h3>
          Pour recevoir un <em>rappel personnalisé</em>.
        </h3>
        <p>
          Dès que vous lancez la simulation, notre équipe est notifiée et vous
          rappelle sous 48h ouvrées pour affiner votre projet — sans engagement.
        </p>
      </div>

      <div className="sim-form-grid">
        <input
          type="text"
          placeholder="Prénom *"
          value={lead.prenom}
          onChange={(e) => setLeadField("prenom", e.target.value)}
          autoComplete="given-name"
        />
        <input
          type="text"
          placeholder="Nom *"
          value={lead.nom}
          onChange={(e) => setLeadField("nom", e.target.value)}
          autoComplete="family-name"
        />
        <input
          type="email"
          placeholder="Adresse email *"
          value={lead.email}
          onChange={(e) => setLeadField("email", e.target.value)}
          autoComplete="email"
          className="sim-form-full"
        />
        <input
          type="tel"
          placeholder="Téléphone *"
          value={lead.telephone}
          onChange={(e) => setLeadField("telephone", e.target.value)}
          autoComplete="tel"
        />
        <input
          type="text"
          placeholder="CP"
          value={lead.cp}
          onChange={(e) => setLeadField("cp", e.target.value.replace(/\D/g, "").slice(0, 5))}
          autoComplete="postal-code"
          inputMode="numeric"
        />
        <input
          type="text"
          placeholder="Ville du chantier *"
          value={lead.ville}
          onChange={(e) => setLeadField("ville", e.target.value)}
          autoComplete="address-level2"
          className="sim-form-full"
        />
      </div>

      <label className="sim-form-rgpd">
        <input
          type="checkbox"
          checked={rgpd}
          onChange={(e) => setRgpd(e.target.checked)}
        />
        <span>
          J&apos;accepte que mes données et la photo téléversée soient transmises à
          FBR Patrimoine pour le suivi de ma demande, conformément à la{" "}
          <Link
            href="/politique-confidentialite"
            style={{ color: "var(--orange-deep)", textDecoration: "underline" }}
          >
            politique de confidentialité
          </Link>
          . *
        </span>
      </label>

      {leadErr && (
        <div className="sim-form-error" role="alert">
          {leadErr}
        </div>
      )}

      <p className="sim-form-foot">
        <strong>Vos données sont sécurisées.</strong> Jamais transmises à des
        tiers et supprimées dans les 24h suivant la dernière génération.
      </p>
    </aside>
  );

  // ===== left column content (depends on phase) =====
  const stageBlock = (
    <div className="sim-stage-main">
      <div className="sim-steps">
        <div className={stepClass("upload")}>
          <div className="sim-step-num">1</div>
          <span>Photo</span>
        </div>
        <div className={stepClass("style")}>
          <div className="sim-step-num">2</div>
          <span>Style</span>
        </div>
        <div className={stepClass("result")}>
          <div className="sim-step-num">3</div>
          <span>Aperçu</span>
        </div>
      </div>

      {/* ==================== UPLOAD ==================== */}
      {phase === "upload" && (
        <>
          <div
            className={`sim-dropzone ${dragging ? "dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div className="sim-dropzone-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3>Déposez la photo de votre façade</h3>
            <p>Une vue de face, en plein jour, sans véhicules devant — le résultat n&apos;en sera que meilleur.</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => inputRef.current?.click()}
            >
              Choisir une photo
            </button>
            <small>JPG, PNG ou WebP · max 8 Mo</small>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
          />
        </>
      )}

      {/* ==================== STYLE SELECTION ==================== */}
      {phase === "style" && preview && (
        <>
          <div className="sim-preview-single">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Photo de la façade à rénover" />
            <span className="sim-preview-label">Votre photo</span>
          </div>

          <div className="sim-styles">
            {styles.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`sim-style ${style === s.id ? "selected" : ""}`}
                onClick={() => setStyle(s.id)}
              >
                <span className="sim-style-name">{s.name}</span>
                <span className="sim-style-desc">{s.desc}</span>
              </button>
            ))}
          </div>

          <div className="sim-description">
            <label htmlFor="sim-desc">
              Précisions sur les travaux <span>(optionnel)</span>
            </label>
            <textarea
              id="sim-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION))}
              maxLength={MAX_DESCRIPTION}
              rows={4}
              placeholder="Ex : on souhaite garder les volets en bois, accentuer la corniche, choisir un ton beige clair plutôt que blanc, traiter aussi le soubassement…"
            />
            <div className="sim-description-foot">
              <small>
                Notre IA utilisera ces précisions pour adapter le rendu. Notre
                équipe en tiendra compte lors du diagnostic.
              </small>
              <small>
                {description.length}/{MAX_DESCRIPTION}
              </small>
            </div>
          </div>

          <div className="sim-actions">
            <button type="button" className="btn-outline" onClick={reset}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Changer de photo
            </button>
            <button type="button" className="btn-primary" onClick={generate}>
              Lancer la simulation
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* ==================== GENERATING ==================== */}
      {phase === "generating" && preview && (
        <div className="sim-preview">
          <div className="sim-preview-cell">
            <span className="sim-preview-label">Votre photo</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Photo originale" />
          </div>
          <div className="sim-preview-cell">
            <span className="sim-preview-label">Génération…</span>
            <div className="sim-loading">
              <div className="sim-spinner" />
              <div>
                <strong style={{ color: "#fff", display: "block", marginBottom: 4 }}>
                  Notre IA travaille…
                </strong>
                Cela prend généralement 20 à 40 secondes.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RESULT ==================== */}
      {phase === "result" && preview && result && (
        <>
          <div className="sim-preview">
            <div className="sim-preview-cell">
              <span className="sim-preview-label">Avant</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Façade avant rénovation" />
            </div>
            <div className="sim-preview-cell">
              <span className="sim-preview-label">Après — aperçu IA</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result} alt="Façade après rénovation simulée" />
            </div>
          </div>

          <div className="sim-disclaimer">
            <strong>Aperçu indicatif non contractuel.</strong> Cette visualisation
            est générée par intelligence artificielle. Le rendu réel dépendra de
            l&apos;état du support, des matériaux retenus et des contraintes
            techniques du chantier — nos équipes vous établiront un projet précis
            lors du diagnostic gratuit sur site.
          </div>

          <div className="sim-actions">
            <button type="button" className="btn-outline" onClick={reset}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              Tester un autre style
            </button>
            <Link href="/contact" className="btn-primary">
              Demander un devis sur ce projet
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </>
      )}

      {/* ==================== ERROR ==================== */}
      {phase === "error" && (
        <>
          <div className="sim-error" role="alert">
            {error || "Une erreur inconnue est survenue."}
          </div>
          <div className="sim-actions">
            <button type="button" className="btn-outline" onClick={reset}>
              Recommencer
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="sim-stage">
      <div className="sim-stage-grid">
        {stageBlock}
        {formBlock}
      </div>
    </div>
  );
}
