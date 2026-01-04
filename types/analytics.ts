export type GlobalAnalytics = {
  generatedAt: string;
  window: "7d" | "30d";

  nations: {
    mostStable: {
      nation: string;
      score: number;
      trend7d: number;
      dangerTowns: number;
    } | null;

    fastestGrowing: {
      nation: string;
      change: number;
    } | null;

    fastestDeclining: {
      nation: string;
      change: number;
    } | null;

    mostAtRisk: {
      nation: string;
      dangerTowns: number;
    } | null;
  };

  towns: {
    biggestGrowth: {
      town: string;
      nation: string;
      change: number;
    } | null;

    biggestLoss: {
      town: string;
      nation: string;
      change: number;
    } | null;

    mostVolatile: {
      town: string;
      score: number;
    } | null;

    closestToBankruptcy: {
      town: string;
      nation: string;
      daysLeft: number;
    } | null;
  };

  meta: {
    totalTowns: number;
    totalNations: number;
    townsInDanger: number;
  };
};
