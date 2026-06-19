import type { UserStatCardProps } from "../components/UserStatCard";
import type { UserStatsProps } from "../components/UserStatsSection";

export function buildStatsCards(stats: UserStatsProps["stats"]): UserStatCardProps[] { 
    return [
        {
            label: "user.statsSection.sessionsPlayed",
            value: stats.sessionsPlayed,
        },
        {
            label: "user.statsSection.score",
            value: `${stats.score}`,
        },
        {
            label: "user.statsSection.avgTuringRate",
            value: stats.avgTuringRate.toFixed(2),
            subtitle: "user.statsSection.turingRateSubtitle",
        },
        {
            label: "user.statsSection.globalRanking",
            value: stats.ranking !== null ? `#${stats.ranking}` : "—",
        },
    ]
}