"use client";

import { useEffect, useState, useMemo } from "react";
import PageHead from "@/components/layout/PageHead";
import TeamMemberCard from "@/components/TeamMemberCard";
import { teamMembersData } from "@/data/team_details";
import { TeamMember } from "@/types";
import { client } from "@/lib/supabase/supabase";
import { ShieldCheck, Users, Code, Cpu, Award } from "lucide-react";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembersData);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await client
          .from("team_members")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const supabaseIds = new Set(data.map((m: any) => m.id));
          const combined = [
            ...data,
            ...teamMembersData.filter((m) => !supabaseIds.has(m.id)),
          ];
          setMembers(combined);
        }
      } catch (err) {
        console.warn("Could not fetch team members from database, using static fallback.", err);
      }
    };

    fetchTeamMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    if (activeCategory === "all") return members;
    return members.filter((m) => m.category === activeCategory);
  }, [members, activeCategory]);

  const categories = [
    { id: "all", label: "All Members" },
    { id: "web", label: "Web & IT Team" },
    { id: "lead", label: "Leadership" },
    { id: "executive", label: "Executive Board" },
    { id: "technical", label: "Technical Domain" },
    { id: "hardware", label: "Hardware & Bots" },
  ];

  return (
    <>
      <PageHead
        title="Executive Committee & WebDev Team 2026–2027 | IEEE PEC Student Branch"
        description="Meet the Executive Committee, WebDev team, technical mentors, and student leaders at IEEE PEC Student Branch."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#002855] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#00A3E0] text-xs font-bold uppercase tracking-widest border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Executive Committee 2026 – 2027
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Meet the IEEE PEC Leadership
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-300 leading-relaxed">
            The visionary leadership, technical mentors, WebDev team, and student executives steering the IEEE PEC Student Branch for the 2026–2027 term.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#00A3E0] text-slate-950 shadow-lg scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Team Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No team members listed in this category yet.
            </div>
          ) : (
            /* Members Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {filteredMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
