"use client";

import { useState } from "react";
import { TeamMember } from "@/types";
import { getAssetPath } from "@/lib/utils";
import { Github, Linkedin, Mail, Globe, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit?: () => void;
  isAdmin?: boolean;
}

export default function TeamMemberCard({
  member,
  onEdit,
  isAdmin = false,
}: TeamMemberCardProps) {
  const [imageErr, setImageErr] = useState(false);

  // Generate initials for generic placeholder
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasSocials =
    member.socials &&
    (member.socials.github ||
      member.socials.linkedin ||
      member.socials.email ||
      member.socials.website);

  return (
    <div className="group relative rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#00629B]/50 flex flex-col justify-between overflow-hidden">
      
      {/* Admin Edit Button Floating Top Right */}
      {(onEdit || isAdmin) && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="absolute top-4 right-4 z-10 text-xs gap-1.5 font-semibold bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-border shadow-sm hover:bg-[#00629B] hover:text-white transition-colors py-1 px-2.5 h-7 rounded-lg"
          title="Edit Member Details & Photo"
        >
          <Edit className="w-3.5 h-3.5 text-[#00629B] group-hover:text-white" />
          Edit
        </Button>
      )}

      {/* Top Banner / Chapter Tag */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pr-14">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-slate-800 text-[#00629B] dark:text-[#00A3E0] border border-blue-200 dark:border-slate-700">
            {member.chapter || "IEEE PEC SB"}
          </span>
          {member.year && (
            <span className="text-xs text-muted-foreground font-medium">
              {member.year}
            </span>
          )}
        </div>

        {/* Member Photo / Initials & Details */}
        <div className="flex items-center gap-4">
          {member.image && !imageErr ? (
            <img
              src={getAssetPath(member.image)}
              alt={member.name}
              onError={() => setImageErr(true)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-md shrink-0 border border-white/20 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#002855] via-[#00629B] to-[#00A3E0] text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-md shrink-0 border border-white/20 group-hover:scale-105 transition-transform duration-300">
              <span className="tracking-wider">{initials}</span>
            </div>
          )}

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

      {/* Social Links */}
      {hasSocials && (
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border/60">
          {member.socials?.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.socials?.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-[#0077B5] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.socials?.email && (
            <a
              href={`mailto:${member.socials.email}`}
              aria-label="Email"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {member.socials?.website && (
            <a
              href={member.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-[#00629B] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
