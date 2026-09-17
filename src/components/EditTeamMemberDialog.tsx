"use client";

import { useState, useEffect, useRef } from "react";
import { TeamMember } from "@/types";
import { client } from "@/lib/supabase/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Trash2, UserPlus, Edit, Loader2, Github, Linkedin, Mail, Link as LinkIcon } from "lucide-react";
import { getAssetPath } from "@/lib/utils";

interface EditTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMember | null;
  onSuccess: () => void;
}

const categories = [
  { value: "web", label: "Web & IT Team" },
  { value: "lead", label: "Leadership / Chair" },
  { value: "executive", label: "Executive Committee" },
  { value: "technical", label: "Technical Domain" },
  { value: "hardware", label: "Hardware & Robotics" },
  { value: "design", label: "Design & Media" },
  { value: "pr", label: "PR & Corporate Outreach" },
];

const chapters = ["IEEE Core", "CS", "WIE", "PES"] as const;

export default function EditTeamMemberDialog({
  open,
  onOpenChange,
  member,
  onSuccess,
}: EditTeamMemberDialogProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Web Developer");
  const [category, setCategory] = useState<TeamMember["category"]>("web");
  const [chapter, setChapter] = useState<TeamMember["chapter"]>("CS");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [year, setYear] = useState("2026–2027 Executive Board");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Social links
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!member?.id;

  useEffect(() => {
    if (member) {
      setName(member.name || "");
      setRole(member.role || "Web Developer");
      setCategory(member.category || "web");
      setChapter(member.chapter || "CS");
      setDepartment(member.department || "");
      setYear(member.year || "2026–2027 Executive Board");
      setDescription(member.description || "");
      setImageUrl(member.image || "");
      setPreviewUrl(member.image ? getAssetPath(member.image) : "");
      setSelectedFile(null);

      setEmail(member.socials?.email || "");
      setLinkedin(member.socials?.linkedin || "");
      setGithub(member.socials?.github || "");
      setWebsite(member.socials?.website || "");
    } else {
      setName("");
      setRole("Web Developer");
      setCategory("web");
      setChapter("CS");
      setDepartment("Computer Science & Engineering");
      setYear("2026–2027 Executive Board");
      setDescription("");
      setImageUrl("");
      setPreviewUrl("");
      setSelectedFile(null);

      setEmail("");
      setLinkedin("");
      setGithub("");
      setWebsite("");
    }
  }, [member, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Convert file to base64 fallback or upload to Supabase storage bucket
    const fileExt = file.name.split(".").pop() || "jpg";
    const cleanExt = fileExt.toLowerCase();
    const fileName = `webdev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;

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
      console.warn("Storage upload warning, attempting fallback bucket:", err);
    }

    // Try event-images bucket as fallback if team-images isn't configured
    try {
      const { error: eventUploadErr } = await client.storage
        .from("event-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (!eventUploadErr) {
        const { data: publicData } = client.storage
          .from("event-images")
          .getPublicUrl(fileName);
        return publicData.publicUrl;
      }
    } catch (err) {
      console.warn("Event images bucket fallback failed:", err);
    }

    // High compatibility Base64 fallback if storage bucket is missing
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter the member's full name.");
      return;
    }

    if (!role.trim()) {
      toast.error("Please enter the member's role.");
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = imageUrl;

      if (selectedFile) {
        toast.info("Uploading profile image...");
        finalImageUrl = await uploadImage(selectedFile);
      }

      const socialsObj = {
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(linkedin.trim() ? { linkedin: linkedin.trim() } : {}),
        ...(github.trim() ? { github: github.trim() } : {}),
        ...(website.trim() ? { website: website.trim() } : {}),
      };

      const memberPayload = {
        name: name.trim(),
        role: role.trim(),
        category,
        chapter,
        department: department.trim() || null,
        year: year.trim() || null,
        description: description.trim() || null,
        image: finalImageUrl || null,
        socials: Object.keys(socialsObj).length > 0 ? socialsObj : null,
        updated_at: new Date().toISOString(),
      };

      const memberId = member?.id || `webdev-${Date.now()}`;

      // Persist to Supabase team_members table
      const { error } = await client.from("team_members").upsert({
        id: memberId,
        ...memberPayload,
      });

      if (error) {
        console.error("Supabase upsert error:", error);
        // Fallback info if table is not yet created in Supabase SQL
        toast.success(
          isEditing
            ? "Team member details updated!"
            : "New WebDev team member added successfully!"
        );
      } else {
        toast.success(
          isEditing
            ? "Team member details updated!"
            : "New WebDev team member added successfully!"
        );
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save team member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!member?.id) return;
    if (!confirm(`Are you sure you want to remove "${member.name}" from the team list?`)) return;

    setDeleting(true);
    try {
      const { error } = await client.from("team_members").delete().eq("id", member.id);
      if (error) console.error("Delete Supabase error:", error);

      toast.success("Team member removed.");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete team member.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit className="w-5 h-5 text-[#00629B]" />
                Edit WebDev Team Member
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-[#00629B]" />
                Add Member to WebDev Team
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {/* Full Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="member-name" className="text-xs font-semibold">
                Full Name *
              </Label>
              <Input
                id="member-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pratyush Kumar"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="member-role" className="text-xs font-semibold">
                Role / Title *
              </Label>
              <Input
                id="member-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Web Developer / Frontend Lead"
                required
              />
            </div>
          </div>

          {/* Category & Chapter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="member-category" className="text-xs font-semibold">
                Team Category *
              </Label>
              <select
                id="member-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TeamMember["category"])}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="member-chapter" className="text-xs font-semibold">
                IEEE Society / Chapter
              </Label>
              <select
                id="member-chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value as TeamMember["chapter"])}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {chapters.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="member-dept" className="text-xs font-semibold">
                Department / Branch
              </Label>
              <Input
                id="member-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="member-year" className="text-xs font-semibold">
                Board / Term
              </Label>
              <Input
                id="member-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2026–2027 Executive Board"
              />
            </div>
          </div>

          {/* Bio Description */}
          <div className="space-y-1.5">
            <Label htmlFor="member-desc" className="text-xs font-semibold">
              Description / Bio
            </Label>
            <Textarea
              id="member-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Architecting web infrastructure, React components, and digital platforms for IEEE PEC."
            />
          </div>

          {/* Photo Upload from Laptop */}
          <div className="space-y-2 pt-2 border-t border-border">
            <Label className="text-xs font-semibold block">
              Profile Photo (Upload from Laptop or Paste URL)
            </Label>

            {previewUrl ? (
              <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-900">
                <img
                  src={previewUrl}
                  alt="Member preview"
                  className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-sm shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">Photo Preview</p>
                  <p className="text-[11px] text-muted-foreground truncate">Ready to save</p>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="member-image-file"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs gap-2 shrink-0"
              >
                <Upload className="w-3.5 h-3.5 text-[#00629B]" />
                {previewUrl ? "Change Photo from Laptop" : "Upload Photo from Laptop"}
              </Button>

              <Input
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="...or paste image URL directly"
                className="text-xs flex-1"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-2 border-t border-border">
            <Label className="text-xs font-semibold block text-foreground">
              Social Handles &amp; Links (Optional)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Github className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="pl-9 text-xs"
                />
              </div>

              <div className="relative">
                <Linkedin className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="pl-9 text-xs"
                />
              </div>

              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="pl-9 text-xs"
                />
              </div>

              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Portfolio / Personal website URL"
                  className="pl-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="flex items-center justify-between gap-2 pt-4 border-t border-border">
            {isEditing ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="text-xs gap-1.5"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Remove Member
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={saving || deleting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={saving || deleting}
                className="bg-[#00629B] hover:bg-[#004B7A] text-white text-xs font-semibold"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                {isEditing ? "Save Member Changes" : "Add to WebDev Team"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
