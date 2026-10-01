// Risk reasons are computed server-side (App\Services\RiskFlagService) and
// returned as each claim's `risk_reasons` field. This file only keeps the
// display metadata (label/color/description) for rendering those reasons.

export type RiskReason =
    | "top10_national"
    | "top1_institution"
    | "institution_top3"
    | "high_velocity"
    | "duplicate_phone"
    | "manual_flag"

export const RISK_META: Record<RiskReason, { label: string; color: string; description: string }> = {
    top10_national: {
        label: "Top 10 nationally",
        color: "gold",
        description: "Student is currently ranked in the national top 10 for this phase — spec requires 100% audit of claims supporting a winning score.",
    },
    top1_institution: {
        label: "#1 in institution",
        color: "gold",
        description: "Student currently leads their own institution's leaderboard.",
    },
    institution_top3: {
        label: "Institution prize contender",
        color: "purple",
        description: "This institution is currently in a top-3, prize-contending position.",
    },
    high_velocity: {
        label: "High claim velocity",
        color: "volcano",
        description: "This student submitted 3 or more claims within a short window — review for a pattern of fabricated claims.",
    },
    duplicate_phone: {
        label: "Duplicate recruit phone",
        color: "red",
        description: "This recruit phone number was submitted by more than one student — earliest valid claim should hold attribution unless resolved by an admin.",
    },
    manual_flag: {
        label: "Manually flagged",
        color: "magenta",
        description: "An admin or auditor manually flagged this claim for review.",
    },
}
