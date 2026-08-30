"use client";

import { useState, useMemo } from "react";
import PageHead from "@/components/layout/PageHead";
import EventCard from "@/components/EventCard";
import { eventsData } from "@/data/events_data";
import { eventCategoryOptions } from "@/lib/utils";
import { Calendar, Sparkles } from "lucide-react";

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents = useMemo(() => {
    if (selectedCategory === "all") return eventsData;
    return eventsData.filter((event) => event.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <PageHead
        title="Events & TechSphere | IEEE PEC Student Branch"
        description="Check upcoming technical symposiums, hackathons, robotics competitions, and hands-on bootcamps hosted by IEEE PEC Student Branch."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#002855] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00A3E0]">
            Activity Calendar & Symposiums
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Events & Workshops
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-300 leading-relaxed">
            From 36-hour flagship hackathons and robotics arenas to FreeRTOS bootcamps and women leadership summits.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {eventCategoryOptions.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === cat.value
                    ? "bg-[#00629B] text-white shadow-md font-semibold"
                    : "bg-white dark:bg-slate-900 text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
