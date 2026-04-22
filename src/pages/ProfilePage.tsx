import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { quizQuestions, type QuizAnswers } from "@/lib/quiz-matching";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

const getQuizAnswers = (quizData: unknown): QuizAnswers | null => {
  if (!quizData || typeof quizData !== "object" || !("answers" in quizData)) return null;
  return (quizData as { answers?: QuizAnswers }).answers ?? null;
};

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { profile, refresh } = useProfile();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const answers = getQuizAnswers(profile?.quiz_data);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
  }, [profile?.full_name, profile?.phone]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("user_id", user.id);
    setSaving(false);

    if (error) {
      toast({ title: "Opslaan is niet gelukt", description: error.message, variant: "destructive" });
      return;
    }

    await refresh();
    toast({ title: "Profiel opgeslagen." });
  };

  return (
    <section className="bg-background px-5 py-12 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="lg:col-span-2">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Mijn VIA</p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">Profiel</h1>
        </div>

        <Card className="rounded-sm">
          <CardHeader><CardTitle>Accountgegevens</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2"><Label htmlFor="fullName">Naam</Label><Input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="phone">Telefoon</Label><Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" value={user?.email ?? ""} readOnly /></div>
              <div className="flex flex-col gap-3 sm:flex-row"><Button type="submit" disabled={saving}>{saving ? "Bezig met opslaan" : "Opslaan"}</Button><Button type="button" variant="outline" onClick={signOut}><LogOut /> Uitloggen</Button></div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardHeader><CardTitle>Quiz-antwoorden</CardTitle></CardHeader>
          <CardContent>
            {answers ? <><dl className="grid gap-3 text-sm">{quizQuestions.map((question) => <div key={question.id}><dt className="font-semibold text-primary">{question.label}</dt><dd className="text-muted-foreground">{answers[question.id]}</dd></div>)}</dl><Button asChild variant="outline" className="mt-6"><Link to="/quiz">Oriëntatie opnieuw doen</Link></Button></> : <p className="text-muted-foreground">Je hebt nog geen quiz-antwoorden opgeslagen.</p>}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProfilePage;