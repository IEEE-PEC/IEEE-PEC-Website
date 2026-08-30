"use client";

import { useState } from "react";
import PageHead from "@/components/layout/PageHead";
import { resourcesData } from "@/data/resources_data";
import { BookOpen, ExternalLink, Sparkles, Tag, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["All", "Roadmap", "Documentation", "Cheatsheet", "Research", "Tool"];

export default function ResourcesPage() {
  const [selectedCat, setSelectedCat] = useState("All");

  const filteredResources = resourcesData.filter(
    (res) => selectedCat === "All" || res.category === selectedCat
  );

  return (
    <>
      <PageHead
        title="Resources & Roadmaps | IEEE PEC Student Branch"
        description="Access curated roadmaps for embedded systems, ROS 2 robotics, KiCad PCB design, IEEE Xplore research paper publishing, and web development."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#002855] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00A3E0]">
            Knowledge Base & Toolkits
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Learning Resources & Roadmaps
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-300 leading-relaxed">
            Curated engineering roadmaps, software starter boilerplates, research guides, and hardware documentation prepared by IEEE PEC seniors.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedCat === cat
                    ? "bg-[#00629B] text-white shadow-md font-semibold"
                    : "bg-white dark:bg-slate-900 text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-border/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#00629B]/50"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-slate-800 text-[#00629B] dark:text-[#00A3E0] border border-blue-200 dark:border-slate-700">
                      {res.category}
                    </span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#00629B] transition-colors"
                      aria-label="Open link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-[#00629B] transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-border/60 flex flex-col space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {res.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between text-xs font-semibold text-[#00629B] dark:text-[#00A3E0] pt-1 hover:underline"
                  >
                    <span>Open Resource Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
