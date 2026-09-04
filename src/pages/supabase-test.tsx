import { useEffect, useState } from "react";
import { client } from "@/lib/supabase/supabase";

export default function SupabaseTest() {
  const [status, setStatus] = useState("Testing...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await client.auth.getSession();

      if (error) {
        setStatus(`❌ Error: ${error.message}`);
      } else {
        setStatus("✅ Supabase connected successfully!");
      }
    }

    testConnection();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  );
}