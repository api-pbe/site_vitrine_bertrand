import Image from "next/image";
import { readFileSync } from "fs";
import { join } from "path";



function getSiteData() {
  const filePath = join(process.cwd(), "data", "site.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

const logos = [
  {
    src: "/anr-logo.png",
    alt: "ANR — Projet IsoMoDyn",
    href: "https://anr.fr/Projet-ANR-25-CE40-1360",
  },
  {
    src: "/logo_cnrs.png",
    alt: "CNRS",
    href: "https://www.cnrs.fr/fr",
  },
  {
    src: "/logo_agm.png",
    alt: "Laboratoire AGM",
    href: "https://cyagm.cnrs.fr/",
  },
  {
    src: "/logo_cy.png",
    alt: "CY Cergy Paris Université",
    href: "https://www.cyu.fr/",
  },
];

export default function Home() {
  const site = getSiteData();

  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/blackboard.jpg"
            alt="Tableau noir couvert de diagrammes mathématiques"
            fill
            className="object-cover object-center"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-[#1a3a2a]/60" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-3xl">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-white/90 mb-3">
            {site.heroSubtitle}
          </p>
          <p className="text-base sm:text-lg text-white/60">
            {site.heroLine2}
          </p>
        </div>
      </section>

      <section className="py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-10 sm:gap-16 flex-wrap">
            {logos.map((logo) => (
              <a
                key={logo.href}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={48}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
