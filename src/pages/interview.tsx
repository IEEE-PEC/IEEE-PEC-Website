import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { client } from "@/lib/supabase/supabase";
import PageHead from "@/components/layout/PageHead";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Check,
} from "lucide-react";
import { toast } from "sonner";

type Role = "pending" | "interviewer" | "admin";

type Application = {
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
  created_at: string;
};

type InterviewEvaluation = {
  id?: string;
  application_id: string;
  interviewer_name: string;
  technical_score: number;
  communication_score: number;
  confidence_score: number;
  teamwork_score: number;
  overall_score: number;
  recommendation: string;
  comments: string | null;
  created_at?: string;
};

export default function InterviewPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUserRole, setCurrentUserRole] =
    useState<Role | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [evaluations, setEvaluations] = useState<Record<string, InterviewEvaluation>>({});
  const [loadingApplications, setLoadingApplications] =
    useState(true);

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Walk-In Candidate Modal state
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    fullName: "",
    sid: "",
    email: "",
    phone: "",
    branch: "",
    year: "1st Year",
  });
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);

  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);

  const [interviewerName, setInterviewerName] =
    useState("");

  const [technicalScore, setTechnicalScore] =
    useState("");

  const [communicationScore, setCommunicationScore] =
    useState("");

  const [confidenceScore, setConfidenceScore] =
    useState("");

  const [teamworkScore, setTeamworkScore] =
    useState("");

  const [recommendation, setRecommendation] =
    useState("");

  const [comments, setComments] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  /*
   * Check authentication and role
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await client.auth.getUser();

        if (!user) {
          router.replace("/interview-login");
          return;
        }

        const email =
          user.email?.toLowerCase() || "";

        if (!email.endsWith("@pec.edu.in")) {
          await client.auth.signOut();

          toast.error(
            "Only @pec.edu.in accounts are allowed."
          );

          router.replace("/interview-login");
          return;
        }

        const {
          data: profile,
          error,
        } = await client
          .from("profiles")
          .select("role, full_name")
          .eq("id", user.id)
          .single();

        if (error || !profile) {
          console.error(
            "Profile lookup error:",
            error
          );

          toast.error(
            "Your account profile could not be found."
          );

          router.replace("/interview-login");
          return;
        }

        if (
          profile.role !== "interviewer" &&
          profile.role !== "admin"
        ) {
          await client.auth.signOut();

          toast.error(
            "You do not have interview portal access."
          );

          router.replace("/interview-login");
          return;
        }

        setCurrentUserRole(profile.role);
        const defaultInterviewer = profile.full_name || user.user_metadata?.full_name || "";
        if (defaultInterviewer) {
          setInterviewerName(defaultInterviewer);
        }

        setCheckingAuth(false);

        await loadApplications();
      } catch (error) {
        console.error(
          "Authentication error:",
          error
        );

        toast.error(
          "Failed to verify your account."
        );

        router.replace("/interview-login");
      }
    };

    checkAuth();
  }, [router]);

  /*
   * Load applicants and evaluations
   */
  const loadApplications = async () => {
    setLoadingApplications(true);

    try {
      const [appsRes, evalsRes] = await Promise.all([
        client
          .from("applications")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),
        client
          .from("interviews")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (appsRes.error) {
        console.error(
          "Application loading error:",
          appsRes.error
        );

        toast.error(
          "Failed to load applicants."
        );
      } else {
        setApplications(appsRes.data || []);
      }

      if (evalsRes.data) {
        const map: Record<string, InterviewEvaluation> = {};
        evalsRes.data.forEach((ev: InterviewEvaluation) => {
          if (!map[ev.application_id]) {
            map[ev.application_id] = ev;
          }
        });
        setEvaluations(map);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
      toast.error("Failed to load applicants and evaluations.");
    } finally {
      setLoadingApplications(false);
    }
  };

  /*
   * Academic Year counts
   */
  const count1st = useMemo(
    () => applications.filter((a) => a.year?.toLowerCase().includes("1st")).length,
    [applications]
  );
  const count2nd = useMemo(
    () => applications.filter((a) => a.year?.toLowerCase().includes("2nd")).length,
    [applications]
  );
  const count3rd = useMemo(
    () => applications.filter((a) => a.year?.toLowerCase().includes("3rd")).length,
    [applications]
  );

  /*
   * Status counts
   */
  const pendingCount = useMemo(
    () => applications.filter((a) => !evaluations[a.id]).length,
    [applications, evaluations]
  );
  const selectedCount = useMemo(
    () =>
      applications.filter(
        (a) => evaluations[a.id]?.recommendation === "Select"
      ).length,
    [applications, evaluations]
  );
  const holdCount = useMemo(
    () =>
      applications.filter(
        (a) => evaluations[a.id]?.recommendation === "Hold"
      ).length,
    [applications, evaluations]
  );
  const rejectedCount = useMemo(
    () =>
      applications.filter(
        (a) => evaluations[a.id]?.recommendation === "Reject"
      ).length,
    [applications, evaluations]
  );

  /*
   * Search and filter applicants
   */
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const query = search.trim().toLowerCase();

      if (query) {
        const matches =
          application.full_name.toLowerCase().includes(query) ||
          application.sid.toLowerCase().includes(query) ||
          application.email.toLowerCase().includes(query) ||
          application.branch.toLowerCase().includes(query);
        if (!matches) return false;
      }

      if (yearFilter !== "All") {
        if (!application.year?.toLowerCase().includes(yearFilter.toLowerCase())) {
          return false;
        }
      }

      if (statusFilter !== "All") {
        const ev = evaluations[application.id];
        if (statusFilter === "Pending") {
          if (ev) return false;
        } else if (statusFilter === "Evaluated") {
          if (!ev) return false;
        } else {
          if (ev?.recommendation !== statusFilter) return false;
        }
      }

      return true;
    });
  }, [applications, search, yearFilter, statusFilter, evaluations]);

  /*
   * Select applicant & populate existing evaluation if present
   */
  const selectApplicant = (application: Application) => {
    setSelectedApplicant(application);

    const existing = evaluations[application.id];
    if (existing) {
      if (existing.interviewer_name) {
        setInterviewerName(existing.interviewer_name);
      }
      setTechnicalScore(String(existing.technical_score ?? ""));
      setCommunicationScore(String(existing.communication_score ?? ""));
      setConfidenceScore(String(existing.confidence_score ?? ""));
      setTeamworkScore(String(existing.teamwork_score ?? ""));
      setRecommendation(existing.recommendation || "");
      setComments(existing.comments || "");
    } else {
      setTechnicalScore("");
      setCommunicationScore("");
      setConfidenceScore("");
      setTeamworkScore("");
      setRecommendation("");
      setComments("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Walk-in SID Auto-detect Year
   */
  const handleWalkInSidChange = (val: string) => {
    let autoYear = walkInForm.year;
    const clean = val.trim();
    if (clean.length >= 2) {
      const prefix = clean.substring(0, 2);
      if (prefix === "25") autoYear = "1st Year";
      else if (prefix === "24") autoYear = "2nd Year";
      else if (prefix === "23") autoYear = "3rd Year";
    }
    setWalkInForm((prev) => ({ ...prev, sid: val, year: autoYear }));
  };

  /*
   * Create Walk-In Candidate
   */
  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !walkInForm.fullName.trim() ||
      !walkInForm.sid.trim() ||
      !walkInForm.branch.trim()
    ) {
      toast.error("Please fill in Full Name, SID, and Branch.");
      return;
    }

    setSubmittingWalkIn(true);

    try {
      const newApp = {
        full_name: walkInForm.fullName.trim(),
        sid: walkInForm.sid.trim(),
        email:
          walkInForm.email.trim() ||
          `${walkInForm.sid.trim()}@pec.edu.in`,
        phone: walkInForm.phone.trim() || "N/A",
        branch: walkInForm.branch.trim(),
        year: walkInForm.year,
        chapters: ["General Auditions"],
        domains: ["Auditions"],
        github_url: null,
        portfolio_url: null,
        motivation: "Walk-in applicant during auditions.",
      };

      const { data, error } = await client
        .from("applications")
        .insert(newApp)
        .select()
        .single();

      if (error) throw error;

      const createdApplicant =
        (data as Application) || {
          ...newApp,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        };

      setApplications((prev) => [createdApplicant, ...prev]);
      setWalkInOpen(false);
      setWalkInForm({
        fullName: "",
        sid: "",
        email: "",
        phone: "",
        branch: "",
        year: "1st Year",
      });

      toast.success("Walk-in applicant registered!");
      selectApplicant(createdApplicant);
    } catch (err) {
      console.error("Walk-in applicant creation error:", err);
      toast.error("Failed to register walk-in applicant.");
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  /*
   * Close evaluation
   */
  const closeEvaluation = () => {
    setSelectedApplicant(null);

    setTechnicalScore("");
    setCommunicationScore("");
    setConfidenceScore("");
    setTeamworkScore("");
    setRecommendation("");
    setComments("");
  };

  /*
   * Calculate overall score
   */
  const scoreValues = [
    Number(technicalScore),
    Number(communicationScore),
    Number(confidenceScore),
    Number(teamworkScore),
  ];

  const allScoresEntered =
    technicalScore !== "" &&
    communicationScore !== "" &&
    confidenceScore !== "" &&
    teamworkScore !== "";

  const overallScore = allScoresEntered
    ? scoreValues.reduce(
        (sum, score) => sum + score,
        0
      ) / 4
    : 0;

  /*
   * Submit evaluation
   */
  const submitInterview = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedApplicant) {
      toast.error(
        "Please select an applicant."
      );
      return;
    }

    if (!interviewerName.trim()) {
      toast.error(
        "Please enter interviewer name."
      );
      return;
    }

    if (!allScoresEntered) {
      toast.error(
        "Please enter all four scores."
      );
      return;
    }

    const invalidScore =
      scoreValues.some(
        (score) =>
          Number.isNaN(score) ||
          score < 0 ||
          score > 10
      );

    if (invalidScore) {
      toast.error(
        "Each score must be between 0 and 10."
      );
      return;
    }

    if (!recommendation) {
      toast.error(
        "Please select a recommendation."
      );
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      setSubmitting(false);

      toast.error(
        "Your session has expired."
      );

      router.replace("/interview-login");

      return;
    }

    const newEvaluation: InterviewEvaluation = {
      application_id: selectedApplicant.id,
      interviewer_name: interviewerName.trim(),
      technical_score: Number(technicalScore),
      communication_score: Number(communicationScore),
      confidence_score: Number(confidenceScore),
      teamwork_score: Number(teamworkScore),
      overall_score: Math.round(overallScore),
      recommendation,
      comments: comments.trim() || null,
      created_at: new Date().toISOString(),
    };

    const { error } = await client
      .from("interviews")
      .insert({
        application_id: newEvaluation.application_id,
        interviewer_name: newEvaluation.interviewer_name,
        technical_score: newEvaluation.technical_score,
        communication_score: newEvaluation.communication_score,
        confidence_score: newEvaluation.confidence_score,
        teamwork_score: newEvaluation.teamwork_score,
        overall_score: newEvaluation.overall_score,
        recommendation: newEvaluation.recommendation,
        comments: newEvaluation.comments,
      });

    setSubmitting(false);

    if (error) {
      console.error(
        "Interview submission error:",
        error
      );

      toast.error(
        "Failed to save interview evaluation."
      );

      return;
    }

    setEvaluations((prev) => ({
      ...prev,
      [selectedApplicant.id]: newEvaluation,
    }));

    toast.success(
      "Interview evaluation saved successfully."
    );

    closeEvaluation();
  };

  /*
   * Logout
   */
  const handleLogout = async () => {
    await client.auth.signOut();

    router.replace("/interview-login");
  };

  /*
   * Authentication loading
   */
  if (checkingAuth) {
    return (
      <>
        <PageHead title="Interview Portal" />

        <main className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
          <p className="text-gray-500 dark:text-muted-foreground">
            Checking access...
          </p>
        </main>
      </>
    );
  }

  /*
   * Applicants loading
   */
  if (loadingApplications) {
    return (
      <>
        <PageHead title="Interview Portal" />

        <main className="min-h-screen bg-gray-50 dark:bg-background">

          <section className="bg-[#062b52] dark:bg-[#0a1628] text-white py-10">
            <div className="max-w-6xl mx-auto px-6">

              <h1 className="text-3xl font-bold">
                Interview Portal
              </h1>

              <p className="mt-2 text-gray-200">
                Loading applicants...
              </p>

            </div>
          </section>

          <div className="flex justify-center py-20">
            <p className="text-gray-500 dark:text-muted-foreground">
              Loading applicants...
            </p>
          </div>

        </main>
      </>
    );
  }

  return (
    <>
      <PageHead title="Interview Portal" />

      <main className="min-h-screen bg-gray-50 dark:bg-background">

        {/* Header */}
        <section className="bg-[#062b52] dark:bg-[#0a1628] text-white py-10">

          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                Interview Portal
              </h1>

              <p className="mt-2 text-gray-200">
                Review applicants and record interview evaluations.
              </p>
            </div>

            <div className="flex items-center gap-3">

              {currentUserRole === "admin" && (
                <Button
                  type="button"
                  onClick={() =>
                    router.push("/interview-admin")
                  }
                  className="bg-white dark:bg-card text-black dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent"
                >
                  Admin Panel
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="bg-white dark:bg-card text-black dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent"
              >
                Logout
              </Button>

            </div>

          </div>

        </section>

        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Evaluation */}
          {selectedApplicant && (
            <section className="bg-white dark:bg-card border dark:border-border rounded-xl shadow-sm p-6 mb-8">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-xl font-bold">
                    Interview Evaluation
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Evaluating{" "}
                    <span className="font-medium text-gray-700">
                      {selectedApplicant.full_name}
                    </span>
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEvaluation}
                >
                  Back to Applicants
                </Button>

              </div>

              {/* Applicant information */}
              <div className="bg-gray-50 dark:bg-secondary border dark:border-border rounded-lg p-5 mb-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div>
                    <p className="text-xs text-gray-500">
                      Name
                    </p>

                    <p className="font-semibold">
                      {selectedApplicant.full_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      SID
                    </p>

                    <p className="font-semibold">
                      {selectedApplicant.sid}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Branch
                    </p>

                    <p className="font-semibold">
                      {selectedApplicant.branch}
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                  <div>
                    <p className="text-xs text-gray-500">
                      Email
                    </p>

                    <p className="font-medium">
                      {selectedApplicant.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Year
                    </p>

                    <p className="font-medium">
                      {selectedApplicant.year}
                    </p>
                  </div>

                </div>

              </div>

              <form onSubmit={submitInterview}>

                {/* Interviewer */}
                <div className="mb-6">

                  <label className="text-sm font-medium">
                    Interviewer Name
                  </label>

                  <Input
                    placeholder="Enter interviewer name"
                    value={interviewerName}
                    onChange={(e) =>
                      setInterviewerName(
                        e.target.value
                      )
                    }
                    className="mt-2"
                  />

                </div>

                {/* Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="text-sm font-medium">
                      Technical Skills / 10
                    </label>

                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={technicalScore}
                      onChange={(e) =>
                        setTechnicalScore(
                          e.target.value
                        )
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Communication / 10
                    </label>

                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={communicationScore}
                      onChange={(e) =>
                        setCommunicationScore(
                          e.target.value
                        )
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Confidence / 10
                    </label>

                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={confidenceScore}
                      onChange={(e) =>
                        setConfidenceScore(
                          e.target.value
                        )
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Teamwork / 10
                    </label>

                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={teamworkScore}
                      onChange={(e) =>
                        setTeamworkScore(
                          e.target.value
                        )
                      }
                      className="mt-2"
                    />
                  </div>

                </div>

                {/* Overall score */}
                <div className="mt-6 p-5 bg-gray-50 dark:bg-secondary border dark:border-border rounded-lg">

                  <p className="text-sm text-gray-500">
                    Overall Score
                  </p>

                  <p className="text-3xl font-bold mt-1">
                    {allScoresEntered
                      ? `${overallScore.toFixed(
                          1
                        )} / 10`
                      : "—"}
                  </p>

                </div>

                {/* Recommendation */}
                <div className="mt-6">

                  <label className="text-sm font-medium">
                    Recommendation
                  </label>

                  <select
                    value={recommendation}
                    onChange={(e) =>
                      setRecommendation(
                        e.target.value
                      )
                    }
                    className="w-full mt-2 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >

                    <option value="">
                      Select recommendation
                    </option>

                    <option value="Select">
                      Select
                    </option>

                    <option value="Hold">
                      Hold
                    </option>

                    <option value="Reject">
                      Reject
                    </option>

                  </select>

                </div>

                {/* Comments */}
                <div className="mt-6">

                  <label className="text-sm font-medium">
                    Interview Comments
                  </label>

                  <Textarea
                    placeholder="Enter interview feedback..."
                    value={comments}
                    onChange={(e) =>
                      setComments(
                        e.target.value
                      )
                    }
                    className="mt-2 min-h-[140px]"
                  />

                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-6"
                >
                  {submitting
                    ? "Saving..."
                    : "Save Interview Evaluation"}
                </Button>

              </form>

            </section>
          )}

          {/* Applicant list */}
          {!selectedApplicant && (
            <section>
              {/* List Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Applicants</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {applications.length} total applicant{applications.length !== 1 ? "s" : ""} ·{" "}
                    <span className="font-semibold text-amber-600">{pendingCount} pending</span> ·{" "}
                    <span className="font-semibold text-emerald-600">{selectedCount} selected</span> ·{" "}
                    <span className="font-semibold text-blue-600">{holdCount} hold</span> ·{" "}
                    <span className="font-semibold text-rose-600">{rejectedCount} rejected</span>
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => setWalkInOpen(true)}
                  className="bg-[#062b52] hover:bg-[#083a6f] text-white flex items-center gap-2 self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Walk-In Candidate</span>
                </Button>
              </div>

              {/* Filters Box */}
              <div className="bg-white dark:bg-card border dark:border-border rounded-xl shadow-sm p-5 mb-6 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search by name, SID, email, or branch..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                {/* Filter Row 1: Academic Year Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mr-1">
                    Year:
                  </span>
                  {[
                    { label: `All (${applications.length})`, value: "All" },
                    { label: `1st Year (${count1st})`, value: "1st" },
                    { label: `2nd Year (${count2nd})`, value: "2nd" },
                    { label: `3rd Year (${count3rd})`, value: "3rd" },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setYearFilter(tab.value)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                        yearFilter === tab.value
                          ? "bg-[#062b52] text-white shadow-sm font-semibold"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Filter Row 2: Status Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mr-1">
                    Status:
                  </span>
                  {[
                    { label: `All Statuses (${applications.length})`, value: "All" },
                    { label: `🟡 Pending (${pendingCount})`, value: "Pending" },
                    { label: `🟢 Selected (${selectedCount})`, value: "Select" },
                    { label: `🔵 Hold (${holdCount})`, value: "Hold" },
                    { label: `🔴 Rejected (${rejectedCount})`, value: "Reject" },
                  ].map((pill) => (
                    <button
                      key={pill.value}
                      type="button"
                      onClick={() => setStatusFilter(pill.value)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                        statusFilter === pill.value
                          ? "bg-slate-900 text-white shadow-sm font-semibold"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applicant Cards */}
              {filteredApplications.length === 0 ? (
                <div className="bg-white dark:bg-card border dark:border-border rounded-xl p-12 text-center shadow-sm">
                  <AlertCircle className="w-8 h-8 text-gray-400 dark:text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-foreground">No applicants found</h3>
                  <p className="text-gray-500 dark:text-muted-foreground mt-1 text-sm">
                    No candidates match the active search and filter combination.
                  </p>
                  {(yearFilter !== "All" || statusFilter !== "All" || search) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setYearFilter("All");
                        setStatusFilter("All");
                      }}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredApplications.map((application) => {
                    const ev = evaluations[application.id];

                    return (
                      <div
                        key={application.id}
                        className="bg-white dark:bg-card border dark:border-border rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          {/* Card Header: Name + Year & Status Badges */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-foreground">
                                {application.full_name}
                              </h3>
                              <p className="text-xs font-mono text-gray-500 dark:text-muted-foreground mt-0.5">
                                SID: {application.sid}
                              </p>
                            </div>

                            <span className="text-xs font-semibold bg-gray-100 dark:bg-secondary text-gray-700 dark:text-secondary-foreground rounded-full px-3 py-1 border border-gray-200 dark:border-border whitespace-nowrap">
                              {application.year}
                            </span>
                          </div>

                          {/* Evaluation Status Badge */}
                          <div className="mt-3">
                            {ev ? (
                              <div
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center justify-between border ${
                                  ev.recommendation === "Select"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : ev.recommendation === "Hold"
                                    ? "bg-blue-50 text-blue-800 border-blue-200"
                                    : "bg-rose-50 text-rose-800 border-rose-200"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 font-bold">
                                  {ev.recommendation === "Select" && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  )}
                                  {ev.recommendation === "Hold" && (
                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                  )}
                                  {ev.recommendation === "Reject" && (
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  )}
                                  <span>{ev.recommendation}</span>
                                  <span className="font-normal opacity-80">
                                    · {ev.overall_score}/10
                                  </span>
                                </div>
                                <span className="text-[11px] text-gray-500">
                                  by {ev.interviewer_name}
                                </span>
                              </div>
                            ) : (
                              <div className="text-xs px-3 py-1.5 rounded-lg font-medium bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Pending Interview</span>
                              </div>
                            )}
                          </div>

                          {/* Candidate Details */}
                          <div className="mt-4 space-y-1.5 text-xs text-gray-600">
                            <p>
                              <span className="font-semibold text-gray-500">Branch:</span>{" "}
                              {application.branch}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-500">Email:</span>{" "}
                              {application.email}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-500">Phone:</span>{" "}
                              {application.phone}
                            </p>
                            {application.domains && application.domains.length > 0 && (
                              <p className="truncate">
                                <span className="font-semibold text-gray-500">Domains:</span>{" "}
                                {application.domains.join(", ")}
                              </p>
                            )}
                            {application.chapters && application.chapters.length > 0 && (
                              <p className="truncate">
                                <span className="font-semibold text-gray-500">Chapters:</span>{" "}
                                {application.chapters.join(", ")}
                              </p>
                            )}
                            {ev?.comments && (
                              <p className="mt-2 p-2 bg-gray-50 dark:bg-secondary rounded border border-gray-100 dark:border-border text-[11px] text-gray-700 dark:text-muted-foreground italic">
                                &ldquo;{ev.comments}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex gap-3">
                            {application.github_url && (
                              <a
                                href={application.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline font-medium"
                              >
                                GitHub
                              </a>
                            )}
                            {application.portfolio_url && (
                              <a
                                href={application.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline font-medium"
                              >
                                Portfolio
                              </a>
                            )}
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant={ev ? "outline" : "default"}
                            onClick={() => selectApplicant(application)}
                            className={
                              ev
                                ? "border-gray-300 text-gray-800 hover:bg-gray-100 text-xs"
                                : "bg-[#062b52] hover:bg-[#083a6f] text-white text-xs font-semibold"
                            }
                          >
                            {ev ? "Re-evaluate / Edit" : "Take Interview"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Walk-In Candidate Modal */}
              <Dialog open={walkInOpen} onOpenChange={setWalkInOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-[#062b52]" />
                      <span>Add Walk-In Candidate</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-gray-500">
                      Quickly register a candidate who arrived in-person without submitting the online form beforehand.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreateWalkIn} className="space-y-4 mt-2">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Full Name *</label>
                      <Input
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={walkInForm.fullName}
                        onChange={(e) =>
                          setWalkInForm({ ...walkInForm, fullName: e.target.value })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700">Student ID (SID) *</label>
                        <Input
                          required
                          placeholder="e.g. 25103045"
                          value={walkInForm.sid}
                          onChange={(e) => handleWalkInSidChange(e.target.value)}
                          className="mt-1 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700">Academic Year *</label>
                        <select
                          value={walkInForm.year}
                          onChange={(e) =>
                            setWalkInForm({ ...walkInForm, year: e.target.value })
                          }
                          className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 text-xs"
                        >
                          <option value="1st Year">1st Year (Freshman)</option>
                          <option value="2nd Year">2nd Year (Sophomore)</option>
                          <option value="3rd Year">3rd Year (Junior)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700">Branch *</label>
                        <Input
                          required
                          placeholder="e.g. CSE / ECE"
                          value={walkInForm.branch}
                          onChange={(e) =>
                            setWalkInForm({ ...walkInForm, branch: e.target.value })
                          }
                          className="mt-1 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700">Phone</label>
                        <Input
                          placeholder="e.g. +91 9876543210"
                          value={walkInForm.phone}
                          onChange={(e) =>
                            setWalkInForm({ ...walkInForm, phone: e.target.value })
                          }
                          className="mt-1 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700">College Email</label>
                      <Input
                        type="email"
                        placeholder="Defaults to SID@pec.edu.in if empty"
                        value={walkInForm.email}
                        onChange={(e) =>
                          setWalkInForm({ ...walkInForm, email: e.target.value })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setWalkInOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={submittingWalkIn}
                        className="bg-[#062b52] hover:bg-[#083a6f] text-white"
                      >
                        {submittingWalkIn ? "Registering..." : "Register & Start Interview"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </section>
          )}

        </div>

      </main>
    </>
  );
}