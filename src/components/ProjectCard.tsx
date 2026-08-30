"use client";

import { useState } from "react";
import { ProjectType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { getAssetPath } from "@/lib/utils";

export default function ProjectCard({ project }: { project: ProjectType }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group cursor-pointer rounded-2xl border border-border/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#00629B]/50 flex flex-col justify-between"
      >
        {/* Project Thumbnail Image */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={getAssetPath(project.image)}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#002855]/90 text-white backdrop-blur-md shadow-sm">
              {project.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-sm ${
              project.status === "Completed"
                ? "bg-emerald-600/90 text-white"
                : "bg-amber-600/90 text-white"
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-[#00629B] transition-colors line-clamp-1">
                {project.title}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-[#00629B] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Technologies Chips */}
          <div className="pt-2">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00629B] text-white">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {project.status}
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {project.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              IEEE PEC Student Branch Project Initiative
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-2">
            <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-100">
              <img
                src={getAssetPath(project.image)}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#00629B]">
                Project Overview & Architecture
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {project.longDescription || project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Technologies & Tools Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-slate-800 text-[#00629B] dark:text-[#00A3E0] border border-blue-200 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo Link if present */}
            {project.demoUrl && (
              <div className="flex items-center justify-end pt-2">
                <Button asChild size="sm" className="bg-[#00629B] hover:bg-[#004B7A] text-white">
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1.5" /> Live Demo
                  </a>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
