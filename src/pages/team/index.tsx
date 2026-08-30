"use client";

import PageHead from "@/components/layout/PageHead";
import TeamMemberCard from "@/components/TeamMemberCard";
import { teamMembersData } from "@/data/team_details";
import { ShieldCheck, Sparkles, Award } from "lucide-react";

export default function TeamPage() {
  return (
    <>
      <PageHead
        title="Executive Committee 2026–2027 | IEEE PEC Student Branch"
        description="Meet the 2026–2027 Executive Committee powering the IEEE PEC Student Branch team at Punjab Engineering College."
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
            The visionary leadership, technical mentors, and student executives steering the IEEE PEC Student Branch for the 2026–2027 academic term.
          </p>
        </div>
      </section>

      {/* Main Team Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {teamMembersData.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
