import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFileSync } from "fs";
import { join } from "path";
import { isGitHubConfigured, writeGitHubFile } from "@/lib/github";

function isAuthenticated(): boolean {
  const session = cookies().get("admin_session");
  return !!session?.value;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { file, data } = body;

    const allowedFiles = ["publications.json", "cv.json", "site.json"];
    if (!allowedFiles.includes(file)) {
      return NextResponse.json({ error: "Fichier non autorisé" }, { status: 400 });
    }

    const content = JSON.stringify(data, null, 2);

    if (isGitHubConfigured()) {
      await writeGitHubFile(`data/${file}`, content, `Mise à jour ${file}`);
      return NextResponse.json({
        success: true,
        message: "Sauvegardé. Le site sera mis à jour dans ~2 minutes.",
      });
    }

    const filePath = join(process.cwd(), "data", file);
    writeFileSync(filePath, content, "utf-8");
    return NextResponse.json({ success: true, message: "Sauvegardé." });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}
