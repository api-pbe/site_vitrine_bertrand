import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import PublicationCard from "@/components/PublicationCard";

export const metadata: Metadata = {
  title: "Publications — Bertrand Deroin",
};

interface Publication {
  year: number;
  title: string;
  authors: string;
  journal: string;
  arxiv: string | null;
  pdf: string | null;
}

function getPublications(): Publication[] {
  const filePath = join(process.cwd(), "data", "publications.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default function PublicationsPage() {
  const publications = getPublications();
  const sorted = [...publications].sort((a, b) => b.year - a.year);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
          Publications
        </h1>
        <p className="text-dark/50 text-sm mb-12">
          Sélection d&apos;articles de recherche
        </p>

        <div>
          {sorted.map((pub, i) => (
            <PublicationCard key={i} pub={pub} />
          ))}
        </div>
      </div>
    </div>
  );
}
