"use client";

import { useState, useEffect, useRef } from "react";
import { EventType } from "@/types";
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
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { getAssetPath } from "@/lib/utils";

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: EventType | null;
  onSuccess: () => void;
}

const categories = [
  "Flagship",
  "Competition",
  "Workshop",
  "Guest Lecture",
  "Orientation",
];

export default function EditEventDialog({
  open,
  onOpenChange,
  event,
  onSuccess,
}: EditEventDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Workshop");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [capacity, setCapacity] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!event?.id;

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setCategory(event.category || "Workshop");
      setDescription(event.description || "");
      setLongDescription(event.longDescription || "");
      setCapacity(event.capacity ? String(event.capacity) : "");
      setImageUrl(event.image || "");
      setPreviewUrl(event.image ? getAssetPath(event.image) : "");
      setSelectedFile(null);
    } else {
      setTitle("");
      setCategory("Workshop");
      setDescription("");
      setLongDescription("");
      setCapacity("");
      setImageUrl("");
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [event, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const cleanExt = fileExt ? fileExt.toLowerCase() : "jpg";
    const fileName = `event_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;

    const { error: uploadError } = await client.storage
      .from("event-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Photo upload failed: ${uploadError.message}`);
    }

    const { data: publicData } = client.storage
      .from("event-images")
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please provide an event title.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide a short description.");
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = imageUrl;

      if (selectedFile) {
        toast.info("Uploading event photo...");
        finalImageUrl = await uploadImage(selectedFile);
      }

      const eventPayload = {
        title: title.trim(),
        category,
        description: description.trim(),
        long_description: longDescription.trim() || null,
        capacity: capacity ? parseInt(capacity, 10) : null,
        image_url: finalImageUrl || null,
      };

      if (isEditing) {
        const { error } = await client
          .from("events")
          .update(eventPayload)
          .eq("id", event.id);

        if (error) throw error;
        toast.success("Event updated successfully!");
      } else {
        const { error } = await client.from("events").insert(eventPayload);

        if (error) throw error;
        toast.success("New event created successfully!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event?.id) return;
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    setDeleting(true);
    try {
      const { error } = await client.from("events").delete().eq("id", event.id);
      if (error) throw error;

      toast.success("Event deleted.");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete event.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#00629B]" />
            {isEditing ? "Edit Event & Photo" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="event-title" className="text-xs font-semibold">
              Event Title *
            </Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hands-On Robotics Workshop"
              required
            />
          </div>

          {/* Category & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="event-category" className="text-xs font-semibold">
                Category *
              </Label>
              <select
                id="event-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-capacity" className="text-xs font-semibold">
                Expected Capacity (Optional)
              </Label>
              <Input
                id="event-capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 150"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <Label htmlFor="event-desc" className="text-xs font-semibold">
              Short Description (Card Summary) *
            </Label>
            <Textarea
              id="event-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="1-2 sentences summarizing what happens in this event."
              required
            />
          </div>

          {/* Long Description / Overview */}
          <div className="space-y-1.5">
            <Label htmlFor="event-long-desc" className="text-xs font-semibold">
              Full Overview (Markdown / Bullet Points)
            </Label>
            <Textarea
              id="event-long-desc"
              rows={4}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Detailed schedule, topics covered, eligibility, etc."
            />
          </div>

          {/* Photo Upload from Laptop */}
          <div className="space-y-2 pt-1 border-t border-border">
            <Label className="text-xs font-semibold block">
              Event Photo (Upload from Laptop)
            </Label>

            {previewUrl && (
              <div className="relative h-44 w-full rounded-xl overflow-hidden border border-border bg-slate-100 dark:bg-slate-800">
                <img
                  src={previewUrl}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="event-image-file"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                {previewUrl ? "Change Photo" : "Upload Photo from Laptop"}
              </Button>

              {selectedFile && (
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
              )}
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
                Delete Event
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
                className="bg-[#00629B] hover:bg-[#004B7A] text-white"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                {isEditing ? "Save Changes" : "Create Event"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
