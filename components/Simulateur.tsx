"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { readLead } from "./SimulateurGate";

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

type Phase = "upload" | "style" | "generating" | "result" | "error";

export default function Simulateur() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("upload");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [style, setStyle] = useState<string>("chaux");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

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

  const generate = async () => {
    if (!file) return;
    setPhase("generating");
    setError("");

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("style", style);

      const lead = readLead();
      if (lead) {
        fd.append("lead_prenom", lead.prenom);
        fd.append("lead_nom", lead.nom);
        fd.append("lead_email", lead.email);
        fd.append("lead_telephone", lead.telephone);
        fd.append("lead_ville", lead.ville);
        if (lead.cp) fd.append("lead_cp", lead.cp);
      }

      const res = await fetch("/api/simulator", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? "Une erreur est survenue lors de la génération.");
        setPhase("error");
        return;
      }

      setResult(json.result ?? preview); // fallback to original if stubbed
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

  return (
    <div className="sim-stage">
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
            <small>JPG, PNG ou WebP · max 8 Mo · vos images ne sont jamais partagées</small>
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
          <div className="sim-preview">
            <div className="sim-preview-cell">
              <span className="sim-preview-label">Votre photo</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Photo de la façade à rénover" />
            </div>
            <div className="sim-preview-cell" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 40, textAlign: "center", color: "var(--ink-mute)" }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ marginBottom: 14, opacity: 0.4 }}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              <div style={{ fontSize: 14 }}>
                Sélectionnez un style ci-dessous
                <br />
                puis lancez la génération.
              </div>
            </div>
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

          <div className="sim-actions">
            <button type="button" className="btn-outline" onClick={reset}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Changer de photo
            </button>
            <button type="button" className="btn-primary" onClick={generate}>
              Générer l&apos;aperçu
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
            est générée par intelligence artificielle à partir de votre photo et du
            style choisi. Le rendu réel dépendra de l&apos;état du support, des
            matériaux retenus et des contraintes techniques du chantier — nos
            équipes vous établiront un projet précis lors du diagnostic gratuit
            sur site.
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
}
