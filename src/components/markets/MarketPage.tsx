import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_GESPREK_URL } from "@/lib/links";

export type MarketKeyFact = {
  label: string;
  value: string;
};

export type MarketIconPoint = {
  title: string;
  icon: LucideIcon;
};

export type MarketPageProps = {
  hero: {
    title: string;
    subtitle: string;
  };
  intro: {
    title: string;
    points: MarketIconPoint[];
    marketTitle: string;
    paragraphs: string[];
  };
  keyFacts: MarketKeyFact[];
  process: string[];
  boxImpact: string[];
  pitfalls: string[];
  viaValue: string[];
};

const sectionClass = "px-5 py-18 lg:px-8 lg:py-20";

const MarketPage = ({ hero, intro, keyFacts, process, boxImpact, pitfalls, viaValue }: MarketPageProps) => {
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-x-0 bottom-0 h-16 bg-background" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 lg:px-8 lg:pt-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Marktprofiel</p>
          <h1 className="text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">{hero.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/78">{hero.subtitle}</p>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`}>
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-semibold text-primary">Waarom {hero.title}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {intro.points.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="border-l border-border bg-card p-6">
                  <Icon className="h-8 w-8 text-accent" />
                  <h3 className="mt-6 text-xl font-semibold leading-7 text-primary">{point.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="text-4xl font-semibold text-primary">De markt</h2>
          <div className="space-y-6 text-base leading-8 text-muted-foreground">
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`}>
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-semibold text-primary">Kerncijfers</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {keyFacts.map((fact) => (
              <div key={fact.label} className="border border-border bg-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">{fact.label}</p>
                <p className="mt-4 text-lg leading-7 text-primary">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold text-primary">Aankoopproces</h2>
          <div className="mt-10 space-y-5">
            {process.map((step, index) => (
              <div key={step} className="grid gap-4 border-l border-border pb-5 pl-5 sm:grid-cols-[4rem_1fr] sm:pl-0">
                <span className="text-2xl font-semibold text-accent">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-lg leading-7 text-primary">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`}>
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold text-primary">Wat betekent dit in Nederland</h2>
          <div className="mt-8 space-y-6 text-base leading-8 text-muted-foreground">
            {boxImpact.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
            Dit is een indicatie, geen fiscaal advies. Bespreek je situatie met een adviseur.
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-semibold text-primary">Typische valkuilen</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pitfalls.map((pitfall) => (
              <div key={pitfall} className="border border-border bg-card p-6">
                <TriangleAlert className="h-7 w-7 text-accent" />
                <p className="mt-5 leading-7 text-muted-foreground">{pitfall}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionClass} bg-cream`}>
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="text-4xl font-semibold text-primary">Wat VIA regelt</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {viaValue.map((item) => (
              <div key={item} className="flex gap-4 border-b border-border pb-4">
                <Check className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <p className="leading-7 text-primary">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-5 py-16 text-primary-foreground lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <h3 className="max-w-2xl text-3xl font-semibold">Wil je deze markt rustig verkennen?</h3>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href={PLAN_GESPREK_URL} target="_blank" rel="noreferrer">
              Plan een gesprek <ArrowRight />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
};

export default MarketPage;
