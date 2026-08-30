"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { chaptersData } from "@/data/chapters_data";
import { Code, Zap, HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  Code,
  Zap,
  HeartHandshake,
};

export default function ChaptersSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00629B]">
            Specialized Technical Societies
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mt-2">
            Our 3 Active Chapters
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            IEEE PEC Student Branch hosts 3 specialized societies spanning power systems & hardware robotics (PES), computer science & software engineering (CS), and women in technology (WIE).
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chaptersData.map((chapter, index) => {
            const Icon = iconMap[chapter.icon] || Zap;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-border/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#00629B]/50"
              >
                <div className="p-7 space-y-5">
                  {/* Top Bar: Real Chapter Logo + Chapter Tag */}
                  <div className="flex items-center justify-between">
                    {chapter.logoImage ? (
                      <div className="h-12 w-auto max-w-[120px] rounded-xl bg-white p-1 shadow-sm border border-border flex items-center justify-center">
                        <img
                          src={chapter.logoImage}
                          alt={chapter.name}
                          className="h-full w-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 dark:bg-[#00629B]/20 text-[#00629B] dark:text-[#00A3E0] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-foreground border border-border">
                      {chapter.shortName}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-[#00629B] transition-colors">
                      {chapter.name}
                    </h3>
                    <p className="text-xs font-medium text-[#00629B] dark:text-[#00A3E0] mt-1">
                      {chapter.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {chapter.description}
                  </p>

                  {/* Focus Areas */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Key Focus Areas
                    </p>
                    <ul className="space-y-1.5">
                      {chapter.focusAreas.slice(0, 3).map((area, i) => (
                        <li key={i} className="flex items-center text-xs text-foreground/80 gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00629B] shrink-0" />
                          <span className="truncate">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Footer */}
                <div className="px-7 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-border/60 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{chapter.stats.members}</span> Members
                  </div>
                  <Link
                    href={`/chapters#${chapter.id}`}
                    className="text-xs font-semibold text-[#00629B] dark:text-[#00A3E0] flex items-center gap-1 hover:underline"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-[#00629B] hover:bg-[#004B7A] text-white rounded-xl px-8">
            <Link href="/chapters">
              Explore All 3 Chapters
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
