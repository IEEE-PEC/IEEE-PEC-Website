"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import PageHead from "@/components/layout/PageHead";
import EventCard from "@/components/EventCard";
import EditEventDialog from "@/components/EditEventDialog";
import { eventsData } from "@/data/events_data";
import { eventCategoryOptions } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";
import { client } from "@/lib/supabase/supabase";
import { EventType } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar } from "lucide-react";

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
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

        // Merge Supabase events with static events (avoid duplicate ids)
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

  const filteredEvents = useMemo(() => {
    if (selectedCategory === "all") return events;
    return events.filter((event) => event.category === selectedCategory);
  }, [events, selectedCategory]);

  const handleCreateNew = () => {
    setSelectedEvent(null);
    setEditDialogOpen(true);
  };

  const handleEditEvent = (ev: EventType) => {
    setSelectedEvent(ev);
    setEditDialogOpen(true);
  };

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
            From 36-hour flagship hackathons and robotics arenas to FreeRTOS bootcamps and technical leadership summits.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Controls Bar: Category Filter Pills + Admin Add Event */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

            {isAdmin && (
              <Button
                type="button"
                onClick={handleCreateNew}
                className="bg-[#00629B] hover:bg-[#004B7A] text-white rounded-xl text-xs font-semibold gap-2 shrink-0 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Event
              </Button>
            )}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
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

      {/* Edit/Create Event Modal */}
      <EditEventDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        event={selectedEvent}
        onSuccess={loadEvents}
      />
    </>
  );
}
