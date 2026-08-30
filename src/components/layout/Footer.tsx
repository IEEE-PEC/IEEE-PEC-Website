"use client";

import Link from "next/link";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Shield,
  Award,
} from "lucide-react";
import { getAssetPath } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-slate-900 text-slate-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#002855] via-[#00629B] to-[#004B7A] py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Outstanding Student Branch Award Winner • IEEE Chandigarh Subsection</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Ready to innovate with IEEE PEC Student Branch?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/80">
              Join active student innovators, researchers, and engineers driving breakthrough technology.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/apply"
              className="px-5 py-2 rounded-lg bg-white text-[#002855] font-semibold text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-sm"
            >
              Apply for Membership
            </Link>
            <Link
              href="/project"
              className="px-5 py-2 rounded-lg bg-white/10 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all border border-white/20"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: About IEEE PEC */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1 shadow-md border border-white/20">
                <img
                  src={getAssetPath("/images/logos/ieee-pec-logo.png")}
                  alt="IEEE PEC SB Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">IEEE Student Branch</h4>
                <p className="text-xs text-slate-400">Punjab Engineering College, Chandigarh</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              IEEE PEC, one of the largest technical societies at PEC, is an exemplary platform for students to polish their technical skillset in C++, Arduino, hardware bot building, and software engineering.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/IEEE-PEC"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#00629B] hover:border-[#00629B] transition-all"
                aria-label="GitHub"
                title="GitHub @IEEE-PEC"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/ieee-pec/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#00629B] hover:border-[#00629B] transition-all"
                aria-label="LinkedIn"
                title="LinkedIn IEEE PEC"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/ieeepec"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#00629B] hover:border-[#00629B] transition-all"
                aria-label="Instagram"
                title="Instagram @ieeepec"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/ieee.bts"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#00629B] hover:border-[#00629B] transition-all text-xs font-bold gap-1"
                aria-label="Behind the Scenes"
                title="Behind The Scenes @ieee.bts"
              >
                <span>BTS</span>
              </a>
              <a
                href="mailto:ieee.pecsb@gmail.com"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#00629B] hover:border-[#00629B] transition-all"
                aria-label="Email"
                title="Email ieee.pecsb@gmail.com"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: IEEE Chapters (Ordered: PES, CS, WIE) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Societies & Chapters
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/chapters#pes" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3E0]" /> Power & Energy Society (PES)
                </Link>
              </li>
              <li>
                <Link href="/chapters#cs" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3E0]" /> Computer Society (CS)
                </Link>
              </li>
              <li>
                <Link href="/chapters#wie" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3E0]" /> Women in Engineering (WIE)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/project" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3E0]" /> Technical Projects
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3E0]" /> Events & Workshops
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3E0]" /> 2026–2027 Committee
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3E0]" /> Learning Roadmaps & Docify
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3E0]" /> Join IEEE
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00A3E0] shrink-0 mt-0.5" />
                <span>Punjab Engineering College (Deemed to be University), Sector 12, Chandigarh, 160012</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#00A3E0] shrink-0" />
                  <a href="mailto:ieee.pecsb@gmail.com" className="hover:text-white transition-colors">
                    ieee.pecsb@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5 pl-6">
                  <a href="mailto:ieee@pec.edu.in" className="hover:text-white transition-colors">
                    ieee@pec.edu.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with discreet admin link & developer credit */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {currentYear} IEEE PEC Student Branch. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <p>
              Designed & Developed with 💙 by{" "}
              <a
                href="https://github.com/pratstick"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-300 hover:text-white underline decoration-[#00A3E0] underline-offset-2 transition-colors"
              >
                Pratyush
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://pec.ac.in/ieee" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 flex items-center gap-1">
              PEC Official <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://www.ieee.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 flex items-center gap-1">
              IEEE.org <ExternalLink className="w-3 h-3" />
            </a>
            <Link href="/admin" className="hover:text-slate-400 text-slate-600 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
