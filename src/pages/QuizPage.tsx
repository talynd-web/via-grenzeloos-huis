import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QUIZ_STORAGE_KEY, quizQuestions, type QuizAnswers } from "@/lib/quiz-matching";

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(() => (location.state as { answers?: QuizAnswers } | null)?.answers ?? {});
  const currentQuestion = quizQuestions[step];
  const currentAnswer = answers[currentQuestion.id];
  const progress = ((step + 1) / quizQuestions.length) * 100;

  const canContinue = useMemo(() => Boolean(currentAnswer), [currentAnswer]);

  const handleBack = () => {
    if (step === 0) {
      navigate("/");
      return;
    }

    setStep((current) => current - 1);
  };

  const handleNext = () => {
    if (!canContinue) return;

    if (step < quizQuestions.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    const completeAnswers = answers as QuizAnswers;
    sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(completeAnswers));
    navigate("/quiz/resultaat", { state: { answers: completeAnswers } });
  };

  return (
    <section className="min-h-[72vh] bg-background px-5 py-12 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>
              Vraag {step + 1} van {quizQuestions.length}
            </span>
            <span>{currentQuestion.label}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Investeerdersprofiel</p>
          <h1 className="text-3xl font-semibold leading-tight text-primary sm:text-4xl">{currentQuestion.question}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Een paar korte vragen om je situatie scherper te krijgen. Het resultaat is voor jou — je kunt het bewaren of gewoon lezen. Geen verplichtingen.
          </p>

          <RadioGroup
            value={currentAnswer ?? ""}
            onValueChange={(value) => setAnswers((current) => ({ ...current, [currentQuestion.id]: value }))}
            className="mt-8 gap-3"
          >
            {currentQuestion.options.map((option) => (
              <Label
                key={option}
                className="flex cursor-pointer items-center gap-3 border border-border bg-background px-4 py-4 text-base font-medium text-primary transition-colors hover:border-accent"
              >
                <RadioGroupItem value={option} />
                <span>{option}</span>
              </Label>
            ))}
          </RadioGroup>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft /> Terug
            </Button>
            <Button type="button" onClick={handleNext} disabled={!canContinue}>
              {step === quizQuestions.length - 1 ? "Bekijk resultaat" : "Volgende"} <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizPage;
