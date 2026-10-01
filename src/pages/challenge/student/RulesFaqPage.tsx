import { Alert, Anchor, Button, Card, Collapse, Grid, Table, Tag } from "antd"
import type { ColumnsType } from "antd/es/table"
import { Link, useLocation } from "react-router"
import { PointsPill } from "../../../components/challenge/shared/PointsPill"
import useDocumentHead from "../../../hooks/use-document-head"
import { useAllClaimTypes } from "../../../features/challenge/claimTypes/useClaimTypes"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import type { ClaimType } from "../../../lib/api/claimTypes"

const { useBreakpoint } = Grid

const PRIZE_ROWS = [
    {
        key: "phase-1",
        phase: "Phase 1 — Build the Tunse Workforce",
        prize: "Top institution: N500,000. Individual leaders: N30,000-N50,000.",
        timing: "End of Phase 1",
    },
    {
        key: "phase-2",
        phase: "Phase 2 — Grow the Tunse Market",
        prize: "Top institution: N500,000. Individual leaders: N30,000-N50,000.",
        timing: "End of Phase 2",
    },
    {
        key: "phase-3",
        phase: "Phase 3 — Put Tunse to Work",
        prize: "Prize to be finalized based on Phase 1-2 learning.",
        timing: "End of Phase 3",
    },
    {
        key: "community",
        phase: "Community & Social Media Engagement Track",
        prize: "N500,000 Creative Impact Prize to the top institution/team.",
        timing: "End of the entire Challenge",
    },
]

const WHATSAPP_ROWS = [
    { role: "Verifiers", community: "Official Verifier community" },
    { role: "T-workers", community: "Official artisan / T-worker community" },
    { role: "Customers", community: "Official Customer community" },
    { role: "Vendors", community: "Official vendor / business community" },
    { role: "Students / coordinators", community: "Official participant / coordinator community" },
]

const ANCHOR_ITEMS = [
    { key: "scoring", href: "#scoring", title: "Scoring" },
    { key: "audit", href: "#audit", title: "Audit & Verification" },
    { key: "fraud", href: "#fraud", title: "Fraud & Disqualification" },
    { key: "privacy", href: "#privacy", title: "Privacy & Consent" },
    { key: "prize", href: "#prize", title: "Prize Framework" },
    { key: "whatsapp", href: "#whatsapp", title: "WhatsApp Communities" },
]

export default function RulesFaqPage() {
    useDocumentHead({ title: "Rules & FAQ — Tunse Challenge" })
    const screens = useBreakpoint()
    const location = useLocation()
    const isPublicView = location.pathname === "/challenge/rules"
    const { data: phases = [] } = usePhases()
    const { data: claimTypes } = useAllClaimTypes()

    const claimTypeColumns: ColumnsType<ClaimType> = [
        { title: "Phase", render: (_, ct) => phases.find((p) => p.id === ct.phase_id)?.name ?? "—" },
        { title: "Claim type", dataIndex: "label" },
        { title: "Points", render: (_, ct) => <PointsPill points={ct.base_points} /> },
        { title: "Validation rule", dataIndex: "validation_rule_text" },
    ]

    return (
        <div className={isPublicView ? "max-w-6xl mx-auto px-4 md:px-8 py-8" : "max-w-6xl mx-auto"}>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-semibold m-0">Rules & FAQ</h1>
                    <p className="text-gray-500 text-sm mt-1 max-w-2xl">
                        Scoring, audit, fraud, privacy and prize rules for the Tunse National Challenge. All
                        scores are provisional until validated by Tunse — see Audit & Verification below.
                    </p>
                </div>
                {isPublicView && (
                    <Link to="/challenge/register">
                        <Button type="primary" shape="round">
                            Join the Challenge
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex gap-8 items-start">
                <div className="flex-1 min-w-0 flex flex-col gap-6">
                    <section id="scoring">
                        <h2 className="text-lg font-semibold mb-2">Scoring</h2>
                        <p className="text-sm text-gray-600 mb-3">
                            Every recruit or activity claim earns points based on its claim type. If a recruit
                            qualifies for more than one role in Phase 1 (e.g. both T-worker and Verifier), only
                            the higher-value role counts — there is no double-counting for the same recruit.
                        </p>
                        <Table
                            rowKey="id"
                            size="small"
                            columns={claimTypeColumns}
                            dataSource={claimTypes}
                            pagination={false}
                            scroll={{ x: true }}
                        />
                        <Collapse
                            className="mt-3"
                            bordered={false}
                            items={[
                                {
                                    key: "double-count",
                                    label: "What if a recruit qualifies as both a T-worker and a Verifier?",
                                    children: (
                                        <p className="text-sm text-gray-600 m-0">
                                            Only the higher-value role's points are awarded — Active Verifier (25
                                            pts) outranks Verified T-worker (10 pts) for the same recruit.
                                        </p>
                                    ),
                                },
                                {
                                    key: "vendor-tbd",
                                    label: "Are Phase 2 Qualified Vendor points finalized?",
                                    children: (
                                        <p className="text-sm text-gray-600 m-0">
                                            No — vendor point values are configurable and will be calibrated
                                            during the Phase 2 pilot. They show as <PointsPill points={null} />{" "}
                                            until finalized.
                                        </p>
                                    ),
                                },
                            ]}
                        />
                    </section>

                    <section id="audit">
                        <h2 className="text-lg font-semibold mb-2">Audit & Verification</h2>
                        <ul className="text-sm text-gray-600 list-disc pl-5 flex flex-col gap-1.5 m-0">
                            <li>
                                All scores are <strong>provisional</strong> — they only become final after Tunse
                                validates the underlying claims.
                            </li>
                            <li>
                                Top-ranked and prize-contending entries receive <strong>priority audits</strong>{" "}
                                ahead of general review.
                            </li>
                            <li>
                                Claims are checked via a <strong>registered phone number lookup</strong> against
                                the Tunse backend to confirm the recruit's status.
                            </li>
                            <li>
                                Prize results are <strong>frozen for a validation window</strong> before any
                                payout is made.
                            </li>
                        </ul>
                    </section>

                    <section id="fraud">
                        <h2 className="text-lg font-semibold mb-2">Fraud & Disqualification</h2>
                        <ul className="text-sm text-gray-600 list-disc pl-5 flex flex-col gap-1.5 m-0">
                            <li>Duplicate, fabricated, or misleading claims may be removed at any time.</li>
                            <li>
                                Evidence of systemic fraud results in <strong>disqualification</strong> from the
                                Challenge, including forfeiture of any provisional score or prize eligibility.
                            </li>
                            <li>
                                Recruit real people only — claims must never involve fabricated identities or
                                stolen credit for someone else's recruitment.
                            </li>
                        </ul>
                    </section>

                    <section id="privacy">
                        <h2 className="text-lg font-semibold mb-2">Privacy & Consent</h2>
                        <ul className="text-sm text-gray-600 list-disc pl-5 flex flex-col gap-1.5 m-0">
                            <li>
                                Sensitive ID documents are <strong>never</strong> collected through the Challenge
                                form.
                            </li>
                            <li>Photo or content uploads require the recruit's explicit consent beforehand.</li>
                            <li>
                                Recruits are only added to a WhatsApp community voluntarily — never
                                automatically.
                            </li>
                        </ul>
                    </section>

                    <section id="prize">
                        <h2 className="text-lg font-semibold mb-2">Prize Framework</h2>
                        <Table
                            rowKey="key"
                            size="small"
                            pagination={false}
                            scroll={{ x: true }}
                            columns={[
                                { title: "Phase", dataIndex: "phase" },
                                { title: "Prize", dataIndex: "prize" },
                                { title: "Payout timing", dataIndex: "timing" },
                            ]}
                            dataSource={PRIZE_ROWS}
                        />
                        <p className="text-xs text-gray-400 mt-2 m-0">
                            The Community & Social Media Engagement Track's Creative Impact Prize is judged by a
                            weighted rubric — see the Community & Media submission screen for the breakdown.
                        </p>
                    </section>

                    <section id="whatsapp">
                        <h2 className="text-lg font-semibold mb-2">WhatsApp Communities</h2>
                        <p className="text-sm text-gray-600 mb-3">
                            Recruits may be invited — voluntarily, with consent, never auto-added — to a
                            role-specific official Tunse WhatsApp community:
                        </p>
                        <div className="flex flex-col gap-2">
                            {WHATSAPP_ROWS.map((row) => (
                                <div key={row.role} className="flex items-center gap-2 text-sm">
                                    <Tag color="green" bordered={false}>
                                        {row.role}
                                    </Tag>
                                    <span className="text-gray-600">&rarr; {row.community}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <Alert
                        type="info"
                        className="bg-[#f1f7f3] border-[#81aa5c]"
                        showIcon
                        styles={{
                            icon: { color: "#668A44" },
                            actions: { color: "#668A44" },
                        }}
                        message="Have a question these rules don't cover?"
                        description="Reach out to your institution coordinator or the Tunse Challenge support line."
                    />
                </div>

                {screens.md && (
                    <div className="w-48 shrink-0">
                        <Card size="small" className="sticky top-20">
                            <Anchor affix={false} items={ANCHOR_ITEMS} />
                        </Card>
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-400 mt-6">
                Rules version {phases[0]?.rules_version ?? "v1.0"} &middot; subject to updates as each phase progresses.
            </p>
        </div>
    )
}
