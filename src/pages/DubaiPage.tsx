import { Banknote, Building2, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import MarketPage from "@/components/markets/MarketPage";

const DubaiPage = () => (
  <MarketPage
    hero={{ title: "Dubai", subtitle: "Een internationale vastgoedmarkt met Nederlandse begeleiding" }}
    intro={{
      title: "Waarom Dubai",
      marketTitle: "Dubai",
      points: [
        { title: "Geen inkomstenbelasting op huur en geen vermogenswinstbelasting", icon: Banknote },
        { title: "Groot aanbod off-plan nieuwbouw met gespreide betalingen", icon: Building2 },
        { title: "Sterk toeristisch rendement in centrale wijken", icon: ChartNoAxesCombined },
        { title: "Stabiele valuta (AED gekoppeld aan USD)", icon: ShieldCheck },
      ],
      paragraphs: [
        "Dubai heeft zich in het afgelopen decennium ontwikkeld van uitsluitend off-plan markt naar een volwassen mengeling van nieuwbouw en doorverkoop. Downtown, Dubai Marina, Palm Jumeirah en Business Bay vormen de kerngebieden voor internationaal investeerderskapitaal — elk met eigen karakteristieken in rendement, huurdersprofiel en liquiditeit.",
        "Wat Dubai onderscheidt van Europese markten is de rol van de ontwikkelaar. Grote namen als Emaar, Sobha en Damac zetten jaarlijks nieuwe projecten in de markt met betalingsschema's die tot de oplevering doorlopen. Dat verlaagt de instapdrempel, maar vraagt om goed begrip van het project en de ontwikkelaar.",
      ],
    }}
    keyFacts={[
      { label: "Instapniveau appartement", value: "Vanaf circa €180.000 (studio) tot €400.000 (2-slaapkamer centraal)" },
      { label: "Huurrendement (bruto)", value: "6-9%, afhankelijk van wijk en type" },
      { label: "Dubai Land Department fee", value: "4% eenmalig bij overdracht" },
      { label: "Servicekosten", value: "€15-40 per m² per jaar, afhankelijk van voorzieningen" },
      { label: "Eigendomsvorm", value: "Freehold in aangewezen zones voor buitenlanders" },
      { label: "Betaalschema off-plan", value: "Typisch 20-40% tijdens bouw, rest bij oplevering" },
    ]}
    process={[
      "Oriëntatie en keuze ontwikkelaar/project",
      "Reservering met aanbetaling (meestal 10%)",
      "Sales and Purchase Agreement (SPA) ondertekenen",
      "Betalingen volgens schema tijdens bouwfase",
      "No Objection Certificate (NOC) bij oplevering",
      "Titel-registratie bij Dubai Land Department",
    ]}
    boxImpact={[
      "Dubai kent zelf geen inkomstenbelasting op huur. Voor Nederlandse belastingresidenten is dat echter niet het volledige plaatje: Nederland heft via Box 3 vermogensrendementsheffing over het wereldwijde vermogen, en Dubai valt niet onder een dubbelbelastingverdrag-structuur die dit voorkomt.",
      "Voor een appartement van €300.000 betekent dit indicatief €4.500 tot €7.500 Box 3-heffing per jaar, afhankelijk van je vermogen. De netto-rendementsberekening moet deze Nederlandse heffing altijd meenemen — dat is een punt waar generieke rendement-brochures vaak overheen stappen.",
    ]}
    pitfalls={[
      "Ontwikkelaar-kwaliteit varieert: tier-1 ontwikkelaars leveren nagenoeg altijd op, kleinere partijen soms met vertraging",
      "Servicekosten kunnen sneller stijgen dan in Europa",
      "Off-plan liquiditeit: doorverkopen vóór oplevering kan, maar tegen fees en soms met restricties",
      "Valuta-blootstelling: AED-USD koppeling gaat al decennia mee maar is geen garantie voor de toekomst",
    ]}
    viaValue={[
      "Selectie uit gecontroleerde ontwikkelaars en projecten",
      "Begeleiding bij SPA-review",
      "Koppeling aan lokale beheerder voor verhuur",
      "Overzicht van betalingsmomenten tijdens de bouwfase",
      "Nazorg bij oplevering en eerste boeking",
    ]}
  />
);

export default DubaiPage;
