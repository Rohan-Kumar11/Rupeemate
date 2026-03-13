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
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Wallet className="text-white" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">RupeeMate</h2>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              Your intelligent companion for financial growth and investment
              success.
            </p>
          </div>

          {/* Footer Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
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
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {currentYear} RupeeMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;