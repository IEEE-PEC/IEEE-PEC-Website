"use client";

import { useState, useMemo } from "react";
import PageHead from "@/components/layout/PageHead";
import ProjectCard from "@/components/ProjectCard";
import { projectsData } from "@/data/projects_data";
import { projectCategoryOptions } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, FolderGit2, Sparkles } from "lucide-react";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <PageHead
        title="Innovations & Projects | IEEE PEC Student Branch"
        description="Explore the engineering projects, autonomous rovers, IoT mesh networks, and VLSI silicon designs built by IEEE PEC Student Branch members."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#002855] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00A3E0]">
            Engineering Portfolio
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Innovations & Projects
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-300 leading-relaxed">
            Real-world systems, autonomous vehicles, renewable microgrids, and smart IoT architectures built by student developers and researchers.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Search & Category Filter Bar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
            <div className="relative max-w-md mx-auto sm:mx-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects by title, tech stack (ESP32, ROS, KiCad)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-border"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
              {projectCategoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat.value
                      ? "bg-[#00629B] text-white shadow-sm font-semibold"
                      : "bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-border">
              <FolderGit2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-base font-bold text-foreground">No matching projects found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for different keywords or clearing your category filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
