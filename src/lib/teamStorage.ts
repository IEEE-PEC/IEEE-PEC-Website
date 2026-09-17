import { TeamMember } from "@/types";
import { teamMembersData } from "@/data/team_details";
import { client } from "@/lib/supabase/supabase";

const STORAGE_KEY = "ieee_team_members_custom";
const DELETED_KEY = "ieee_team_members_deleted";

/**
 * Client-side image compression to downscale laptop photos to clean, lightweight JPEGs
 */
export function compressImage(
  file: File,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Fetch all team members by merging Supabase table, localStorage overrides, and static team details
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  let supabaseMembers: TeamMember[] = [];
  let localMembers: TeamMember[] = [];
  let deletedIds: string[] = [];

  // Read deleted IDs from localStorage
  if (typeof window !== "undefined") {
    try {
      const rawDeleted = localStorage.getItem(DELETED_KEY);
      if (rawDeleted) deletedIds = JSON.parse(rawDeleted);

      const rawLocal = localStorage.getItem(STORAGE_KEY);
      if (rawLocal) localMembers = JSON.parse(rawLocal);
    } catch (err) {
      console.warn("localStorage team load error:", err);
    }
  }

  // Fetch from Supabase
  try {
    const { data, error } = await client
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      supabaseMembers = data;
    }
  } catch (err) {
    console.warn("Supabase team load error:", err);
  }

  // Map keyed by ID
  const map = new Map<string, TeamMember>();

  // 1. Static defaults
  teamMembersData.forEach((m) => {
    if (!deletedIds.includes(m.id)) {
      map.set(m.id, m);
    }
  });

  // 2. Supabase members override
  supabaseMembers.forEach((m) => {
    if (!deletedIds.includes(m.id)) {
      map.set(m.id, m);
    }
  });

  // 3. LocalStorage overrides (highest local priority)
  localMembers.forEach((m) => {
    if (!deletedIds.includes(m.id)) {
      map.set(m.id, m);
    }
  });

  return Array.from(map.values());
}

/**
 * Upload image to Supabase storage or fall back to compressed base64 JPEG
 */
export async function uploadTeamMemberImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const cleanExt = fileExt.toLowerCase();
  const fileName = `webdev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;

  // Try event-images bucket
  try {
    const { error: uploadError } = await client.storage
      .from("event-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (!uploadError) {
      const { data: publicData } = client.storage
        .from("event-images")
        .getPublicUrl(fileName);
      return publicData.publicUrl;
    }
  } catch (err) {
    console.warn("Storage upload failed, using compressed fallback:", err);
  }

  // Try team-images bucket
  try {
    const { error: uploadError } = await client.storage
      .from("team-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (!uploadError) {
      const { data: publicData } = client.storage
        .from("team-images")
        .getPublicUrl(fileName);
      return publicData.publicUrl;
    }
  } catch (err) {
    console.warn("team-images bucket upload failed:", err);
  }

  // Guaranteed fallback: Client-side compressed JPEG base64 Data URL
  return await compressImage(file);
}

/**
 * Save / Update a team member in both localStorage and Supabase
 */
export async function saveTeamMember(member: TeamMember): Promise<void> {
  // 1. Save locally
  if (typeof window !== "undefined") {
    try {
      const rawLocal = localStorage.getItem(STORAGE_KEY);
      const existing: TeamMember[] = rawLocal ? JSON.parse(rawLocal) : [];
      const updated = [
        member,
        ...existing.filter((m) => m.id !== member.id),
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Remove from deleted list if present
      const rawDeleted = localStorage.getItem(DELETED_KEY);
      if (rawDeleted) {
        const deleted: string[] = JSON.parse(rawDeleted);
        const nextDeleted = deleted.filter((id) => id !== member.id);
        localStorage.setItem(DELETED_KEY, JSON.stringify(nextDeleted));
      }
    } catch (err) {
      console.warn("localStorage save warning:", err);
    }
  }

  // 2. Save to Supabase table
  try {
    await client.from("team_members").upsert({
      id: member.id,
      name: member.name,
      role: member.role,
      category: member.category,
      chapter: member.chapter,
      department: member.department || null,
      year: member.year || null,
      description: member.description || null,
      image: member.image || null,
      socials: member.socials || null,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Supabase upsert warning:", err);
  }
}

/**
 * Remove a team member
 */
export async function removeTeamMember(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const rawLocal = localStorage.getItem(STORAGE_KEY);
      const existing: TeamMember[] = rawLocal ? JSON.parse(rawLocal) : [];
      const updated = existing.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      const rawDeleted = localStorage.getItem(DELETED_KEY);
      const deleted: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
      if (!deleted.includes(id)) {
        deleted.push(id);
        localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
      }
    } catch (err) {
      console.warn("localStorage delete warning:", err);
    }
  }

  try {
    await client.from("team_members").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase delete warning:", err);
  }
}
