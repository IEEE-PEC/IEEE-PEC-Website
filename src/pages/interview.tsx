import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { client } from "@/lib/supabase/supabase";
import PageHead from "@/components/layout/PageHead";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

export default function InterviewPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUserRole, setCurrentUserRole] =
    useState<Role | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] =
    useState(true);

  const [search, setSearch] = useState("");

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
          .select("role")
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
   * Load applicants
   */
  const loadApplications = async () => {
    setLoadingApplications(true);

    const {
      data,
      error,
    } = await client
      .from("applications")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setLoadingApplications(false);

    if (error) {
      console.error(
        "Application loading error:",
        error
      );

      toast.error(
        "Failed to load applicants."
      );

      return;
    }

    setApplications(data || []);
  };

  /*
   * Search applicants
   */
  const filteredApplications = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return applications;
    }

    return applications.filter(
      (application) =>
        application.full_name
          .toLowerCase()
          .includes(query) ||
        application.sid
          .toLowerCase()
          .includes(query) ||
        application.email
          .toLowerCase()
          .includes(query) ||
        application.branch
          .toLowerCase()
          .includes(query)
    );
  }, [applications, search]);

  /*
   * Select applicant
   */
  const selectApplicant = (
    application: Application
  ) => {
    setSelectedApplicant(application);

    setTechnicalScore("");
    setCommunicationScore("");
    setConfidenceScore("");
    setTeamworkScore("");
    setRecommendation("");
    setComments("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

    const { error } = await client
      .from("interviews")
      .insert({
        application_id:
          selectedApplicant.id,

        interviewer_name:
          interviewerName.trim(),

        technical_score:
          Number(technicalScore),

        communication_score:
          Number(communicationScore),

        confidence_score:
          Number(confidenceScore),

        teamwork_score:
          Number(teamworkScore),

        overall_score:
          Math.round(overallScore),

        recommendation,

        comments:
          comments.trim() || null,
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

        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">
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

        <main className="min-h-screen bg-gray-50">

          <section className="bg-[#062b52] text-white py-10">
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
            <p className="text-gray-500">
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

      <main className="min-h-screen bg-gray-50">

        {/* Header */}
        <section className="bg-[#062b52] text-white py-10">

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
                    router.push("/admin")
                  }
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Admin Panel
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="bg-white text-black hover:bg-gray-100"
              >
                Logout
              </Button>

            </div>

          </div>

        </section>

        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Evaluation */}
          {selectedApplicant && (
            <section className="bg-white border rounded-xl shadow-sm p-6 mb-8">

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
              <div className="bg-gray-50 border rounded-lg p-5 mb-6">

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
                <div className="mt-6 p-5 bg-gray-50 border rounded-lg">

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

              <div className="mb-6">

                <h2 className="text-2xl font-bold">
                  Applicants
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {applications.length} applicant
                  {applications.length !== 1
                    ? "s"
                    : ""}{" "}
                  available for interview.
                </p>

              </div>

              {/* Search */}
              <div className="bg-white border rounded-xl shadow-sm p-5 mb-6">

                <Input
                  placeholder="Search by name, SID, email or branch..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              {filteredApplications.length ===
                0 ? (
                <div className="bg-white border rounded-xl p-10 text-center">

                  <h3 className="font-semibold text-lg">
                    No applicants found
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Try changing your search.
                  </p>

                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {filteredApplications.map(
                    (application) => (
                      <div
                        key={application.id}
                        className="bg-white border rounded-xl shadow-sm p-6"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <h3 className="text-lg font-bold">
                              {
                                application.full_name
                              }
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              SID:{" "}
                              {application.sid}
                            </p>
                          </div>

                          <span className="text-xs bg-gray-100 rounded-full px-3 py-1">
                            {
                              application.year
                            }
                          </span>

                        </div>

                        <div className="mt-5 space-y-2 text-sm">

                          <p>
                            <span className="text-gray-500">
                              Branch:
                            </span>{" "}
                            {application.branch}
                          </p>

                          <p>
                            <span className="text-gray-500">
                              Email:
                            </span>{" "}
                            {application.email}
                          </p>

                          <p>
                            <span className="text-gray-500">
                              Domains:
                            </span>{" "}
                            {application.domains?.join(
                              ", "
                            ) ||
                              "None selected"}
                          </p>

                          <p>
                            <span className="text-gray-500">
                              Chapters:
                            </span>{" "}
                            {application.chapters?.join(
                              ", "
                            ) ||
                              "None selected"}
                          </p>

                        </div>

                        <div className="mt-6 flex items-center justify-between">

                          <div className="flex gap-3">

                            {application.github_url && (
                              <a
                                href={
                                  application.github_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                GitHub
                              </a>
                            )}

                            {application.portfolio_url && (
                              <a
                                href={
                                  application.portfolio_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                Portfolio
                              </a>
                            )}

                          </div>

                          <Button
                            type="button"
                            onClick={() =>
                              selectApplicant(
                                application
                              )
                            }
                          >
                            Take Interview
                          </Button>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </section>
          )}

        </div>

      </main>
    </>
  );
}git status