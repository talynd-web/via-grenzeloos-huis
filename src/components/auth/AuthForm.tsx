import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "register" | "forgot" | "reset";

interface AuthFormProps {
  mode: AuthMode;
}

const copy = {
  login: {
    title: "Inloggen",
    intro: "Log in om straks je voortgang en profiel te beheren.",
    button: "Inloggen",
  },
  register: {
    title: "Account aanmaken",
    intro: "Maak een account aan voor je persoonlijke VIA omgeving.",
    button: "Registreren",
  },
  forgot: {
    title: "Wachtwoord vergeten",
    intro: "Ontvang een veilige link om je wachtwoord opnieuw in te stellen.",
    button: "Resetlink versturen",
  },
  reset: {
    title: "Nieuw wachtwoord",
    intro: "Kies een nieuw wachtwoord voor je account.",
    button: "Wachtwoord opslaan",
  },
};

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Je bent ingelogd." });
        navigate("/dashboard");
      }

      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast({ title: "Registratie ontvangen.", description: "Controleer je e-mail om je account te bevestigen." });
        navigate("/login");
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: "Resetlink verstuurd.", description: "Controleer je inbox voor de vervolgstap." });
      }

      if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast({ title: "Wachtwoord bijgewerkt." });
        navigate("/login");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Probeer het later opnieuw.";
      toast({ title: "Er ging iets mis", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-cream px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-md rounded-sm border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">VIA Vastgoed</p>
          <h1 className="text-3xl font-semibold text-primary">{copy[mode].title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy[mode].intro}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Naam</Label>
              <Input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required />
            </div>
          )}

          {mode !== "reset" && (
            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </div>
          )}

          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Even geduld" : copy[mode].button}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          {mode === "login" && (
            <>
              <Link className="block text-primary hover:underline" to="/wachtwoord-vergeten">Wachtwoord vergeten?</Link>
              <Link className="block text-primary hover:underline" to="/registreer">Nog geen account?</Link>
            </>
          )}
          {mode === "register" && <Link className="text-primary hover:underline" to="/login">Ik heb al een account</Link>}
          {(mode === "forgot" || mode === "reset") && <Link className="text-primary hover:underline" to="/login">Terug naar login</Link>}
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
