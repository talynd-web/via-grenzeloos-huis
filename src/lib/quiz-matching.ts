export type QuizAnswers = {
  budget: string;
  doel: string;
  horizon: string;
  risico: string;
  eigenGebruik: string;
  ervaring: string;
  voorkeursmarkt: string;
};

export type MarketRecommendation = "Spanje" | "Dubai" | "Beide passen";

export type QuizResult = {
  profile: string;
  markets: string[];
  recommendation: MarketRecommendation;
  motivation: string;
};

export const QUIZ_STORAGE_KEY = "via_quiz_data";
export const PENDING_QUIZ_STORAGE_KEY = "via_pending_quiz_data";

export const quizQuestions = [
  {
    id: "budget",
    label: "Budget",
    question: "Welk investeringsbudget heb je ongeveer in gedachten?",
    options: ["< €250k", "€250k – €400k", "€400k – €750k", "> €750k"],
  },
  {
    id: "doel",
    label: "Doel",
    question: "Wat is op dit moment je belangrijkste doel?",
    options: ["Eigen gebruik", "Rendement", "Vermogensopbouw"],
  },
  {
    id: "horizon",
    label: "Horizon",
    question: "Welke beleggingshorizon past het beste bij je?",
    options: ["< 3 jaar", "3 – 7 jaar", "> 7 jaar"],
  },
  {
    id: "risico",
    label: "Risico",
    question: "Hoe kijk je naar risico in deze aankoop?",
    options: ["Laag", "Midden", "Hoog"],
  },
  {
    id: "eigenGebruik",
    label: "Eigen gebruik",
    question: "Welke rol speelt eigen gebruik voor jou?",
    options: ["Primair doel", "Af en toe", "Niet belangrijk"],
  },
  {
    id: "ervaring",
    label: "Ervaring",
    question: "Hoeveel ervaring heb je met vastgoed of investeren in het buitenland?",
    options: ["Eerste aankoop", "Enige ervaring", "Veel ervaring"],
  },
  {
    id: "voorkeursmarkt",
    label: "Voorkeursmarkt",
    question: "Heb je al een duidelijke voorkeursmarkt?",
    options: ["Spanje", "Dubai", "Geen voorkeur"],
  },
] as const;

const getBudgetValue = (budget: string) => {
  if (budget === "< €250k") return 249000;
  if (budget === "€250k – €400k") return 400000;
  if (budget === "€400k – €750k") return 400000;
  if (budget === "> €750k") return 750000;
  return 0;
};

const isLowOrMiddleRisk = (risk: string) => risk === "Laag" || risk === "Midden";

const getProfileTitle = (answers: QuizAnswers, recommendation: MarketRecommendation) => {
  if (answers.doel === "Eigen gebruik" || answers.eigenGebruik === "Primair doel") return "Leefstijlgerichte koper";
  if (recommendation === "Dubai") return "Rendementsgerichte investeerder";
  if (answers.horizon === "> 7 jaar") return "Langetermijnplanner";
  return "Oriënterende investeerder";
};

const getMotivation = (answers: QuizAnswers, recommendation: MarketRecommendation) => {
  if (recommendation === "Spanje") {
    return `Je antwoorden wijzen op een rustige, goed te overzien aankoop waarbij ${answers.doel.toLowerCase()} en ${answers.eigenGebruik.toLowerCase()} belangrijk zijn. Met een horizon van ${answers.horizon} en een risicovoorkeur ${answers.risico.toLowerCase()} past Spanje goed als markt om zorgvuldig verder te verkennen.`;
  }

  if (recommendation === "Dubai") {
    return `Je antwoorden laten zien dat rendement, timing en een hogere risicobereidheid een rol mogen spelen. Met een budget van ${answers.budget} en een horizon van ${answers.horizon} kan Dubai een passende markt zijn om gestructureerd te onderzoeken.`;
  }

  return `Je antwoorden geven nog geen eenduidige richting: ${answers.doel.toLowerCase()}, ${answers.horizon} en risicoprofiel ${answers.risico.toLowerCase()} kunnen in beide markten passen. Spanje en Dubai verdienen daarom allebei een korte, inhoudelijke vergelijking voordat je kiest.`;
};

export const matchQuizProfile = (answers: QuizAnswers): QuizResult => {
  let recommendation: MarketRecommendation = "Beide passen";

  if (answers.voorkeursmarkt === "Spanje") recommendation = "Spanje";
  else if (answers.voorkeursmarkt === "Dubai") recommendation = "Dubai";
  else if (answers.eigenGebruik === "Primair doel" || answers.doel === "Eigen gebruik") recommendation = "Spanje";
  else if (answers.doel === "Rendement" && answers.risico === "Hoog" && getBudgetValue(answers.budget) >= 400000) recommendation = "Dubai";
  else if (answers.horizon === "< 3 jaar" && answers.risico === "Hoog") recommendation = "Dubai";
  else if (answers.horizon === "> 7 jaar" && isLowOrMiddleRisk(answers.risico)) recommendation = "Spanje";

  const markets = recommendation === "Beide passen" ? ["Spanje", "Dubai"] : [recommendation];

  return {
    profile: getProfileTitle(answers, recommendation),
    markets,
    recommendation,
    motivation: getMotivation(answers, recommendation),
  };
};

export const isCompleteQuizAnswers = (value: Partial<QuizAnswers> | null | undefined): value is QuizAnswers => {
  if (!value) return false;
  return quizQuestions.every((question) => Boolean(value[question.id]));
};
