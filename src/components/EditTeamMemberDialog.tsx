"use client";

import { useState, useEffect, useRef } from "react";
import { TeamMember } from "@/types";
import {
  uploadTeamMemberImage,
  saveTeamMember,
  removeTeamMember,
} from "@/lib/teamStorage";
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

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      toast.success(`Photo selected: ${file.name}`);
    } else if (file) {
      toast.error("Please drop a valid image file (PNG, JPG, JPEG, WEBP).");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
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
        finalImageUrl = await uploadTeamMemberImage(selectedFile);
      }

      const socialsObj = {
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(linkedin.trim() ? { linkedin: linkedin.trim() } : {}),
        ...(github.trim() ? { github: github.trim() } : {}),
        ...(website.trim() ? { website: website.trim() } : {}),
      };

      const memberId = member?.id || `webdev-${Date.now()}`;

      const memberPayload: TeamMember = {
        id: memberId,
        name: name.trim(),
        role: role.trim(),
        category,
        chapter,
        department: department.trim() || undefined,
        year: year.trim() || undefined,
        description: description.trim() || undefined,
        image: finalImageUrl || "",
        socials: Object.keys(socialsObj).length > 0 ? socialsObj : undefined,
      };

      await saveTeamMember(memberPayload);

      toast.success(
        isEditing
          ? "Team member details & photo updated!"
          : "New WebDev team member added successfully!"
      );

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
      await removeTeamMember(member.id);
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

          {/* Photo Upload with Drag & Drop Zone */}
          <div className="space-y-2 pt-2 border-t border-border">
            <Label className="text-xs font-semibold block">
              Profile Photo (Drag &amp; Drop or Upload from Laptop)
            </Label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? "border-[#00629B] bg-blue-50/80 dark:bg-blue-950/40 scale-[1.01]"
                  : "border-border hover:border-[#00629B]/60 bg-slate-50/50 dark:bg-slate-900/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="member-image-file"
              />

              {previewUrl ? (
                <div className="flex items-center gap-4 w-full text-left">
                  <img
                    src={previewUrl}
                    alt="Member preview"
                    className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-md shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {selectedFile ? selectedFile.name : "Photo Selected"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Drag another photo here or click to browse
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl("");
                      setImageUrl("");
                      setSelectedFile(null);
                    }}
                    className="text-[11px] h-7 px-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-slate-800 text-[#00629B] dark:text-[#00A3E0] flex items-center justify-center shadow-sm">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {isDragging ? "Drop photo here now!" : "Drag & drop member photo here"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      or click to browse from your laptop (PNG, JPG, WEBP)
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-1">
              <Input
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="...or paste image URL directly"
                className="text-xs"
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
