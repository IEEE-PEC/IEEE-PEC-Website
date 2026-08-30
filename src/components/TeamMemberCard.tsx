"use client";

import { TeamMember } from "@/types";
import { User, ShieldCheck } from "lucide-react";

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  // Generate initials for generic placeholder
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group relative rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#00629B]/50 flex flex-col justify-between overflow-hidden">
      {/* Top Banner / Chapter Tag */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-slate-800 text-[#00629B] dark:text-[#00A3E0] border border-blue-200 dark:border-slate-700">
            {member.chapter || "IEEE PEC SB"}
          </span>
          {member.year && (
            <span className="text-xs text-muted-foreground font-medium">
              {member.year}
            </span>
          )}
        </div>

        {/* Member Generic Icon Placeholder & Basic Details */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#002855] via-[#00629B] to-[#00A3E0] text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-md shrink-0 border border-white/20 group-hover:scale-105 transition-transform duration-300">
            <span className="tracking-wider">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-[#00629B] transition-colors truncate">
              {member.name}
            </h3>
            <p className="text-xs font-semibold text-[#00629B] dark:text-[#00A3E0] mt-0.5 truncate">
              {member.role}
            </p>
            {member.department && (
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {member.department}
              </p>
            )}
          </div>
        </div>

        {/* Bio Description */}
        {member.description && (
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            {member.description}
          </p>
        )}
      </div>
    </div>
  );
}
