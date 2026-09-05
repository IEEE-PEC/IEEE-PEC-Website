import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";

import { client } from "@/lib/supabase/supabase";
import PageHead from "@/components/layout/PageHead";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Search,
  UserCheck,
  Sparkles,
  Globe,
  MessageCircle,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type Role = "pending" | "interviewer" | "admin";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  created_at: string;
};

type Member = {
  id: string;
  full_name: string;
  email: string;
  sid: string;
  year: string;
};

export default function InterviewAdminPage() {
  const router = useRouter();

  // Portal users (profiles table)
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Selected members eligible for promotion
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [promoting, setPromoting] = useState<string | null>(null);

  // Portal Audition & Results Settings
  const [auditionEventName, setAuditionEventName] = useState("IEEE PEC Auditions 2026-2027");
  const [resultsPublished, setResultsPublished] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  /*
   * Check admin access
   */
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { user },
        } = await client.auth.getUser();

        if (!user) {
          router.replace("/interview-login");
          return;
        }

        setCurrentUserId(user.id);

        const { data: profile, error } = await client
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !profile) {
          console.error("Profile verification error:", error);

          toast.error("Unable to verify your account.");

          router.replace("/interview-login");
          return;
        }

        if (profile.role !== "admin") {
          toast.error("You do not have admin access.");

          router.replace("/interview");
          return;
        }

        await Promise.all([loadProfiles(), loadMembers(), loadSettings()]);

        setLoading(false);
      } catch (error) {
        console.error("Admin initialization error:", error);

        toast.error("Failed to load admin panel.");

        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  /*
   * Load all users
   */
  const loadProfiles = async () => {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Profile loading error:", error);
      toast.error("Failed to load users.");
      return;
    }

    setProfiles(data || []);
  };

  /*
   * Load selected members eligible for promotion
   */
  const loadMembers = async () => {
    const { data, error } = await client
      .from("applications")
      .select("id, full_name, email, sid, year, status")
      .eq("status", "Selected")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Members loading error:", error);
      toast.error("Failed to load members.");
      return;
    }

    setMembers(data || []);
  };

  /*
   * Promote a selected member to interviewer role
   */
  const promoteToInterviewer = async (member: Member) => {
    setPromoting(member.id);

    // Look up their profile by email
    const { data: profileData, error: profileError } = await client
      .from("profiles")
      .select("id, role, email")
      .eq("email", member.email)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      toast.error("Failed to look up member profile.");
      setPromoting(null);
      return;
    }

    if (!profileData) {
      toast.warning(
        `${member.full_name} hasn't logged in yet — they need to sign in at /interview-login with their PEC account first.`
      );
      setPromoting(null);
      return;
    }

    if (profileData.role === "interviewer" || profileData.role === "admin") {
      toast.info(`${member.full_name} already has role: ${profileData.role}.`);
      setPromoting(null);
      return;
    }

    const { error: updateError } = await client
      .from("profiles")
      .update({ role: "interviewer" })
      .eq("id", profileData.id);

    setPromoting(null);

    if (updateError) {
      console.error("Promotion error:", updateError);
      toast.error("Failed to promote member.");
      return;
    }

    // Update profiles list in-place
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileData.id ? { ...p, role: "interviewer" } : p
      )
    );

    toast.success(
      `${member.full_name} promoted to Interviewer! They can now access the interview portal.`
    );
  };

  /*
   * Filtered members list based on search
   */
  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return members;
    const q = memberSearch.toLowerCase();
    return members.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.sid.toLowerCase().includes(q)
    );
  }, [members, memberSearch]);

  /*
   * Update user role
   */
  const updateRole = async (userId: string, newRole: Role) => {
    if (userId === currentUserId) {
      toast.error("You cannot change your own admin role.");
      return;
    }

    setUpdating(userId);

    const { error } = await client
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    setUpdating(null);

    if (error) {
      console.error("Role update error:", error);
      toast.error("Failed to update role.");
      return;
    }

    setProfiles((current) =>
      current.map((profile) =>
        profile.id === userId ? { ...profile, role: newRole } : profile
      )
    );

    toast.success("Role updated successfully.");
  };

  /*
   * Load portal settings
   */
  const loadSettings = async () => {
    try {
      const { data, error } = await client
        .from("portal_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      if (data) {
        setAuditionEventName(data.audition_event_name || "IEEE PEC Auditions 2026-2027");
        setResultsPublished(!!data.results_published);
        setWhatsappLink(data.whatsapp_group_link || "");
      }
    } catch (err) {
      console.error("Settings load error:", err);
    }
  };

  /*
   * Save portal settings
   */
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      const { error } = await client.from("portal_settings").upsert({
        id: "main",
        audition_event_name: auditionEventName.trim(),
        results_published: resultsPublished,
        whatsapp_group_link: whatsappLink.trim(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success("Audition settings updated successfully!");
    } catch (err: any) {
      console.error("Save settings error:", err);
      toast.error(err.message || "Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  /*
   * Logout
   */
  const handleLogout = async () => {
    await client.auth.signOut();
    router.replace("/interview-login");
  };

  /*
   * Refresh all data
   */
  const refreshUsers = async () => {
    await Promise.all([loadProfiles(), loadMembers(), loadSettings()]);
    toast.success("Data refreshed.");
  };

  /*
   * Loading screen
   */
  if (loading) {
    return (
      <>
        <PageHead title="Interview Admin Panel" />

        <main className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
          <p className="text-gray-500 dark:text-muted-foreground">
            Loading interview admin panel...
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHead title="Interview Admin Panel" />

      <main className="min-h-screen bg-gray-50 dark:bg-background">

        {/* Header */}
        <section className="bg-[#062b52] dark:bg-[#0a1628] text-white py-10">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                Interview Admin Panel
              </h1>

              <p className="mt-2 text-gray-200 dark:text-gray-300">
                Manage IEEE PEC interview portal users & roles.
              </p>
            </div>

            <div className="flex gap-3">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push("/inventory")
                }
                className="bg-white dark:bg-card text-black dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent"
              >
                Lab Inventory
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push("/events")
                }
                className="bg-white dark:bg-card text-black dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent"
              >
                Manage Events
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push("/interview")
                }
                className="bg-white dark:bg-card text-black dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent"
              >
                Interview Portal
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="bg-white dark:bg-card text-black dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent"
              >
                Logout
              </Button>

            </div>

          </div>
        </section>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

          {/* ── Panel 0: Audition Results & Induction Controls ── */}
          <section className="bg-white dark:bg-card border dark:border-border rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b dark:border-border pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00629B]" />
                  Audition Results &amp; Selection Release
                </h2>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">
                  Control active audition cycle and release selection results to students on <span className="font-semibold text-foreground">/apply</span>.
                </p>
              </div>

              {/* Status Badge & 1-Click Action */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                  resultsPublished 
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300"
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${resultsPublished ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                  {resultsPublished ? "Results Published Live" : "Results Hidden (Under Review)"}
                </span>

                <Button
                  type="button"
                  onClick={async () => {
                    const newStatus = !resultsPublished;
                    setResultsPublished(newStatus);
                    try {
                      const { error } = await client.from("portal_settings").upsert({
                        id: "main",
                        audition_event_name: auditionEventName.trim(),
                        results_published: newStatus,
                        whatsapp_group_link: whatsappLink.trim(),
                        updated_at: new Date().toISOString(),
                      });
                      if (error) throw error;
                      if (newStatus) {
                        toast.success("🎉 Audition results are now LIVE to all candidates on /apply!");
                      } else {
                        toast.info("Audition results are now HIDDEN (in review).");
                      }
                    } catch (err: any) {
                      toast.error(err.message || "Failed to update results state.");
                    }
                  }}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md ${
                    resultsPublished
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {resultsPublished ? "⏸️ Hold / Unrelease Results" : "🚀 Release Results to Public"}
                </Button>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="auditionEventName" className="text-xs font-semibold">
                    Audition Event / Cycle Name *
                  </Label>
                  <Input
                    id="auditionEventName"
                    value={auditionEventName}
                    onChange={(e) => setAuditionEventName(e.target.value)}
                    placeholder="e.g. IEEE PEC Auditions 2026-2027"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Displayed on the top badge of the /apply portal.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="whatsappLink" className="text-xs font-semibold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Selected Members WhatsApp Community Group Link
                  </Label>
                  <Input
                    id="whatsappLink"
                    value={whatsappLink}
                    onChange={(e) => setWhatsappLink(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Shown exclusively to Selected candidates upon result release.
                  </p>
                </div>
              </div>

              {/* Publish Toggle & Save Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t dark:border-border">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setResultsPublished(!resultsPublished)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      resultsPublished ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        resultsPublished ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-semibold text-foreground">
                    {resultsPublished ? "Status: Public (Candidates see their result)" : "Status: Draft (Candidates see 'Auditions in Progress')"}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={savingSettings}
                  className="bg-[#00629B] hover:bg-[#004B7A] text-white text-xs font-semibold gap-2 shadow-sm rounded-xl px-5"
                >
                  {savingSettings ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Save Audition Settings
                </Button>
              </div>
            </form>
          </section>

          {/* ── Panel 1: Promote Selected Members to Interviewer ── */}
          <section className="bg-white dark:bg-card border dark:border-border rounded-xl shadow-sm p-6">

            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#00629B]" />
                  Promote Members to Interviewer
                </h2>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">
                  Members selected in past cycles who can be given interviewer access.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadMembers}
              >
                Refresh
              </Button>
            </div>

            {/* Search */}
            <div className="relative mt-4 mb-5">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by name, email, or SID..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {members.length === 0 ? (
              <p className="text-gray-500 dark:text-muted-foreground text-sm">
                No selected members yet. Members appear here once their application is marked &quot;Selected&quot; in the interview portal.
              </p>
            ) : filteredMembers.length === 0 ? (
              <p className="text-gray-500 dark:text-muted-foreground text-sm">
                No members match your search.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-border text-left">
                      <th className="py-3 pr-4 text-gray-600 dark:text-muted-foreground font-medium">Name</th>
                      <th className="py-3 pr-4 text-gray-600 dark:text-muted-foreground font-medium">Email</th>
                      <th className="py-3 pr-4 text-gray-600 dark:text-muted-foreground font-medium">SID</th>
                      <th className="py-3 pr-4 text-gray-600 dark:text-muted-foreground font-medium">Year</th>
                      <th className="py-3 text-gray-600 dark:text-muted-foreground font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => {
                      const existingProfile = profiles.find(
                        (p) => p.email === member.email
                      );
                      const alreadyPromoted =
                        existingProfile?.role === "interviewer" ||
                        existingProfile?.role === "admin";

                      return (
                        <tr
                          key={member.id}
                          className="border-b dark:border-border last:border-0"
                        >
                          <td className="py-4 pr-4 font-medium">{member.full_name}</td>
                          <td className="py-4 pr-4 text-gray-600 dark:text-muted-foreground">{member.email}</td>
                          <td className="py-4 pr-4 font-mono text-xs text-gray-500 dark:text-muted-foreground">{member.sid}</td>
                          <td className="py-4 pr-4 text-gray-600 dark:text-muted-foreground">{member.year}</td>
                          <td className="py-4">
                            {alreadyPromoted ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1">
                                <UserCheck className="w-3 h-3" />
                                {existingProfile?.role === "admin" ? "Admin" : "Interviewer"}
                              </span>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                disabled={promoting === member.id}
                                onClick={() => promoteToInterviewer(member)}
                                className="bg-[#00629B] hover:bg-[#004B7A] text-white text-xs rounded-lg"
                              >
                                {promoting === member.id ? "Promoting..." : "Promote to Interviewer"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Panel 2: Portal User Management ── */}
          <section className="bg-white dark:bg-card border dark:border-border rounded-xl shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Portal User Management</h2>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">
                  Manage roles for users who have logged in to the interview portal.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={refreshUsers}
              >
                Refresh All
              </Button>
            </div>

            {profiles.length === 0 ? (
              <p className="text-gray-500 dark:text-muted-foreground">
                No users found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-border text-left">
                      <th className="py-3 pr-4 text-gray-600 dark:text-muted-foreground font-medium">Name</th>
                      <th className="py-3 pr-4 text-gray-600 dark:text-muted-foreground font-medium">Email</th>
                      <th className="py-3 pr-4 text-gray-600 dark:text-muted-foreground font-medium">Current Role</th>
                      <th className="py-3 text-gray-600 dark:text-muted-foreground font-medium">Assign Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="border-b dark:border-border last:border-0">
                        <td className="py-4 pr-4 font-medium">
                          {profile.full_name || "Unknown"}
                        </td>
                        <td className="py-4 pr-4 text-gray-600 dark:text-muted-foreground">
                          {profile.email || "No email"}
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`inline-block capitalize text-xs font-semibold rounded-full px-2.5 py-1 ${
                            profile.role === "admin"
                              ? "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400"
                              : profile.role === "interviewer"
                              ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-secondary text-gray-600 dark:text-muted-foreground"
                          }`}>
                            {profile.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <select
                            value={profile.role}
                            disabled={updating === profile.id || profile.id === currentUserId}
                            onChange={(e) => updateRole(profile.id, e.target.value as Role)}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="pending">Pending</option>
                            <option value="interviewer">Interviewer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </section>

        </div>

      </main>
    </>
  );
}