import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SurveyPoll from "@/components/SurveyPoll";
import { BarChart3, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SurveysPage() {
  // Query active survey
  const activeSurvey = await prisma.survey.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  // Query inactive surveys with response counts
  const pastSurveys = await prisma.survey.findMany({
    where: { isActive: false },
    include: { responses: true },
    orderBy: { createdAt: "desc" },
  });

  // Aggregate results for past surveys
  const pastSurveysResults = pastSurveys.map((survey) => {
    const options: string[] = JSON.parse(survey.options);
    const total = survey.responses.length;

    const counts: { [key: string]: number } = {};
    options.forEach((opt) => (counts[opt] = 0));

    survey.responses.forEach((resp) => {
      if (counts[resp.selectedOption] !== undefined) {
        counts[resp.selectedOption]++;
      }
    });

    const percentages: { [key: string]: number } = {};
    options.forEach((opt) => {
      percentages[opt] = total > 0 ? (counts[opt] / total) * 100 : 0;
    });

    return {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      total,
      options,
      percentages,
    };
  });

  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-primary">
              Student Surveys
            </h1>
            <p className="font-serif text-lg font-light text-muted-foreground leading-relaxed">
              We collect anonymous data to highlight real struggles on campus. Aggregate metrics offer raw validation that academic pressure is systemic, not personal.
            </p>
          </div>

          <hr className="border-border/40" />

          {/* Active survey */}
          {activeSurvey ? (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-primary text-center">
                Current Survey
              </h2>
              <SurveyPoll survey={activeSurvey} />
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground border border-dashed rounded-2xl">
              No active survey currently running.
            </div>
          )}

          {/* Historical Surveys */}
          <div className="space-y-8 pt-8">
            <h2 className="font-serif text-2xl font-bold text-primary">
              Past Survey Results
            </h2>

            {pastSurveysResults.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground border border-dashed rounded-2xl">
                No past survey results available.
              </div>
            ) : (
              <div className="space-y-6">
                {pastSurveysResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-card border border-border/40 rounded-2xl p-6 space-y-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-primary">
                        {result.title}
                      </h3>
                      {result.description && (
                        <p className="text-xs text-muted-foreground font-light">
                          {result.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      {result.options.map((option) => {
                        const pct = result.percentages[option] || 0;
                        return (
                          <div key={option} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-medium">
                              <span className="text-muted-foreground">{option}</span>
                              <span className="text-primary font-bold">{pct.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary/60"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-right text-xxs text-muted-foreground font-light pt-2 border-t border-border/30">
                      Completed: {result.total.toLocaleString()} anonymous responses
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
