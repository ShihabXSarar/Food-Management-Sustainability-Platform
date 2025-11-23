export class DashboardStatsDto {
  profile: any;
  inventorySummary: {
    totalItems: number;
    expiringSoon: number;
  };
  recentLogs: any[];
  recommendedResources: {
    title: string;
    category: string;
    reason: string;
  }[];
}
