"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function InventoryRestrictedPage() {
  const router = useRouter();

  return (
    <>
      <PageHead
        title="Admin Restricted | IEEE PEC Student Branch"
        description="This internal hardware inventory page is restricted to authorized IEEE PEC administrators."
      />

      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-slate-50 dark:bg-slate-950">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-xl max-w-md w-full space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              Internal Lab Portal
            </span>
            <h1 className="text-2xl font-extrabold text-foreground">
              Admin Access Required
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The IEEE hardware laboratory inventory and component ledger is an internal administrative resource and is restricted to authorized laboratory managers.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button asChild className="bg-[#00629B] hover:bg-[#004B7A] text-white rounded-xl">
              <Link href="/admin">
                Open Admin Login
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-border rounded-xl">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Public Site
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
