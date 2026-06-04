import { NextRequest, NextResponse } from "next/server";
import { checkFacade } from "@/lib/simulator/vision";
import { getRulesFor } from "@/lib/simulator/rules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Étape 1 du simulateur : analyse l'image téléversée et renvoie :
 *  - is_facade + diagnostic
 *  - les styles autorisés / bloqués (selon la matrice métier)
 *  - un message à afficher au visiteur
 *
 * Cette route est appelée immédiatement après l'upload, pour conditionner
 * l'UI (filtrage des styles, banner verdict). La génération vit dans
 * /api/simulator (qui re-vérifie côté serveur pour qu'on ne puisse pas
 * bypasser ce check depuis le front).
 */
export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête mal formée." }, { status: 400 });
  }

  const file = form.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucune image n'a été reçue." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image trop lourde (max 8 Mo)." }, { status: 413 });
  }

  try {
    const vision = await checkFacade(file);
    const rules = getRulesFor(vision.building_type);

    return NextResponse.json({
      vision,
      rules: {
        allowedStyles: rules.allowedStyles,
        recommended: rules.recommended,
        blockedStyles: rules.blockedStyles,
        visitorTip: rules.visitorTip,
      },
      stubbed: !process.env.GEMINI_API_KEY,
    });
  } catch (err) {
    console.error("vision route error:", err);
    return NextResponse.json(
      { error: "Analyse de l'image impossible. Réessayez dans un instant." },
      { status: 500 }
    );
  }
}
