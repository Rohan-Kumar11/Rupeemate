"use client";

import React from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// ── Ledger palette (matches Tax Center / Manager) ──
const INK = "#1B2B44";
const INK_DEEP = "#152238";
const PAPER = "#FCFAF4";
const LINE = "#D9D0B8";

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Product",
    links: [
      { text: "Features", href: "#features" },
      { text: "Pricing", href: "#pricing" },
      { text: "Security", href: "#security" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "About", href: "#about" },
      { text: "Blog", href: "#blog" },
      { text: "Careers", href: "#careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { text: "Privacy", href: "#privacy" },
      { text: "Terms", href: "#terms" },
      { text: "Contact", href: "#contact" },
    ],
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full overflow-hidden pt-10 pb-6 sm:pt-12 md:pt-16 md:pb-8"
      style={{ backgroundColor: INK_DEEP, color: LINE }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 md:gap-12 mb-8 md:mb-12">
          {/* Brand Section */}
          <div className="col-span-3 md:col-span-1 space-y-3 md:space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 md:w-10 md:h-10 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: PAPER }}
              >
                <Wallet style={{ color: INK }} size={20} />
              </div>
              <h2
                className="font-serif text-lg md:text-xl font-bold"
                style={{ color: PAPER }}
              >
                RupeeMate
              </h2>
            </div>
            <p
              className="text-sm md:text-base leading-relaxed max-w-xs"
              style={{ color: LINE }}
            >
              Your intelligent companion for financial growth and investment
              success.
            </p>
          </div>

          {/* Footer Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="min-w-0">
              <h3
                className="font-semibold mb-3 md:mb-4 text-sm sm:text-base md:text-lg"
                style={{ color: PAPER }}
              >
                {section.title}
              </h3>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="inline-block py-0.5 transition-colors hover:text-[#D9A62B]"
                      style={{ color: LINE }}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div
          className="pt-6 md:pt-8 text-center text-xs sm:text-sm md:text-base"
          style={{ borderTop: `1px solid ${LINE}26`, color: LINE }}
        >
          <p>&copy; {currentYear} RupeeMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;