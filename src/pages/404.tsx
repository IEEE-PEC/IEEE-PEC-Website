import Link from "next/link";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/button";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function Custom404() {
  return (
    <>
      <PageHead
        title="404 - Page Not Found | IEEE PEC Student Branch"
        description="The page you are looking for does not exist on IEEE PEC Student Branch website."
      />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-slate-50 dark:bg-slate-950">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 text-[#00629B] flex items-center justify-center mx-auto mb-6 shadow-md">
          <Sparkles className="w-8 h-8" />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-[#00629B]">
          Error 404
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mt-2">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mt-3 leading-relaxed">
          The requested page could not be located on the IEEE PEC SB server. It may have moved or been archived.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Button asChild className="bg-[#00629B] hover:bg-[#004B7A] text-white rounded-xl">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-border rounded-xl">
            <Link href="/project">
              Explore Projects
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
