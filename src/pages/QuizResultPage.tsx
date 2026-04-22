import { ArrowLeft, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { PLAN_GESPREK_URL } from "@/lib/links";
import { PENDING_QUIZ_STORAGE_KEY, QUIZ_STORAGE_KEY, isCompleteQuizAnswers, matchQuizProfile, type QuizAnswers } from "@/lib/quiz-matching";
import { saveQuizProfile } from "@/lib/quiz-storage";

const readStoredAnswers = () => {
  const stored = sessionStorage.getItem(QUIZ_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as Partial<QuizAnswers>;
    return isCompleteQuizAnswers(parsed) ? parsed : null;
  } catch {
    sessionStorage.removeItem(QUIZ_STORAGE_KEY);
    return null;
  }
};

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const answers = useMemo(() => {
    const stateAnswers = (location.state as { answers?: Partial<QuizAnswers> } | null)?.answers;
    return isCompleteQuizAnswers(stateAnswers) ? stateAnswers : readStoredAnswers();
  }, [location.state]);

  const result = useMemo(() => (answers ? matchQuizProfile(answers) : null), [answers]);

  const handleSave = async () => {
    if (!answers) return;

    if (!user) {
      sessionStorage.setItem(PENDING_QUIZ_STORAGE_KEY, JSON.stringify(answers));
      navigate("/registreer");
      return;
    }

    setSaving(true);
    try {
      await saveQuizProfile(user.id, answers);
      toast({ title: "Profiel bewaard.", description: "Je quizresultaat staat nu in je profiel." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Probeer het later opnieuw.";
      toast({ title: "Opslaan is niet gelukt", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!answers || !result) {
    return (
      <section className="min-h-[72vh] bg-background px-5 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl border border-border bg-card p-6 sm:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Investeerdersprofiel</p>
          <h1 className="text-3xl font-semibold text-primary">Nog geen resultaat beschikbaar</h1>
          <p className="mt-4 text-muted-foreground">Vul eerst de korte oriëntatie in om je profiel te bekijken.</p>
          <Button asChild className="mt-8">
            <Link to="/quiz">Start de quiz</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[72vh] bg-background px-5 py-12 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 px-0 text-primary hover:bg-transparent hover:text-accent">
          <Link to="/quiz">
            <ArrowLeft /> Antwoorden aanpassen
          </Link>
        </Button>

        <div className="border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Jouw profiel</p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{result.profile}</h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {result.markets.map((market) => (
              <span key={market} className="border border-accent bg-background px-3 py-1 text-sm font-semibold text-primary">
                {market}
              </span>
            ))}
          </div>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">{result.motivation}</p>

          <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Samenvatting</h2>
              <dl className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div><dt className="font-semibold text-primary">Budget</dt><dd>{answers.budget}</dd></div>
                <div><dt className="font-semibold text-primary">Doel</dt><dd>{answers.doel}</dd></div>
                <div><dt className="font-semibold text-primary">Horizon</dt><dd>{answers.horizon}</dd></div>
                <div><dt className="font-semibold text-primary">Risico</dt><dd>{answers.risico}</dd></div>
              </dl>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="sm:flex-1">
              <a href={PLAN_GESPREK_URL} target="_blank" rel="noreferrer">Plan een gesprek</a>
            </Button>
            <Button type="button" size="lg" variant="outline" className="sm:flex-1" onClick={handleSave} disabled={saving}>
              <Save /> {saving ? "Bezig met bewaren" : "Bewaar mijn profiel"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizResultPage;
