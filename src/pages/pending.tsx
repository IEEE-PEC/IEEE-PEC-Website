import { useRouter } from "next/router";

import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/supabase/supabase";

export default function PendingPage() {
  const router = useRouter();

  const logout = async () => {
    await client.auth.signOut();
    router.replace("/interview-login");
  };

  return (
    <>
      <PageHead title="Awaiting Approval" />

      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border rounded-xl shadow-sm p-8 text-center">

          <h1 className="text-2xl font-bold mb-3">
            Awaiting Approval
          </h1>

          <p className="text-gray-500 mb-6">
            Your PEC account has been verified, but an administrator
            has not assigned you a role yet.
          </p>

          <p className="text-sm text-gray-400 mb-6">
            Once an administrator assigns you as an interviewer,
            you will be able to access the interview portal.
          </p>

          <Button
            onClick={logout}
            className="w-full"
          >
            Sign Out
          </Button>

        </div>
      </main>
    </>
  );
}   