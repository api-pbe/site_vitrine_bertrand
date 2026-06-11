"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg tracking-wide text-dark hover:text-slate_blue transition-colors"
        >
          Bertrand Deroin
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          <Link
            href="/cv"
            className="text-dark/70 hover:text-slate_blue transition-colors"
          >
            CV
          </Link>
          <Link
            href="/publications"
            className="text-dark/70 hover:text-slate_blue transition-colors"
          >
            Publications
          </Link>
          <Link
            href="/contact"
            className="text-dark/70 hover:text-slate_blue transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-dark/70"
          aria-label="Menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
          <Link
            href="/cv"
            onClick={() => setOpen(false)}
            className="block text-sm text-dark/70 hover:text-slate_blue"
          >
            CV
          </Link>
          <Link
            href="/publications"
            onClick={() => setOpen(false)}
            className="block text-sm text-dark/70 hover:text-slate_blue"
          >
            Publications
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block text-sm text-dark/70 hover:text-slate_blue"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
