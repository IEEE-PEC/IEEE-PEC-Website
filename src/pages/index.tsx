"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PageHead from "@/components/layout/PageHead";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import ChaptersSection from "@/components/ChaptersSection";
import ProjectCard from "@/components/ProjectCard";
import EventCard from "@/components/EventCard";
import EditEventDialog from "@/components/EditEventDialog";
import { projectsData } from "@/data/projects_data";
import { eventsData } from "@/data/events_data";
import { useAdmin } from "@/hooks/useAdmin";
import { client } from "@/lib/supabase/supabase";
import { EventType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
} from "lucide-react";
import { getAssetPath } from "@/lib/utils";

export default function Home() {
  const featuredProjects = projectsData.slice(0, 3);
  const [events, setEvents] = useState<EventType[]>(eventsData);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const { isAdmin } = useAdmin();

  const loadEvents = useCallback(async () => {
    try {
      const { data, error } = await client
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase events load error:", error);
        return;
      }

      if (data && data.length > 0) {
        const mappedEvents: EventType[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description,
          longDescription: item.long_description,
          capacity: item.capacity,
          image: item.image_url,
          registrationOpen: item.registration_open,
        }));

        const supabaseIds = new Set(mappedEvents.map((e) => e.id));
        const nonDuplicateStatic = eventsData.filter(
          (e) => !supabaseIds.has(e.id)
        );

        setEvents([...mappedEvents, ...nonDuplicateStatic]);
      } else {
        setEvents(eventsData);
      }
    } catch (err) {
      console.error("Events fetch error:", err);
      setEvents(eventsData);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const featuredEvents = events.slice(0, 3);

  const handleEditEvent = (ev: EventType) => {
    setSelectedEvent(ev);
    setEditDialogOpen(true);
  };

  return (
    <>
      <PageHead
        title="IEEE PEC Student Branch | Punjab Engineering College"
        description="Official website of IEEE Student Branch at Punjab Engineering College (PEC), Chandigarh. Explore our CS, WIE, and PES chapters, student bot projects, and flagship Techadroit events."
      />

      {/* Hero Section */}
      <Hero />

      {/* Stats Counter Section */}
      <StatsSection />

      {/* About IEEE PEC SB Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[#00629B] dark:text-[#00A3E0] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                About IEEE PEC Student Branch
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                An Exemplary Platform for Technical Skillsets & Personal Growth.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                IEEE PEC, one of the largest and strongest technical societies at Punjab Engineering College, is dedicated to spreading knowledge and enhancing technical proficiency in computer science, electrical, and electronics engineering across the region.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#00629B] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Competitive Coding</h4>
                    <p className="text-xs text-muted-foreground">HackerRank coding challenges, C++ OOPs, and algorithm workshops</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#00629B] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Hardware & Bot Making</h4>
                    <p className="text-xs text-muted-foreground">Hands-on Robo-Soccer, RC Hovercrafts, Gripper Bots, and PCB design</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#00629B] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Flagship Techadroit</h4>
                    <p className="text-xs text-muted-foreground">3-day technical extravaganza of hackathons, webinars, and VR workshops</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#00629B] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Industry Expert Lectures</h4>
                    <p className="text-xs text-muted-foreground">Speaker sessions by Qualcomm engineers, DRDO scientists, and leaders</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button asChild className="bg-[#00629B] hover:bg-[#004B7A] text-white rounded-xl">
                  <Link href="/team">
                    Meet Executive Team <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-border rounded-xl">
                  <Link href="/chapters">
                    Explore Our 3 Chapters
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Visual Card */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                <img
                  src={getAssetPath("/images/events/award-ceremony.jpg")}
                  alt="IEEE PEC Outstanding Student Branch Award Ceremony"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>Conferred by IEEE Chandigarh Subsection</span>
                  </div>
                  <h3 className="text-lg font-bold">Outstanding Student Branch Award Winner</h3>
                  <p className="text-xs text-slate-200">
                    Recognized for exemplary performance, student engagement, and technical workshops across Punjab Engineering College.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Section (CS, WIE, PES) */}
      <ChaptersSection />

      {/* Featured Projects Showcase */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00629B]">
                Student Innovations
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mt-2">
                Technical Projects & Bot Displays
              </h2>
            </div>
            <Link
              href="/project"
              className="mt-4 md:mt-0 text-sm font-semibold text-[#00629B] dark:text-[#00A3E0] flex items-center gap-1 hover:underline"
            >
              View all projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events & Workshops Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00629B]">
                Activities & Symposiums
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mt-2">
                Events & Techadroit
              </h2>
            </div>
            <Link
              href="/events"
              className="mt-4 md:mt-0 text-sm font-semibold text-[#00629B] dark:text-[#00A3E0] flex items-center gap-1 hover:underline"
            >
              View full event calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isAdmin={isAdmin}
                onEdit={handleEditEvent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Edit Event Modal */}
      <EditEventDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        event={selectedEvent}
        onSuccess={loadEvents}
      />
    </>
  );
}
