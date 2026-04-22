import { BadgeCheck, FileSignature, Home, Users } from "lucide-react";
import MarketPage from "@/components/markets/MarketPage";

const SpanjePage = () => (
  <MarketPage
    hero={{ title: "Spanje", subtitle: "Marbella, de Costa del Sol en daarbuiten" }}
    intro={{
      title: "Waarom Spanje",
      marketTitle: "Spanje",
      points: [
        { title: "Volwassen markt met diep aanbod", icon: Home },
        { title: "Nederlandse gemeenschap en Nederlandstalige dienstverlening", icon: Users },
        { title: "Sterke verhuurvraag kuststrook het hele jaar", icon: BadgeCheck },
        { title: "Helder koopproces met NIE en notaris", icon: FileSignature },
      ],
      paragraphs: [
        "De Costa del Sol is Spanjes meest ontwikkelde internationale vastgoedmarkt, met Marbella als centrum. De vraag komt uit Noord-Europa, het Verenigd Koninkrijk en steeds vaker uit de Verenigde Staten. Dat maakt de prijsvorming stabieler dan in opkomende markten, maar ook: instapprijzen liggen hoger dan in bijvoorbeeld Alicante of de Costa Blanca.",
        "Voor Nederlandse kopers is Spanje vaak de eerste stap over de grens. De combinatie van klimaat, bereikbaarheid en een uitgebreid Nederlandstalig netwerk maakt het proces overzichtelijker dan verder weg gelegen markten.",
      ],
    }}
    keyFacts={[
      { label: "Instapniveau Marbella", value: "Vanaf circa €350.000" },
      { label: "Instapniveau Costa Blanca", value: "Vanaf circa €180.000" },
      { label: "Huurrendement (bruto)", value: "4-6% toeristisch, 3-5% lang" },
      { label: "Aankoopkosten", value: "Circa 10-12% bovenop koopsom" },
      { label: "IBI", value: "0,4-1,1% jaarlijks" },
      { label: "ITP/BTW", value: "10% bestaande bouw, 10% BTW nieuwbouw" },
    ]}
    process={[
      "NIE-nummer aanvragen (Spaans fiscaal nummer)",
      "Spaanse bankrekening openen",
      "Bod uitbrengen en reserveringsovereenkomst (arras)",
      "Due diligence door lokale advocaat",
      "Notariële akte bij notaris",
      "Inschrijving in kadaster en overdracht nutsvoorzieningen",
    ]}
    boxImpact={[
      "Nederlandse belastingresidenten betalen in Box 3 vermogensrendementsheffing over de waarde van buitenlands vastgoed, minus eventuele financiering. Tegelijk voorkomt het belastingverdrag met Spanje dubbele heffing: huurinkomsten worden in Spanje belast, met verrekening in Nederland.",
      "Voor een appartement van €400.000 zonder financiering betekent dit indicatief €6.000 tot €10.000 Box 3-heffing per jaar, afhankelijk van het peildatumvermogen. De exacte cijfers hangen af van je totale vermogenssituatie.",
    ]}
    pitfalls={[
      "Beschermd monument of grond-status: sommige oudere panden hebben bouwrestricties die niet uit de advertentie blijken",
      "Toeristenverhuur-vergunning: niet elk gebied staat korte verhuur toe, regels veranderen per gemeente",
      "Verhuurkosten onderschat: beheer, schoonmaak, platform-fees en vaste lasten drukken het netto rendement",
      "Afstand tot strand en voorzieningen: ‘10 min van het strand’ kan met de auto zijn, niet lopend",
    ]}
    viaValue={[
      "Voorselectie van ontwikkelaars en bestaande panden",
      "Nederlandstalige introductie bij lokale advocaat",
      "Begeleiding bij due diligence",
      "Koppeling aan verhuurbeheer waar passend",
      "Nazorg bij oplevering en eerste huurperiode",
    ]}
  />
);

export default SpanjePage;
