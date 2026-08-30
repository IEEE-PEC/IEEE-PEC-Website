"use client";

import { useState } from "react";
import { EventType } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { getAssetPath } from "@/lib/utils";

export default function EventCard({ event }: { event: EventType }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="group rounded-2xl border border-border/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#00629B]/50 flex flex-col justify-between">
        {/* Top Image & Category Badge */}
        {event.image && (
          <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={getAssetPath(event.image)}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#002855]/90 text-white backdrop-blur-md">
                {event.category}
              </span>
            </div>
            {event.registrationOpen && (
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600/90 text-white backdrop-blur-md">
                  Open for Registration
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            {/* Title */}
            <h3 className="font-bold text-lg text-foreground group-hover:text-[#00629B] transition-colors line-clamp-2">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Card Footer Actions */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs font-semibold text-[#00629B] dark:text-[#00A3E0] hover:underline"
            >
              Read Overview
            </button>
            <Button
              asChild
              size="sm"
              className="bg-[#00629B] hover:bg-[#004B7A] text-white text-xs"
            >
              <Link href={event.registrationLink || "/apply"}>
                Participate <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00629B] text-white">
                {event.category}
              </span>
              {event.capacity && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                  Expected Attendance: {event.capacity}+
                </span>
              )}
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {event.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 my-2">
            {event.image && (
              <div className="relative h-56 w-full rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={getAssetPath(event.image)}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00629B]">
                About This Event
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {event.longDescription || event.description}
              </p>
            </div>

            {/* Speakers if any */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Keynote Speakers & Mentors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.speakers.map((sp, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border">
                      {sp.image && (
                        <img
                          src={sp.image}
                          alt={sp.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-xs font-bold text-foreground">{sp.name}</p>
                        <p className="text-[11px] text-muted-foreground">{sp.role}, {sp.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#002855] dark:text-blue-200">
                  Ready to participate?
                </p>
                <p className="text-xs text-muted-foreground">
                  Open for all PEC engineering students.
                </p>
              </div>
              <Button asChild className="bg-[#00629B] hover:bg-[#004B7A] text-white">
                <Link href={event.registrationLink || "/apply"} onClick={() => setModalOpen(false)}>
                  Apply / Register
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
