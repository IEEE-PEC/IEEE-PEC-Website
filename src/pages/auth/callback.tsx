import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { client } from "@/lib/supabase/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const processedRef = useRef(false);

  useEffect(() => {
    const processSession = async (session: any) => {
      if (processedRef.current) return;
      if (!session?.user) return;
      processedRef.current = true;

      const user = session.user;
      const email = user.email?.toLowerCase() || "";

      if (!email.endsWith("@pec.edu.in")) {
        await client.auth.signOut();
        window.location.href = "/interview-login?error=domain";
        return;
      }

      let targetPath = "/pending";

      try {
        const { data: profile, error } = await client
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !profile) {
          const fallbackName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            email.split("@")[0];

          const { data: newProfile } = await client
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              full_name: fallbackName,
              role: "pending",
            })
            .select("role")
            .single();

          const savedRedirect = localStorage.getItem("auth_redirect");
          if (savedRedirect) {
            localStorage.removeItem("auth_redirect");
          }

          if (newProfile?.role === "admin") {
            targetPath = "/interview-admin";
          } else if (newProfile?.role === "interviewer") {
            targetPath = "/interview";
          } else {
            targetPath = savedRedirect || "/apply";
          }
        } else {
          const savedRedirect = localStorage.getItem("auth_redirect");
          if (savedRedirect) {
            localStorage.removeItem("auth_redirect");
          }

          if (profile.role === "admin") {
            targetPath = "/interview-admin";
          } else if (profile.role === "interviewer") {
            targetPath = "/interview";
          } else {
            targetPath = savedRedirect || "/apply";
          }
        }
      } catch (err) {
        console.error("Profile check error:", err);
      }

      // Automatically refresh the entire page into the destination portal
      window.location.href = targetPath;
    };

    // 1. If session is already available
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        processSession(session);
      }
    });

    // 2. Listen for auth change (when OAuth token hash is committed)
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        processSession(session);
      }
    });

    // Fallback safety timeout (5 seconds)
    const timer = setTimeout(() => {
      if (!processedRef.current) {
        client.auth.getSession().then(({ data: { session } }) => {
          if (!session) {
            window.location.href = "/interview-login";
          }
        });
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-3">
        <div className="w-9 h-9 border-4 border-[#00629B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-gray-700">Signing you in &amp; refreshing...</p>
      </div>
    </main>
  );
}