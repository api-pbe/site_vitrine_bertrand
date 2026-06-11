const GITHUB_API = "https://api.github.com";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github.v3+json",
  };
}

function getRepo() {
  return process.env.GITHUB_REPO || "";
}

export function isGitHubConfigured(): boolean {
  return !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

async function getFileSha(path: string): Promise<string | undefined> {
  const res = await fetch(
    `${GITHUB_API}/repos/${getRepo()}/contents/${path}`,
    { headers: getHeaders(), cache: "no-store" }
  );
  if (!res.ok) return undefined;
  const data = await res.json();
  return data.sha;
}

export async function readGitHubFile(path: string): Promise<string> {
  const res = await fetch(
    `${GITHUB_API}/repos/${getRepo()}/contents/${path}`,
    { headers: getHeaders(), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Impossible de lire ${path} depuis GitHub`);
  const data = await res.json();
  return Buffer.from(data.content, "base64").toString("utf-8");
}

export async function writeGitHubFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const sha = await getFileSha(path);
  const res = await fetch(
    `${GITHUB_API}/repos/${getRepo()}/contents/${path}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        ...(sha ? { sha } : {}),
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur GitHub API");
  }
}

export async function writeGitHubBinary(
  path: string,
  buffer: Buffer,
  message: string
): Promise<void> {
  const sha = await getFileSha(path);
  const res = await fetch(
    `${GITHUB_API}/repos/${getRepo()}/contents/${path}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        message,
        content: buffer.toString("base64"),
        ...(sha ? { sha } : {}),
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur GitHub API");
  }
}
