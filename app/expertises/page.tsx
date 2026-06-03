import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBlock from "@/components/CtaBlock";

export const metadata: Metadata = {
  title: "Nos expertises · Maçonnerie · Patrimoine · Ravalement · ITE · VRD · Études",
  description:
    "Cinq domaines d'expertise : maçonnerie générale, ravalement & ITE, réhabilitation du patrimoine bâti ancien, VRD/dalles/escaliers/chapes, et études techniques. Île-de-France, Qualibat RGE.",
  alternates: { canonical: "https://www.fbr-patrimoine.com/expertises" },
};

type Detail = {
  id: string;
  bg: string;
  reverse?: boolean;
  num: string;
  label: string;
  titleStart: string;
  titleEm: string;
  titleEnd?: string;
  body: React.ReactNode;
  img: string;
  imgAlt: string;
  list: string[];
};

const DETAILS: Detail[] = [
  {
    id: "maconnerie",
    bg: "#fff",
    num: "01",
    label: "01 — Maçonnerie",
    titleStart: "Maçonnerie ",
    titleEm: "générale",
    body: (
      <>
        <p>
          Gros œuvre, second œuvre, construction et rénovation en pierre, brique,
          béton ou béton armé. Nos maçons maîtrisent aussi bien les techniques
          contemporaines que les méthodes anciennes — pose à la chaux, taille de
          pierre, reprises en sous-œuvre — indispensables à la restauration du bâti
          ancien comme à la construction durable.
        </p>
        <p>
          Que le projet concerne un mur de soutènement, une extension en pierre
          apparente, une reprise de fondation ou la consolidation d&apos;une cage
          d&apos;escalier, nous intervenons avec la même rigueur technique.
        </p>
      </>
    ),
    img: "/project9.jpg",
    imgAlt: "Maçonnerie traditionnelle, pavage en pierre",
    list: [
      "Gros œuvre & second œuvre",
      "Béton armé, planchers, dalles",
      "Pierre de taille, moellons, parements",
      "Briques apparentes & pavages anciens",
      "Reprises en sous-œuvre & confortement",
      "Démolition technique & curage",
    ],
  },
  {
    id: "ravalement",
    bg: "var(--stone)",
    reverse: true,
    num: "02",
    label: "02 — Ravalement & ITE",
    titleStart: "Ravalement de façades & ",
    titleEm: "ITE",
    body: (
      <>
        <p>
          Le ravalement protège, embellit et valorise. Nos équipes prennent en charge
          l&apos;ensemble du processus : montage d&apos;échafaudage, nettoyage,
          traitement des fissures, application d&apos;enduits à la chaux ou modernes,
          hydrofugation, peinture et finition. Du pavillon individuel au clocher
          d&apos;église, nous adaptons techniques et matériaux à chaque support.
        </p>
        <p>
          Notre certification <strong>Qualibat RGE</strong> vous donne accès aux
          aides MaPrimeRénov&apos; et CEE pour l&apos;<strong>isolation thermique par
          l&apos;extérieur (ITE)</strong> — polystyrène, laine de roche, fibre de
          bois, bardage rapporté, enduit mince sur isolant. Nous vous accompagnons
          dans la constitution complète des dossiers administratifs.
        </p>
      </>
    ),
    img: "/project5.jpg",
    imgAlt: "Ravalement de clocher sur échafaudage",
    list: [
      "Hydrogommage & nettoyage haute pression",
      "Enduits à la chaux & enduits modernes",
      "Peinture de façade & lasures",
      "ITE : PSE, laine de roche, fibre de bois",
      "Bardage rapporté ventilé",
      "Accompagnement aides MaPrimeRénov' / CEE",
    ],
  },
  {
    id: "patrimoine",
    bg: "#fff",
    num: "03",
    label: "03 — Patrimoine",
    titleStart: "Réhabilitation & valorisation du ",
    titleEm: "patrimoine bâti ancien",
    body: (
      <>
        <p>
          Façades haussmanniennes, hôtels particuliers, édifices religieux, cages
          d&apos;escalier classées : la restauration du patrimoine bâti exige un
          dialogue permanent avec l&apos;œuvre. Nos interventions privilégient les
          matériaux et techniques d&apos;origine pour préserver l&apos;authenticité,
          l&apos;âme et la valeur historique de chaque édifice.
        </p>
        <p>
          De la consolidation structurelle à la finition décorative — moulures,
          corniches, ornementations en pierre — nous travaillons en lien avec
          architectes du patrimoine et ABF lorsque le bâtiment l&apos;exige.
          <strong> Spécialistes amiante (sous-section 4) et plomb</strong>,
          indispensables sur le bâti ancien.
        </p>
      </>
    ),
    img: "/project6.jpg",
    imgAlt: "Façade haussmannienne parisienne",
    list: [
      "Façades haussmanniennes & Art Nouveau",
      "Édifices religieux & monuments classés",
      "Hôtels particuliers & immeubles de caractère",
      "Cages d'escalier, parties communes anciennes",
      "Moulures, corniches, ornementations",
      "Spécialistes amiante & plomb",
    ],
  },
  {
    id: "vrd",
    bg: "var(--stone)",
    reverse: true,
    num: "04",
    label: "04 — VRD & Aménagements",
    titleStart: "VRD, dalles, escaliers, ",
    titleEm: "chapes",
    body: (
      <>
        <p>
          Voirie, réseaux divers, dalles béton, escaliers extérieurs, chapes liquides
          ou traditionnelles : nous prenons en charge les aménagements extérieurs et
          les ouvrages techniques qui complètent un chantier de bâtiment.
        </p>
        <p>
          De la cour intérieure d&apos;un immeuble parisien à la dalle de fondation
          d&apos;une extension, en passant par la création d&apos;un escalier
          extérieur en pierre, nous intervenons avec le même niveau d&apos;exigence.
        </p>
      </>
    ),
    img: "/project3.jpg",
    imgAlt: "Dalle béton et aménagement extérieur",
    list: [
      "Voirie & réseaux divers (VRD)",
      "Dalles béton & chapes liquides",
      "Escaliers extérieurs",
      "Aménagements de cours intérieures",
      "Pavages, dallages, bordures",
      "Travaux publics annexes",
    ],
  },
  {
    id: "etudes",
    bg: "#fff",
    num: "05",
    label: "05 — Études",
    titleStart: "Études techniques & ",
    titleEm: "accompagnement de projet",
    body: (
      <>
        <p>
          Notre fondateur, ingénieur diplômé de Polytechnique Hauts-de-France, a
          exercé plusieurs années en bureau d&apos;études avant de monter
          l&apos;entreprise. Cette double culture — études et terrain — fait la
          différence : nous concevons et nous réalisons.
        </p>
        <p>
          Diagnostic structurel, faisabilité technique, choix des matériaux,
          chiffrage de variantes, accompagnement aux dossiers d&apos;aides ou aux
          autorisations d&apos;urbanisme : nous sécurisons votre projet en amont,
          avant même le premier coup de truelle.
        </p>
      </>
    ),
    img: "/project2.jpg",
    imgAlt: "Études techniques sur site",
    list: [
      "Diagnostic structurel & visites techniques",
      "Études de faisabilité",
      "Chiffrage détaillé & variantes",
      "Constitution dossiers d'aides (MaPrimeRénov', CEE)",
      "Accompagnement déclarations d'urbanisme",
      "Conseil matériaux & techniques",
    ],
  },
];

export default function ExpertisesPage() {
  return (
    <>
      <PageHero
        bgImage="/project9.jpg"
        breadcrumb="Nos expertises"
        eyebrow="4 métiers · 1 exigence"
        title={
          <>
            Quatre métiers,
            <br />
            <em>une même exigence</em>.
          </>
        }
        description="De la maçonnerie traditionnelle à l'isolation performante, nos équipes interviennent sur tous types de bâtiments — patrimoine ancien, copropriétés, édifices remarquables — avec le même souci du détail."
      />

      {DETAILS.map((d) => (
        <section key={d.id} style={{ background: d.bg }} id={d.id}>
          <div className="container">
            <div className={`exp-detail reveal ${d.reverse ? "reverse" : ""}`}>
              <div className="exp-detail-img">
                <Image
                  src={d.img}
                  alt={d.imgAlt}
                  width={900}
                  height={680}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="exp-detail-text">
                <div className="section-label">{d.label}</div>
                <h3>
                  {d.titleStart}
                  <em>{d.titleEm}</em>
                  {d.titleEnd}
                </h3>
                {d.body}
                <ul className="exp-detail-list">
                  {d.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBlock
        eyebrow="Votre projet"
        title={
          <>
            Un projet de <em>ravalement</em>,
            <br />d&apos;isolation ou de restauration ?
          </>
        }
        text="Échangeons sur votre projet. Nos équipes se déplacent gratuitement sur site pour établir un diagnostic précis et un devis détaillé sous 48h. Étude personnalisée, sans engagement."
      />
    </>
  );
}
