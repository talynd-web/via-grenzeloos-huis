import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_GESPREK_URL } from "@/lib/links";

interface PlaceholderPageProps {
  title: string;
  eyebrow?: string;
}

const PlaceholderPage = ({ title, eyebrow = "VIA Vastgoed" }: PlaceholderPageProps) => {
  if (title === "Plan gesprek") {
    return (
      <section className="bg-cream px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">Plan een vrijblijvend gesprek</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
            Vul het formulier in, dan nemen we contact met je op voor een passend moment.
          </p>
          <Button asChild size="lg" className="mt-8">
            <a href={PLAN_GESPREK_URL} target="_blank" rel="noreferrer">
              Open formulier <ArrowRight />
            </a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{title}</h1>
      </div>
    </section>
  );
};

export default PlaceholderPage;
