"use client";

import PageHead from "@/components/layout/PageHead";
import { chaptersData } from "@/data/chapters_data";
import { Code, Zap, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAssetPath } from "@/lib/utils";

const iconMap: Record<string, any> = {
  Code,
  Zap,
  HeartHandshake,
};

export default function ChaptersPage() {
  return (
    <>
      <PageHead
        title="Chapters & Societies | IEEE PEC Student Branch"
        description="Explore the 3 technical chapters under IEEE PEC Student Branch: Power & Energy Society (PES), Computer Society (CS), and Women in Engineering (WIE)."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#002855] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00A3E0]">
            Technical Societies & Affinity Groups
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Our 3 Active Chapters
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-300 leading-relaxed">
            Our student branch operates 3 specialized societies catering to power systems & hardware robotics, computer science, and gender diversity in engineering.
          </p>
        </div>
      </section>

      {/* Chapters Content */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {chaptersData.map((chapter, idx) => {
            const Icon = iconMap[chapter.icon] || Zap;

            return (
              <div
                key={chapter.id}
                id={chapter.id}
                className="scroll-mt-24 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-border/80 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Info Column */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-4">
                      {chapter.logoImage ? (
                        <div className="h-14 w-auto max-w-[140px] rounded-2xl bg-white p-1.5 shadow-sm border border-border flex items-center justify-center">
                          <img
                            src={getAssetPath(chapter.logoImage)}
                            alt={chapter.name}
                            className="h-full w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-[#00629B]/10 text-[#00629B] dark:text-[#00A3E0] flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#00629B]">
                          Chapter #{idx + 1}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                          {chapter.name} ({chapter.shortName})
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-[#00629B] dark:text-[#00A3E0]">
                      "{chapter.tagline}"
                    </p>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {chapter.description}
                    </p>

                    {/* Focus Areas List */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Core Research & Domain Focus
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {chapter.focusAreas.map((area, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-medium text-foreground/90">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00629B] shrink-0" />
                            <span>{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/60">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                        <p className="text-lg font-extrabold text-[#00629B]">{chapter.stats.members}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">Members</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                        <p className="text-lg font-extrabold text-[#00629B]">{chapter.stats.workshops}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">Workshops</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                        <p className="text-lg font-extrabold text-[#00629B]">{chapter.stats.projects}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">Projects</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button asChild className="bg-[#00629B] hover:bg-[#004B7A] text-white rounded-xl">
                        <Link href="/apply">
                          Apply to Join {chapter.shortName} Chapter
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Visual Column */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg border border-border">
                      <img
                        src={getAssetPath(chapter.bannerImage)}
                        alt={chapter.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                          Active Chapter
                        </span>
                        <span className="text-xs font-bold text-white tracking-wide">
                          IEEE PEC Student Branch
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
