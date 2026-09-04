import { useEffect } from "react";
import { useRouter } from "next/router";

import { client } from "@/lib/supabase/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        router.replace("/interview-login");
        return;
      }

      // Only PEC accounts are allowed
      const email = user.email?.toLowerCase() || "";

      if (!email.endsWith("@pec.edu.in")) {
        await client.auth.signOut();

        router.replace("/interview-login?error=domain");
        return;
      }

      // Find user's role
      const { data: profile, error } = await client
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        console.error("Profile lookup error:", error);

        await client.auth.signOut();

        router.replace("/interview-login?error=profile");
        return;
      }

      // Admin
      if (profile.role === "admin") {
        router.replace("/admin");
        return;
      }

      // Interviewer
      if (profile.role === "interviewer") {
        router.replace("/interview");
        return;
      }

      // Pending
      router.replace("/pending");
    };

    handleAuth();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">
        Signing you in...
      </p>
    </main>
  );
}