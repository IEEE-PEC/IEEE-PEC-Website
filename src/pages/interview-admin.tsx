import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { client } from "@/lib/supabase/supabase";
import PageHead from "@/components/layout/PageHead";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Role = "pending" | "interviewer" | "admin";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  created_at: string;
};

export default function InterviewAdminPage() {
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

        await loadProfiles();

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
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Profile loading error:", error);

      toast.error("Failed to load users.");

      return;
    }

    setProfiles(data || []);
  };

  /*
   * Update user role
   */
  const updateRole = async (
    userId: string,
    newRole: Role
  ) => {
    if (userId === currentUserId) {
      toast.error(
        "You cannot change your own admin role."
      );

      return;
    }

    setUpdating(userId);

    const { error } = await client
      .from("profiles")
      .update({
        role: newRole,
      })
      .eq("id", userId);

    setUpdating(null);

    if (error) {
      console.error("Role update error:", error);

      toast.error("Failed to update role.");

      return;
    }

    setProfiles((current) =>
      current.map((profile) =>
        profile.id === userId
          ? {
              ...profile,
              role: newRole,
            }
          : profile
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
   * Refresh
   */
  const refreshUsers = async () => {
    await loadProfiles();

    toast.success("Users refreshed.");
  };

  /*
   * Loading screen
   */
  if (loading) {
    return (
      <>
        <PageHead title="Interview Admin Panel" />

        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">
            Loading interview admin panel...
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHead title="Interview Admin Panel" />

      <main className="min-h-screen bg-gray-50">

        {/* Header */}
        <section className="bg-[#062b52] text-white py-10">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                Interview Admin Panel
              </h1>

              <p className="mt-2 text-gray-200">
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
                className="bg-white text-black hover:bg-gray-100"
              >
                Interview Portal
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="bg-white text-black hover:bg-gray-100"
              >
                Logout
              </Button>

            </div>

          </div>
        </section>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-10">

          <section className="bg-white border rounded-xl shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  User Management
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Approve PEC users and assign their roles.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={refreshUsers}
              >
                Refresh
              </Button>

            </div>

            {profiles.length === 0 ? (
              <p className="text-gray-500">
                No users found.
              </p>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="border-b text-left">

                      <th className="py-3 pr-4">
                        Name
                      </th>

                      <th className="py-3 pr-4">
                        Email
                      </th>

                      <th className="py-3 pr-4">
                        Current Role
                      </th>

                      <th className="py-3">
                        Assign Role
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {profiles.map((profile) => (

                      <tr
                        key={profile.id}
                        className="border-b last:border-0"
                      >

                        <td className="py-4 pr-4 font-medium">
                          {profile.full_name ||
                            "Unknown"}
                        </td>

                        <td className="py-4 pr-4">
                          {profile.email ||
                            "No email"}
                        </td>

                        <td className="py-4 pr-4">

                          <span className="capitalize">
                            {profile.role}
                          </span>

                        </td>

                        <td className="py-4">

                          <select
                            value={profile.role}
                            disabled={
                              updating ===
                                profile.id ||
                              profile.id ===
                                currentUserId
                            }
                            onChange={(e) =>
                              updateRole(
                                profile.id,
                                e.target
                                  .value as Role
                              )
                            }
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >

                            <option value="pending">
                              Pending
                            </option>

                            <option value="interviewer">
                              Interviewer
                            </option>

                            <option value="admin">
                              Admin
                            </option>

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