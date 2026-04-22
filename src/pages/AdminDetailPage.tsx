import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, FileUp, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { quizQuestions, type QuizAnswers } from "@/lib/quiz-matching";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type AdminUser = { user_id: string; full_name: string | null; email: string | null; role: "prospect" | "client" | "admin"; created_at: string; has_quiz: boolean };
type AdminProfile = { user_id: string; quiz_data: unknown; traject_stage: number | null; next_action: string | null; next_action_date: string | null } | null;
type DocumentRow = { id: string; filename: string; file_path: string; uploaded_at: string };

const steps = ["Kennismaking & analyse", "Selectie & advies", "Introductie & begeleiding", "Vervolg & ondersteuning"];
const formatDate = (value: string) => new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
const dateToDb = (date?: Date) => date ? format(date, "yyyy-MM-dd") : null;

const getQuizAnswers = (quizData: unknown): QuizAnswers | null => {
  if (!quizData || typeof quizData !== "object" || !("answers" in quizData)) return null;
  return (quizData as { answers?: QuizAnswers }).answers ?? null;
};

const RoleBadge = ({ role }: { role: AdminUser["role"] }) => (
  <Badge className={cn(role === "prospect" && "bg-muted text-muted-foreground hover:bg-muted", role === "client" && "bg-accent text-accent-foreground hover:bg-accent", role === "admin" && "bg-primary text-primary-foreground hover:bg-primary")}>{role}</Badge>
);

const AdminDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [stage, setStage] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [nextDate, setNextDate] = useState<Date | undefined>();
  const [busy, setBusy] = useState(false);

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("get_admin_user_list");
      if (error) throw error;
      return (data ?? []) as AdminUser[];
    },
  });

  const profileQuery = useQuery({
    queryKey: ["admin-profile", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("user_id,quiz_data,traject_stage,next_action,next_action_date").eq("user_id", id!).maybeSingle();
      if (error) throw error;
      return data as AdminProfile;
    },
  });

  const currentUser = useMemo(() => usersQuery.data?.find((item) => item.user_id === id), [id, usersQuery.data]);
  const answers = getQuizAnswers(profileQuery.data?.quiz_data);
  const isClient = currentUser?.role === "client";

  const documentsQuery = useQuery({
    queryKey: ["admin-documents", id],
    enabled: Boolean(id && isClient),
    queryFn: async () => {
      const { data, error } = await supabase.from("documents").select("id,filename,file_path,uploaded_at").eq("client_id", id!).order("uploaded_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DocumentRow[];
    },
  });

  useEffect(() => {
    setStage(profileQuery.data?.traject_stage ? String(profileQuery.data.traject_stage) : "");
    setNextAction(profileQuery.data?.next_action ?? "");
    setNextDate(profileQuery.data?.next_action_date ? new Date(profileQuery.data.next_action_date) : undefined);
  }, [profileQuery.data?.next_action, profileQuery.data?.next_action_date, profileQuery.data?.traject_stage]);

  const refresh = async () => { await Promise.all([usersQuery.refetch(), profileQuery.refetch(), documentsQuery.refetch()]); };

  const updateRole = async (role: "prospect" | "client") => {
    if (!id) return;
    setBusy(true);
    const { error } = await supabase.from("user_roles").update({ role }).eq("user_id", id);
    setBusy(false);
    if (error) return toast({ title: "Rol aanpassen is niet gelukt", description: error.message, variant: "destructive" });
    toast({ title: "Rol bijgewerkt." });
    await refresh();
  };

  const saveTrajectory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ traject_stage: stage ? Number(stage) : null, next_action: nextAction || null, next_action_date: dateToDb(nextDate) }).eq("user_id", id);
    setBusy(false);
    if (error) return toast({ title: "Traject opslaan is niet gelukt", description: error.message, variant: "destructive" });
    toast({ title: "Traject opgeslagen." });
    await profileQuery.refetch();
  };

  const uploadDocument = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !id || !user) return;
    setBusy(true);
    const path = `${id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const upload = await supabase.storage.from("documents").upload(path, file);
    if (upload.error) { setBusy(false); return toast({ title: "Upload is niet gelukt", description: upload.error.message, variant: "destructive" }); }
    const insert = await supabase.from("documents").insert({ client_id: id, filename: file.name, file_path: path, uploaded_by: user.id });
    setBusy(false);
    if (insert.error) return toast({ title: "Document opslaan is niet gelukt", description: insert.error.message, variant: "destructive" });
    event.target.value = "";
    toast({ title: "Document toegevoegd." });
    await documentsQuery.refetch();
  };

  const deleteDocument = async (document: DocumentRow) => {
    setBusy(true);
    const rowDelete = await supabase.from("documents").delete().eq("id", document.id);
    const fileDelete = await supabase.storage.from("documents").remove([document.file_path]);
    setBusy(false);
    if (rowDelete.error || fileDelete.error) return toast({ title: "Verwijderen is niet gelukt", description: rowDelete.error?.message ?? fileDelete.error?.message, variant: "destructive" });
    toast({ title: "Document verwijderd." });
    await documentsQuery.refetch();
  };

  if (!currentUser) return <section className="min-h-[70vh] bg-background px-5 py-16 text-muted-foreground">Account laden</section>;

  return (
    <section className="bg-background px-5 py-12 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <Link className="text-sm font-semibold text-primary hover:underline" to="/admin">Admin &gt; {currentUser.full_name || currentUser.email}</Link>
          <h1 className="mt-4 text-4xl font-semibold text-primary sm:text-5xl">{currentUser.full_name || "Naam onbekend"}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span>{currentUser.email}</span><span>{formatDate(currentUser.created_at)}</span><RoleBadge role={currentUser.role} /></div>
        </header>

        <Card className="rounded-sm"><CardHeader><CardTitle>Rol beheren</CardTitle></CardHeader><CardContent className="space-y-4">{currentUser.role === "prospect" && <Button disabled={busy} onClick={() => updateRole("client")}>Promoot naar klant</Button>}{currentUser.role === "client" && <Button disabled={busy} variant="outline" onClick={() => updateRole("prospect")}>Terug naar prospect</Button>}{currentUser.role === "admin" && <p className="text-muted-foreground">Admin-rol wordt beheerd via Supabase.</p>}</CardContent></Card>

        {isClient && <Card className="rounded-sm"><CardHeader><CardTitle>Traject</CardTitle></CardHeader><CardContent><form onSubmit={saveTrajectory} className="grid gap-5 md:grid-cols-3"><div className="space-y-2"><Label>Fase</Label><Select value={stage} onValueChange={setStage}><SelectTrigger><SelectValue placeholder="Kies fase" /></SelectTrigger><SelectContent>{steps.map((label, index) => <SelectItem key={label} value={String(index + 1)}>{index + 1}. {label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="nextAction">Volgende actie</Label><Input id="nextAction" value={nextAction} onChange={(event) => setNextAction(event.target.value)} /></div><div className="space-y-2"><Label>Datum volgende actie</Label><Popover><PopoverTrigger asChild><Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal", !nextDate && "text-muted-foreground")}><CalendarIcon />{nextDate ? formatDate(nextDate.toISOString()) : "Kies datum"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={nextDate} onSelect={setNextDate} initialFocus /></PopoverContent></Popover></div><div className="md:col-span-3"><Button disabled={busy} type="submit">Opslaan</Button></div></form></CardContent></Card>}

        <Card className="rounded-sm"><CardHeader><CardTitle>Quiz-antwoorden</CardTitle></CardHeader><CardContent>{answers ? <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">{quizQuestions.map((question) => <div key={question.id}><dt className="font-semibold text-primary">{question.label}</dt><dd className="text-muted-foreground">{answers[question.id]}</dd></div>)}</dl> : <p className="text-muted-foreground">Nog geen quiz ingevuld.</p>}</CardContent></Card>

        {isClient && <Card className="rounded-sm"><CardHeader><CardTitle>Documenten</CardTitle></CardHeader><CardContent className="space-y-5"><Label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-background px-5 py-8 text-center text-muted-foreground"><FileUp className="mb-3 h-6 w-6 text-primary" /><span className="font-semibold text-primary">Bestand uploaden</span><span className="mt-1 text-sm">Kies een document om te delen met deze klant.</span><Input type="file" className="sr-only" onChange={uploadDocument} disabled={busy} /></Label>{documentsQuery.data?.length ? <Table><TableHeader><TableRow><TableHead>Bestand</TableHead><TableHead>Datum</TableHead><TableHead /></TableRow></TableHeader><TableBody>{documentsQuery.data.map((document) => <TableRow key={document.id}><TableCell>{document.filename}</TableCell><TableCell>{formatDate(document.uploaded_at)}</TableCell><TableCell><Button size="sm" variant="outline" disabled={busy} onClick={() => deleteDocument(document)}><Trash2 /> Verwijder</Button></TableCell></TableRow>)}</TableBody></Table> : <p className="text-muted-foreground">Er zijn nog geen documenten gedeeld.</p>}</CardContent></Card>}
      </div>
    </section>
  );
};

export default AdminDetailPage;