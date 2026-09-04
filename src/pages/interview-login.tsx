import { useState } from "react";
import { useRouter } from "next/router";

import { client } from "@/lib/supabase/supabase";
import PageHead from "@/components/layout/PageHead";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InterviewLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      toast.error("Unable to start Google login.");
      setLoading(false);
    }
  };

  return (
    <>
      <PageHead title="Interviewer Login" />

      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            IEEE PEC Interview Portal
          </h1>

          <p className="text-gray-500 mb-8">
            Sign in using your PEC Google account.
          </p>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <p className="text-xs text-gray-400 mt-5">
            Only @pec.edu.in accounts are allowed.
          </p>
        </div>
      </main>
    </>
  );
}