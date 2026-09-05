import { useState, useEffect } from "react";
import { client } from "@/lib/supabase/supabase";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkRole = async () => {
      try {
        const {
          data: { session },
        } = await client.auth.getSession();

        if (!session?.user) {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        const { data: profile } = await client
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (mounted) {
          setIsAdmin(profile?.role === "admin");
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    checkRole();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(() => {
      checkRole();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading };
}
