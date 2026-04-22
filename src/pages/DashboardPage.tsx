import { useQuery } from "@tanstack/react-query";
import { Download, Mail, MessageCircle, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { PLAN_GESPREK_URL } from "@/lib/links";
import { quizQuestions, type QuizAnswers } from "@/lib/quiz-matching";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "";

const getQuizAnswers = (quizData: unknown): QuizAnswers | null => {
  if (!quizData || typeof quizData !== "object" || !("answers" in quizData)) return null;
  return (quizData as { answers?: QuizAnswers }).answers ?? null;
};

const marketCopy = {
  spanje: { title: "Spanje", text: "Een volwassen markt met sterke kustvraag en een overzichtelijk aankoopproces.", href: "/spanje" },
  dubai: { title: "Dubai", text: "Een internationale markt met off-plan aanbod, gespreide betalingen en rendementsfocus.", href: "/dubai" },
};

const trajectSteps = ["Kennismaking & analyse", "Selectie & advies", "Introductie & begeleiding", "Vervolg & ondersteuning"];

const DashboardPage = () => {
  const { user, role } = useAuth();
  const { profile, loading } = useProfile();
  const answers = getQuizAnswers(profile?.quiz_data);
  const isClient = role === "client";

  const documentsQuery = useQuery({
    queryKey: ["documents", user?.id],
    enabled: Boolean(user?.id && isClient),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id,filename,file_path,uploaded_at")
        .eq("client_id", user!.id)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const downloadDocument = async (filePath: string) => {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(filePath, 60);
    if (!error && data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) return <section className="min-h-[70vh] bg-background px-5 py-16 text-muted-foreground">Even geduld</section>;

  return (
    <section className="bg-background px-5 py-12 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Mijn VIA</p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">Welkom terug, {profile?.full_name || user?.email}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {isClient ? "Hier zie je je lopende traject en alle informatie op één plek." : "Hier vind je je profiel en de markten die bij je passen."}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-sm">
            <CardHeader><CardTitle>Mijn profiel</CardTitle></CardHeader>
            <CardContent>
              {answers ? (
                <>
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    {quizQuestions.map((question) => <div key={question.id}><dt className="font-semibold text-primary">{question.label}</dt><dd className="text-muted-foreground">{answers[question.id]}</dd></div>)}
                  </dl>
                  <Button asChild variant="outline" className="mt-6"><Link to="/quiz">Bewerk antwoorden</Link></Button>
                </>
              ) : (
                <div><p className="text-muted-foreground">Je hebt de oriëntatie nog niet ingevuld.</p><Button asChild className="mt-6"><Link to="/quiz">Start oriëntatie</Link></Button></div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader><CardTitle>Mijn markten</CardTitle></CardHeader>
            <CardContent>
              {profile?.markets?.length ? <div className="grid gap-3">{profile.markets.map((market) => {
                const item = marketCopy[market.toLowerCase() as keyof typeof marketCopy];
                if (!item) return null;
                return <div key={market} className="border border-border bg-background p-4"><h3 className="font-semibold text-primary">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p><Link className="mt-3 inline-block text-sm font-semibold text-primary hover:underline" to={item.href}>Bekijk marktprofiel</Link></div>;
              })}</div> : <p className="text-muted-foreground">Geen markten opgeslagen. Doe de oriëntatie om te zien welke markt past.</p>}
            </CardContent>
          </Card>

          <Card className="rounded-sm lg:col-span-2">
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <Button asChild><a href={PLAN_GESPREK_URL} target="_blank" rel="noreferrer"><PhoneCall /> Plan een gesprek</a></Button>
              <Button asChild variant="outline"><a href="https://wa.me/31853035281" target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>
              <Button asChild variant="outline"><a href="mailto:info@viavastgoed.com"><Mail /> E-mail</a></Button>
            </CardContent>
          </Card>

          {isClient && <Card className="rounded-sm lg:col-span-2"><CardHeader><CardTitle>Mijn traject</CardTitle></CardHeader><CardContent>{profile?.traject_stage ? <><h3 className="mb-6 text-lg font-semibold text-primary">Waar sta je nu?</h3><div className="grid grid-cols-4 gap-2">{trajectSteps.map((label, index) => { const step = index + 1; const active = profile.traject_stage === step; const done = profile.traject_stage! > step; return <div key={label} className="relative text-center"><div className={cn("mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold", active && "border-primary bg-primary text-primary-foreground ring-4 ring-ring", done && "border-accent bg-accent text-accent-foreground", !active && !done && "border-border bg-background text-muted-foreground")}>{step}</div><p className="mt-3 text-xs font-medium text-primary sm:text-sm">{label}</p></div>; })}</div></> : <p className="text-muted-foreground">Je traject wordt nog opgezet door VIA.</p>}</CardContent></Card>}

          {isClient && <Card className="rounded-sm"><CardHeader><CardTitle>Volgende actie</CardTitle></CardHeader><CardContent>{profile?.next_action || profile?.next_action_date ? <div className="space-y-2"><p className="text-primary">{profile.next_action}</p><p className="text-sm text-muted-foreground">{formatDate(profile.next_action_date)}</p></div> : <p className="text-muted-foreground">Nog geen actie gepland.</p>}</CardContent></Card>}

          {isClient && <Card className="rounded-sm"><CardHeader><CardTitle>Documenten</CardTitle></CardHeader><CardContent>{documentsQuery.data?.length ? <Table><TableHeader><TableRow><TableHead>Bestand</TableHead><TableHead>Datum</TableHead><TableHead /></TableRow></TableHeader><TableBody>{documentsQuery.data.map((document) => <TableRow key={document.id}><TableCell>{document.filename}</TableCell><TableCell>{formatDate(document.uploaded_at)}</TableCell><TableCell><Button size="sm" variant="outline" onClick={() => downloadDocument(document.file_path)}><Download /> Download</Button></TableCell></TableRow>)}</TableBody></Table> : <p className="text-muted-foreground">Er zijn nog geen documenten gedeeld.</p>}</CardContent></Card>}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;