import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFileSync } from "fs";
import { join } from "path";
import { isGitHubConfigured, readGitHubFile } from "@/lib/github";

function isAuthenticated(): boolean {
  const session = cookies().get("admin_session");
  return !!session?.value;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  const allowedFiles = ["publications.json", "cv.json", "site.json"];
  if (!file || !allowedFiles.includes(file)) {
    return NextResponse.json({ error: "Fichier non autorisé" }, { status: 400 });
  }

  try {
    if (isGitHubConfigured()) {
      const content = await readGitHubFile(`data/${file}`);
      return NextResponse.json(JSON.parse(content));
    }

    const filePath = join(process.cwd(), "data", file);
    const raw = readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}
