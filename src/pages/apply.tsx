"use client";

import { useState, useEffect, useCallback } from "react";
import { client } from "@/lib/supabase/supabase";
import PageHead from "@/components/layout/PageHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Send,
  CheckCircle2,
  Loader2,
  Clock,
  Sparkles,
  ExternalLink,
  PartyPopper,
  Layers,
  Award,
  LogOut,
  User,
  MessageCircle,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface PortalSettings {
  audition_event_name: string;
  results_published: boolean;
  whatsapp_group_link: string;
  announcement_note: string;
}

interface ExistingApplication {
  id: string;
  full_name: string;
  sid: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  chapters: string[];
  domains: string[];
  github_url: string | null;
  portfolio_url: string | null;
  motivation: string | null;
  status: string;
  created_at: string;
}

export default function ApplyPage() {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  // Application & Settings state
  const [settings, setSettings] = useState<PortalSettings>({
    audition_event_name: "IEEE PEC Auditions 2026-2027",
    results_published: false,
    whatsapp_group_link: "",
    announcement_note: "",
  });
  const [existingApp, setExistingApp] = useState<ExistingApplication | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    sid: "",
    email: "",
    phone: "",
    branch: "",
    year: "1st Year",
    chapters: [] as string[],
    domains: [] as string[],
    githubUrl: "",
    portfolioUrl: "",
    motivation: "",
  });

  const availableChapters = [
    { id: "PES", name: "IEEE Power & Energy Society (PES)" },
    { id: "CS", name: "IEEE Computer Society (CS)" },
    { id: "WIE", name: "IEEE Women in Engineering (WIE)" },
  ];

  const availableDomains = [
    "Embedded Systems & Firmware",
    "Robotics & ROS 2",
    "Artificial Intelligence & Machine Learning",
    "Full-Stack Web Development",
    "VLSI & PCB Design",
    "Power Systems & EV Technology",
    "UI/UX Design & Creative Media",
    "Event Operations & PR",
  ];

  // 1. Check User Session
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await client.auth.getSession();

        if (mounted) {
          setCurrentUser(session?.user || null);
          setAuthChecking(false);
        }
      } catch (err) {
        if (mounted) {
          setCurrentUser(null);
          setAuthChecking(false);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setCurrentUser(session?.user || null);
        setAuthChecking(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 2. Fetch Settings & Existing Application for logged in user
  const loadUserDataAndSettings = useCallback(async (user: SupabaseUser) => {
    setLoadingData(true);
    try {
      const { data: settingsData } = await client
        .from("portal_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      if (settingsData) {
        setSettings({
          audition_event_name:
            settingsData.audition_event_name || "IEEE PEC Auditions 2026-2027",
          results_published: !!settingsData.results_published,
          whatsapp_group_link: settingsData.whatsapp_group_link || "",
          announcement_note: settingsData.announcement_note || "",
        });
      }

      const userEmail = user.email?.toLowerCase().trim();
      if (userEmail) {
        const { data: appData, error: appError } = await client
          .from("applications")
          .select("*")
          .eq("email", userEmail)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!appError && appData) {
          setExistingApp(appData);
        } else {
          setExistingApp(null);
          const googleName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "";
          setFormData((prev) => ({
            ...prev,
            fullName: googleName,
            email: userEmail,
          }));
        }
      }
    } catch (err) {
      console.error("Error loading application state:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserDataAndSettings(currentUser);
    }
  }, [currentUser, loadUserDataAndSettings]);

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setLoggingIn(true);
    localStorage.setItem("auth_redirect", "/apply");

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      toast.error("Unable to start Google sign in.");
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await client.auth.signOut();
    setCurrentUser(null);
    setExistingApp(null);
  };

  const handleChapterToggle = (chapterId: string) => {
    setFormData((prev) => {
      const exists = prev.chapters.includes(chapterId);
      return {
        ...prev,
        chapters: exists
          ? prev.chapters.filter((c) => c !== chapterId)
          : [...prev.chapters, chapterId],
      };
    });
  };

  const handleDomainToggle = (domain: string) => {
    setFormData((prev) => {
      const exists = prev.domains.includes(domain);
      return {
        ...prev,
        domains: exists
          ? prev.domains.filter((d) => d !== domain)
          : [...prev.domains, domain],
      };
    });
  };

  const handleSidChange = (sidValue: string) => {
    let autoYear = formData.year;
    const cleanSid = sidValue.trim();

    if (cleanSid.startsWith("25")) {
      autoYear = "1st Year";
    } else if (cleanSid.startsWith("24")) {
      autoYear = "2nd Year";
    } else if (cleanSid.startsWith("23")) {
      autoYear = "3rd Year";
    }

    setFormData((prev) => ({
      ...prev,
      sid: sidValue,
      year: autoYear,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in with Google first.");
      return;
    }

    if (formData.chapters.length === 0) {
      toast.error("Please select at least one Chapter.");
      return;
    }

    if (formData.domains.length === 0) {
      toast.error("Please select at least one Technical Domain.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newApp = {
        full_name: formData.fullName.trim(),
        sid: formData.sid.trim(),
        email: (currentUser.email || formData.email).trim().toLowerCase(),
        phone: formData.phone.trim(),
        branch: formData.branch.trim(),
        year: formData.year,
        chapters: formData.chapters,
        domains: formData.domains,
        github_url: formData.githubUrl.trim() || null,
        portfolio_url: formData.portfolioUrl.trim() || null,
        motivation: formData.motivation.trim() || null,
        status: "Pending",
      };

      const { data, error } = await client
        .from("applications")
        .insert(newApp)
        .select()
        .single();

      if (error) throw error;

      setExistingApp(data);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHead
        title="Apply for Auditions & Check Results | IEEE PEC"
        description="Official membership and auditions application portal for IEEE Student Branch at Punjab Engineering College."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#002855] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#00A3E0] text-xs font-bold uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            {settings.audition_event_name}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {existingApp ? "Auditions & Application Status" : "Join IEEE Student Branch"}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            {existingApp
              ? "Check your interview audition status and official published results below."
              : "Sign in with your official PEC account to submit your audition form and track your selection results."}
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 min-h-[70vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading Auth */}
          {authChecking || loadingData ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-border text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#00629B] mx-auto" />
              <p className="text-sm text-muted-foreground">Checking session &amp; application status...</p>
            </div>
          ) : !currentUser ? (
            /* STATE 0: NOT SIGNED IN WITH GOOGLE */
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 text-[#00629B] flex items-center justify-center mx-auto shadow-inner">
                <User className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Authentication Required
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  To apply for auditions or check your published interview results, please sign in using your official PEC Google account.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  size="lg"
                  onClick={handleGoogleLogin}
                  disabled={loggingIn}
                  className="bg-[#00629B] hover:bg-[#004B7A] text-white px-8 py-6 rounded-2xl text-base font-semibold shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  {loggingIn ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Redirecting to Google...
                    </>
                  ) : (
                    "Continue with Google (@pec.edu.in)"
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Only <span className="font-semibold text-foreground">@pec.edu.in</span> email accounts are allowed.
              </p>
            </div>
          ) : existingApp ? (
            /* STATE 1: ALREADY APPLIED (SHOW STATUS & RESULTS) */
            <div className="space-y-8">
              {/* Account Card */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{existingApp.full_name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs gap-1.5 rounded-xl border-border hover:bg-muted"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </Button>
              </div>

              {/* Result Status Banner */}
              {!settings.results_published ? (
                /* RESULTS NOT PUBLISHED YET */
                <div className="p-8 sm:p-10 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800 text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
                    <Clock className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-200/70 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                      Auditions in Progress
                    </span>
                    <h3 className="text-2xl font-bold text-foreground pt-2">
                      Application Submitted &amp; Under Review
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto pt-1 leading-relaxed">
                      Thank you for applying! Your application has been logged. Results for <span className="font-semibold text-foreground">{settings.audition_event_name}</span> will be declared on this page as soon as evaluations are completed.
                    </p>
                  </div>
                </div>
              ) : existingApp.status === "Selected" ? (
                /* SELECTED RESULT (Option A) */
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 border-2 border-emerald-500/50 shadow-xl text-center space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <PartyPopper className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                      🎉 Audition Result: Selected
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                      Congratulations, {existingApp.full_name}!
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                      You have been officially selected as a member of the <span className="font-bold text-[#00629B] dark:text-[#00A3E0]">IEEE PEC Student Branch</span> for the academic year 2026–2027!
                    </p>
                  </div>

                  {/* WhatsApp Group Onboarding Button */}
                  {settings.whatsapp_group_link && (
                    <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 max-w-md mx-auto space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        Next Step: Join Member Community
                      </p>
                      <Button
                        asChild
                        size="lg"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-md"
                      >
                        <a href={settings.whatsapp_group_link} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-5 h-5" />
                          Join Official WhatsApp Group
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ) : existingApp.status === "Hold" ? (
                /* HOLD RESULT */
                <div className="p-8 sm:p-10 rounded-3xl bg-blue-50/60 dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-800 text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#00629B] dark:text-[#00A3E0] flex items-center justify-center mx-auto">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-[#00629B] dark:text-blue-300">
                      Application Status: On Hold / Waitlist
                    </span>
                    <h3 className="text-2xl font-bold text-foreground pt-2">
                      Your Application is on Waitlist
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto pt-1 leading-relaxed">
                      Your profile is on the waitlist for this audition cycle. The executive committee will reach out to you directly if a vacancy opens up in your preferred domains.
                    </p>
                  </div>
                </div>
              ) : (
                /* REJECTED / NOT SELECTED RESULT (Option B) */
                <div className="p-8 sm:p-10 rounded-3xl bg-slate-100/70 dark:bg-slate-900 border border-border text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mx-auto">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Application Status: Not Selected
                    </span>
                    <h3 className="text-2xl font-bold text-foreground pt-2">
                      Thank You for Interviewing
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto pt-1 leading-relaxed">
                      Thank you for taking the time to audition for IEEE PEC. While we could not offer membership this cycle, with continuous participation in our workshops, hackathons, and symposiums, you can become an active member in our next induction cycle.
                    </p>
                  </div>
                </div>
              )}

              {/* Submitted Application Summary Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
                <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00629B]" />
                  Submitted Application Overview
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border">
                    <p className="text-muted-foreground">Student ID (SID)</p>
                    <p className="font-semibold text-foreground font-mono mt-0.5">{existingApp.sid}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border">
                    <p className="text-muted-foreground">Academic Year</p>
                    <p className="font-semibold text-foreground mt-0.5">{existingApp.year}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border">
                    <p className="text-muted-foreground">Department / Branch</p>
                    <p className="font-semibold text-foreground mt-0.5">{existingApp.branch}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border">
                    <p className="text-muted-foreground">Contact Phone</p>
                    <p className="font-semibold text-foreground mt-0.5">{existingApp.phone}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground font-medium">Selected Chapters:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingApp.chapters?.map((ch) => (
                      <span key={ch} className="px-2.5 py-1 rounded-lg bg-[#00629B]/10 text-[#00629B] dark:text-[#00A3E0] font-semibold">
                        {ch} Chapter
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground font-medium">Selected Technical Domains:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingApp.domains?.map((dom) => (
                      <span key={dom} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-foreground">
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* STATE 2: SIGNED IN, FILL NEW APPLICATION FORM */
            <div className="space-y-8">
              {/* Logged in User Bar */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Applying as {currentUser.email}</p>
                    <p className="text-[11px] text-muted-foreground">Google Account Verified</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs rounded-xl border-border"
                >
                  Switch Account
                </Button>
              </div>

              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-xl space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Candidate Audition Form
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Fill in your details accurately to register for the IEEE PEC interview round.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal & Academic Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        required
                        placeholder="Full name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sid" className="text-xs font-semibold">
                        Student ID (SID) *
                      </Label>
                      <Input
                        id="sid"
                        required
                        placeholder="e.g. 25103045"
                        value={formData.sid}
                        onChange={(e) => handleSidChange(e.target.value)}
                        className="h-10 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold">
                        College Email ID (Locked from Google)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        disabled
                        value={currentUser.email || formData.email}
                        className="h-10 text-xs opacity-80 cursor-not-allowed bg-muted"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold">
                        WhatsApp / Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        required
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="branch" className="text-xs font-semibold">
                        Department / Branch *
                      </Label>
                      <Input
                        id="branch"
                        required
                        placeholder="e.g. CSE / ECE / EE / ME / Civil"
                        value={formData.branch}
                        onChange={(e) =>
                          setFormData({ ...formData, branch: e.target.value })
                        }
                        className="h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="year" className="text-xs font-semibold">
                        Academic Year (Auto-detected from SID) *
                      </Label>
                      <select
                        id="year"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                      >
                        <option value="1st Year">1st Year (2025–2029)</option>
                        <option value="2nd Year">2nd Year (2024–2028)</option>
                        <option value="3rd Year">3rd Year (2023–2027)</option>
                      </select>
                    </div>
                  </div>

                  {/* Chapter Preference Selection */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <Label className="text-xs font-semibold block">
                      Target Chapter Affiliation(s) *
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {availableChapters.map((ch) => {
                        const checked = formData.chapters.includes(ch.id);
                        return (
                          <button
                            type="button"
                            key={ch.id}
                            onClick={() => handleChapterToggle(ch.id)}
                            className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                              checked
                                ? "border-[#00629B] bg-[#00629B]/10 font-semibold text-[#00629B] dark:text-[#00A3E0]"
                                : "border-border bg-slate-50 dark:bg-slate-800/40 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span>{ch.name}</span>
                            {checked && <CheckCircle2 className="w-4 h-4 text-[#00629B] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Technical Domain Interests */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <Label className="text-xs font-semibold block">
                      Technical Domain Preferences *
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {availableDomains.map((domain) => {
                        const checked = formData.domains.includes(domain);
                        return (
                          <button
                            type="button"
                            key={domain}
                            onClick={() => handleDomainToggle(domain)}
                            className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                              checked
                                ? "border-[#00629B] bg-[#00629B]/10 font-semibold text-[#00629B] dark:text-[#00A3E0]"
                                : "border-border bg-slate-50 dark:bg-slate-800/40 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span>{domain}</span>
                            {checked && <CheckCircle2 className="w-3.5 h-3.5 text-[#00629B] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Links & Motivation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div className="space-y-1.5">
                      <Label htmlFor="githubUrl" className="text-xs font-semibold">
                        GitHub Profile / Projects Link (Optional)
                      </Label>
                      <Input
                        id="githubUrl"
                        placeholder="https://github.com/username"
                        value={formData.githubUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, githubUrl: e.target.value })
                        }
                        className="h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="portfolioUrl" className="text-xs font-semibold">
                        LinkedIn / Portfolio URL (Optional)
                      </Label>
                      <Input
                        id="portfolioUrl"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.portfolioUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            portfolioUrl: e.target.value,
                          })
                        }
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="motivation" className="text-xs font-semibold">
                      Why do you want to join IEEE PEC? (Optional)
                    </Label>
                    <Textarea
                      id="motivation"
                      rows={3}
                      placeholder="Tell us about your interests, past projects or what you hope to build..."
                      value={formData.motivation}
                      onChange={(e) =>
                        setFormData({ ...formData, motivation: e.target.value })
                      }
                      className="text-xs"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#00629B] hover:bg-[#004B7A] text-white py-6 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-blue-500/25 transition-all gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          Submit Audition Application <Send className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
}