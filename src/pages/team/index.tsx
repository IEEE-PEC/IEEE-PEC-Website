"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import PageHead from "@/components/layout/PageHead";
import TeamMemberCard from "@/components/TeamMemberCard";
import EditTeamMemberDialog from "@/components/EditTeamMemberDialog";
import { teamMembersData } from "@/data/team_details";
import { TeamMember } from "@/types";
import { client } from "@/lib/supabase/supabase";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserPlus, Sparkles } from "lucide-react";

import { getTeamMembers } from "@/lib/teamStorage";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembersData);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const { isAdmin } = useAdmin();

  const fetchTeamMembers = useCallback(async () => {
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (err) {
      console.warn("Fetch team members error:", err);
      setMembers(teamMembersData);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

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

  const handleAddMember = () => {
    setEditingMember(null);
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };

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

          {/* Admin Action Button */}
          {isAdmin && (
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleAddMember}
                className="bg-[#00A3E0] hover:bg-[#0082B3] text-slate-950 font-bold text-xs rounded-xl px-5 py-2.5 shadow-lg gap-2"
              >
                <UserPlus className="w-4 h-4" />
                + Add Member to WebDev Team
              </Button>
            </div>
          )}

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No team members listed in this category yet.
            </div>
          ) : (
            /* Members Grid - 4 per row on same level */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
              {filteredMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  isAdmin={isAdmin}
                  onEdit={() => handleEditMember(member)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Admin Dialog for adding / editing team members */}
      <EditTeamMemberDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={editingMember}
        onSuccess={fetchTeamMembers}
      />
    </>
  );
}
