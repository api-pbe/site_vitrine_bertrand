import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV — Bertrand Deroin",
};

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

function getCvData(): CvData {
  const filePath = join(process.cwd(), "data", "cv.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

const sectionTitles: Record<keyof CvData, string> = {
  formation: "Formation",
  positions: "Positions",
  distinctions: "Distinctions scientifiques",
  projets: "Projets de recherche",
  responsabilites: "Responsabilités scientifiques",
  enseignement: "Encadrement et enseignement",
  editorial: "Activités éditoriales",
};

function CvSection({
  title,
  entries,
}: {
  title: string;
  entries: CvEntry[];
}) {
  return (
    <section className="border-t border-gray-200 pt-8 pb-4">
      <h2 className="font-serif text-xl font-semibold text-slate_blue mb-6">
        {title}
      </h2>
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-1 md:gap-8"
          >
            {entry.period && (
              <span className="text-sm text-dark/40 font-mono whitespace-nowrap">
                {entry.period}
              </span>
            )}
            <p
              className={`text-sm leading-relaxed ${
                entry.period ? "" : "md:col-span-2"
              }`}
            >
              {entry.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CvPage() {
  const cv = getCvData();
  const sections = Object.keys(sectionTitles) as (keyof CvData)[];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
          Curriculum Vitae
        </h1>
        <p className="text-dark/50 text-sm mb-12">Bertrand Deroin</p>

        <div className="space-y-2">
          {sections.map((key) => (
            <CvSection
              key={key}
              title={sectionTitles[key]}
              entries={cv[key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
