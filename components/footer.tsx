"use client";

import React from "react";
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
const AMBER = "#B8860B";

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
    <footer className="pt-16 pb-8" style={{ backgroundColor: INK_DEEP, color: LINE }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: PAPER }}>
                <Wallet style={{ color: INK }} size={20} />
              </div>
              <h2 className="font-serif text-xl font-bold" style={{ color: PAPER }}>RupeeMate</h2>
            </div>
            <p className="leading-relaxed max-w-xs" style={{ color: LINE }}>
              Your intelligent companion for financial growth and investment
              success.
            </p>
          </div>

          {/* Footer Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 text-lg" style={{ color: PAPER }}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-[#D9A62B]"
                      style={{ color: LINE }}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center" style={{ borderTop: `1px solid ${LINE}26`, color: LINE }}>
          <p>© {currentYear} RupeeMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
