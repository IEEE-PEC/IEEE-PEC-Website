import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";

import { client } from "@/lib/supabase/supabase";
import PageHead from "@/components/layout/PageHead";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, UserCheck } from "lucide-react";

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

        await Promise.all([loadProfiles(), loadMembers()]);

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
    await Promise.all([loadProfiles(), loadMembers()]);
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