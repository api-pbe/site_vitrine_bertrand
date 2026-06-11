"use client";

import { useState, useEffect, useCallback } from "react";

type Tab = "general" | "cv" | "publications";

interface Publication {
  year: number;
  title: string;
  authors: string;
  journal: string;
  arxiv: string | null;
  pdf: string | null;
}

interface SiteData {
  heroTitle: string;
  heroSubtitle: string;
  heroLine2: string;
  quote: string;
}

interface CvEntry {
  period?: string;
  description: string;
}

interface CvData {
  formation: CvEntry[];
  positions: CvEntry[];
  distinctions: CvEntry[];
  projets: CvEntry[];
  responsabilites: CvEntry[];
  enseignement: CvEntry[];
  editorial: CvEntry[];
}

const cvSectionLabels: Record<keyof CvData, string> = {
  formation: "Formation",
  positions: "Positions",
  distinctions: "Distinctions scientifiques",
  projets: "Projets de recherche",
  responsabilites: "Responsabilités scientifiques",
  enseignement: "Encadrement et enseignement",
  editorial: "Activités éditoriales",
};

async function saveData(file: string, data: unknown): Promise<string> {
  const res = await fetch("/api/admin/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file, data }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erreur");
  return json.message || "Sauvegardé";
}

async function uploadFile(file: File, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", filename);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erreur");
  return json.message || "Téléversé";
}

function StatusMessage({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <p className={`text-sm mt-3 ${type === "success" ? "text-green-600" : "text-red-600"}`}>
      {message}
    </p>
  );
}

function GeneralTab({ site, setSite }: { site: SiteData; setSite: (s: SiteData) => void }) {
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  async function handleSave() {
    try {
      const msg = await saveData("site.json", site);
      setStatus({ msg, type: "success" });
    } catch (e: unknown) {
      setStatus({ msg: (e as Error).message, type: "error" });
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, filename: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const msg = await uploadFile(file, filename);
      setStatus({ msg, type: "success" });
    } catch (err: unknown) {
      setStatus({ msg: (err as Error).message, type: "error" });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Titre hero</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value={site.heroTitle}
          onChange={(e) => setSite({ ...site, heroTitle: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sous-titre</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value={site.heroSubtitle}
          onChange={(e) => setSite({ ...site, heroSubtitle: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Deuxième ligne</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value={site.heroLine2}
          onChange={(e) => setSite({ ...site, heroLine2: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Citation</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value={site.quote}
          onChange={(e) => setSite({ ...site, quote: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label className="block text-sm font-medium mb-1">blackboard.jpg</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, "blackboard.jpg")}
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">landscape.jpg</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, "landscape.jpg")}
            className="text-sm"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-slate_blue text-white text-sm px-6 py-2 rounded hover:bg-slate_blue/90"
      >
        Sauvegarder
      </button>
      {status && <StatusMessage message={status.msg} type={status.type} />}
    </div>
  );
}

function CvTab({ cv, setCv }: { cv: CvData; setCv: (c: CvData) => void }) {
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function updateSection(key: keyof CvData, text: string) {
    const lines = text.split("\n").filter((l) => l.trim());
    const entries: CvEntry[] = lines.map((line) => {
      const match = line.match(/^(.+?)\s*—\s*(.+)$/);
      if (match) {
        return { period: match[1].trim(), description: match[2].trim() };
      }
      return { description: line.trim() };
    });
    setCv({ ...cv, [key]: entries });
  }

  function sectionToText(entries: CvEntry[]): string {
    return entries
      .map((e) => (e.period ? `${e.period} — ${e.description}` : e.description))
      .join("\n");
  }

  async function handleSave() {
    try {
      const msg = await saveData("cv.json", cv);
      setStatus({ msg, type: "success" });
    } catch (e: unknown) {
      setStatus({ msg: (e as Error).message, type: "error" });
    }
  }

  const sections = Object.keys(cvSectionLabels) as (keyof CvData)[];

  return (
    <div className="space-y-6">
      {sections.map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium mb-1">
            {cvSectionLabels[key]}
          </label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
            rows={Math.max(3, cv[key].length + 1)}
            value={sectionToText(cv[key])}
            onChange={(e) => updateSection(key, e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            Une entrée par ligne. Format : « Période — Description » ou juste « Description »
          </p>
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-slate_blue text-white text-sm px-6 py-2 rounded hover:bg-slate_blue/90"
      >
        Sauvegarder
      </button>
      {status && <StatusMessage message={status.msg} type={status.type} />}
    </div>
  );
}

function PublicationsTab({
  publications,
  setPublications,
}: {
  publications: Publication[];
  setPublications: (p: Publication[]) => void;
}) {
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Publication>({
    year: new Date().getFullYear(),
    title: "",
    authors: "",
    journal: "",
    arxiv: null,
    pdf: null,
  });

  function resetForm() {
    setForm({
      year: new Date().getFullYear(),
      title: "",
      authors: "",
      journal: "",
      arxiv: null,
      pdf: null,
    });
    setEditing(null);
  }

  function handleEdit(index: number) {
    setForm(publications[index]);
    setEditing(index);
  }

  function handleDelete(index: number) {
    const updated = publications.filter((_, i) => i !== index);
    setPublications(updated);
  }

  function handleSubmitForm() {
    if (!form.title || !form.authors) return;

    if (editing !== null) {
      const updated = [...publications];
      updated[editing] = form;
      setPublications(updated);
    } else {
      setPublications([form, ...publications]);
    }
    resetForm();
  }

  async function handleSave() {
    try {
      const sorted = [...publications].sort((a, b) => b.year - a.year);
      setPublications(sorted);
      const msg = await saveData("publications.json", sorted);
      setStatus({ msg, type: "success" });
    } catch (e: unknown) {
      setStatus({ msg: (e as Error).message, type: "error" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-gray-50 border rounded p-4 space-y-3">
        <h3 className="text-sm font-medium">
          {editing !== null ? "Modifier la publication" : "Ajouter une publication"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Auteurs"
            value={form.authors}
            onChange={(e) => setForm({ ...form, authors: e.target.value })}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Journal / Revue"
            value={form.journal}
            onChange={(e) => setForm({ ...form, journal: e.target.value })}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Année"
            type="number"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: parseInt(e.target.value) || 0 })
            }
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="URL arXiv / HAL (optionnel)"
            value={form.arxiv || ""}
            onChange={(e) =>
              setForm({ ...form, arxiv: e.target.value || null })
            }
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="URL PDF (optionnel)"
            value={form.pdf || ""}
            onChange={(e) =>
              setForm({ ...form, pdf: e.target.value || null })
            }
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmitForm}
            className="bg-slate_blue text-white text-sm px-4 py-1.5 rounded hover:bg-slate_blue/90"
          >
            {editing !== null ? "Mettre à jour" : "Ajouter"}
          </button>
          {editing !== null && (
            <button
              onClick={resetForm}
              className="text-sm px-4 py-1.5 border rounded hover:bg-gray-50"
            >
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {publications.map((pub, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-3 border rounded text-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{pub.title}</p>
              <p className="text-gray-500 text-xs">
                {pub.authors} · {pub.journal} · {pub.year}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => handleEdit(i)}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="text-xs px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="bg-slate_blue text-white text-sm px-6 py-2 rounded hover:bg-slate_blue/90"
      >
        Sauvegarder
      </button>
      {status && <StatusMessage message={status.msg} type={status.type} />}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("general");
  const [site, setSite] = useState<SiteData | null>(null);
  const [cv, setCv] = useState<CvData | null>(null);
  const [publications, setPublications] = useState<Publication[] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [siteRes, cvRes, pubRes] = await Promise.all([
        fetch("/api/admin/data?file=site.json"),
        fetch("/api/admin/data?file=cv.json"),
        fetch("/api/admin/data?file=publications.json"),
      ]);

      if (siteRes.status === 401 || cvRes.status === 401 || pubRes.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      setSite(await siteRes.json());
      setCv(await cvRes.json());
      setPublications(await pubRes.json());
    } catch {
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-14">
        <p className="text-sm text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!site || !cv || !publications) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-14">
        <p className="text-sm text-red-500">Erreur de chargement des données</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: "Infos générales" },
    { key: "cv", label: "CV" },
    { key: "publications", label: "Publications" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-2xl font-bold mb-6">Administration</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                tab === t.key
                  ? "border-slate_blue text-slate_blue"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded border p-6">
          {tab === "general" && <GeneralTab site={site} setSite={setSite} />}
          {tab === "cv" && <CvTab cv={cv} setCv={setCv} />}
          {tab === "publications" && (
            <PublicationsTab
              publications={publications}
              setPublications={setPublications}
            />
          )}
        </div>
      </div>
    </div>
  );
}
