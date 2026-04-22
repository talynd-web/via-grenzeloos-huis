interface PlaceholderPageProps {
  title: string;
  eyebrow?: string;
}

const PlaceholderPage = ({ title, eyebrow = "VIA Vastgoed" }: PlaceholderPageProps) => {
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
