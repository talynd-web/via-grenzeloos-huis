import { Link } from "react-router-dom";
import { ArrowRight, Building2, Compass, FileCheck2, Handshake, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_GESPREK_URL } from "@/lib/links";

const markets = [
  {
    title: "Spanje",
    description: "Mediterrane oriëntatie met aandacht voor levensstijl, locatie en juridische helderheid.",
    to: "/spanje",
  },
  {
    title: "Dubai",
    description: "Een internationale markt waar timing, regelgeving en begeleiding het verschil maken.",
    to: "/dubai",
  },
];

const steps = [
  { title: "Oriënteren", icon: Compass },
  { title: "Markt kiezen", icon: MapPinned },
  { title: "Dossier opbouwen", icon: FileCheck2 },
  { title: "Begeleid beslissen", icon: Handshake },
];

const Index = () => {
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-background" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-5 pb-28 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-accent">VIA Vastgoed</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">Jouw wens over de grens</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/78">
              VIA begeleidt Nederlandse kopers rustig en zorgvuldig bij de eerste stappen richting vastgoed in Spanje of Dubai.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={PLAN_GESPREK_URL} target="_blank" rel="noreferrer">Plan een vrijblijvend gesprek <ArrowRight /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/quiz">Start oriëntatie</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-[4/5] rounded-sm border border-primary-foreground/15 bg-primary-foreground/8 p-8">
              <div className="flex h-full flex-col justify-between border border-accent/60 p-8">
                <Building2 className="h-12 w-12 text-accent" />
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-accent">Amsterdam · Spanje · Dubai</p>
                  <p className="mt-4 text-3xl font-semibold leading-tight">Premium begeleiding zonder haast.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Wie is VIA</p>
            <h2 className="text-4xl font-semibold text-primary">Een helder startpunt voor vastgoed buiten Nederland.</h2>
          </div>
          <div className="grid gap-6 text-base leading-8 text-muted-foreground sm:grid-cols-2">
            <p>
              VIA Vastgoed helpt kopers om overzicht te krijgen voordat er grote keuzes worden gemaakt. Met een rustige aanpak brengen we wensen, marktcontext en vervolgstappen samen.
            </p>
            <p>
              De begeleiding is persoonlijk en zorgvuldig. Niet gericht op snelle druk, maar op vertrouwen, voorbereiding en passende keuzes over de grens.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Markten</p>
              <h2 className="text-4xl font-semibold text-primary">Kies je richting</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {markets.map((market) => (
              <Link key={market.title} to={market.to} className="group rounded-sm border border-border bg-card p-7 transition-colors hover:border-accent">
                <div className="mb-12 flex items-center justify-between">
                  <h3 className="text-3xl font-semibold text-primary">{market.title}</h3>
                  <ArrowRight className="text-accent transition-transform group-hover:translate-x-1" />
                </div>
                <p className="max-w-md leading-7 text-muted-foreground">{market.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Proces</p>
          <h2 className="mb-10 max-w-2xl text-4xl font-semibold text-primary">In vier rustige stappen naar een scherper beeld.</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="border-l border-border py-3 pl-5">
                  <span className="text-sm font-semibold text-accent">0{index + 1}</span>
                  <Icon className="mt-6 h-8 w-8 text-primary" />
                  <h3 className="mt-5 text-xl font-semibold text-primary">{step.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <h2 className="max-w-2xl text-3xl font-semibold text-primary">Wil je rustig verkennen wat past?</h2>
          <Button asChild size="lg">
            <a href={PLAN_GESPREK_URL} target="_blank" rel="noreferrer">Plan een vrijblijvend gesprek</a>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
