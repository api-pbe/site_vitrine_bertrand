import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFileSync } from "fs";
import { join } from "path";
import { isGitHubConfigured, writeGitHubBinary } from "@/lib/github";

function isAuthenticated(): boolean {
  const session = cookies().get("admin_session");
  return !!session?.value;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const filename = formData.get("filename") as string;

    if (!file || !filename) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    const allowedNames = ["blackboard.jpg", "landscape.jpg"];
    if (!allowedNames.includes(filename)) {
      return NextResponse.json({ error: "Nom de fichier non autorisé" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isGitHubConfigured()) {
      await writeGitHubBinary(
        `public/${filename}`,
        buffer,
        `Mise à jour ${filename}`
      );
      return NextResponse.json({
        success: true,
        message: `${filename} téléversé. Le site sera mis à jour dans ~2 minutes.`,
      });
    }

    const filePath = join(process.cwd(), "public", filename);
    writeFileSync(filePath, buffer);
    return NextResponse.json({
      success: true,
      message: `${filename} téléversé.`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}
