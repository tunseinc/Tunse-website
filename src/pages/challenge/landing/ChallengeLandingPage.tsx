import { Button, Card, Col, Collapse, Row, Statistic, Steps, Tabs, Tag } from "antd"
import { motion } from "motion/react"
import { Link } from "react-router"
import { CategoryIcon } from "../../../components/challenge/shared/CategoryIcon"
import { CountdownTimer } from "../../../components/challenge/shared/CountdownTimer"
import { PhaseBadge } from "../../../components/challenge/shared/PhaseBadge"
import { priorityCategories } from "../../../data/challenge"
import useDocumentHead from "../../../hooks/use-document-head"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import { useInstitutions } from "../../../features/challenge/institutions/useInstitutions"

const HOW_IT_WORKS = [
    { title: "Identify a participant", description: "Verifier, T-worker, customer or vendor depending on the active phase." },
    { title: "Participant uses Tunse", description: "The recruit independently downloads/uses Tunse and completes registration or activity." },
    { title: "Submit a Challenge claim", description: "Record the recruitment on the Tunse Challenge website with identifying and supporting information." },
    { title: "Points appear provisionally", description: "The leaderboard updates while entries remain subject to audit." },
    { title: "Tunse validates the entry", description: "Prize-contending claims are checked against the app/backend records." },
]

const FAQ_TEASER = [
    { key: "1", label: "Who can participate?", children: "Eligible tertiary-institution students through approved campus teams and coordinators, each with a unique Challenge ID." },
    { key: "2", label: "How is fraud handled?", children: "All scores are provisional until validated. Duplicate, fabricated or misleading claims may be removed; systematic fraud can lead to disqualification." },
    { key: "3", label: "Do I need to collect ID documents?", children: "No. Sensitive identity documents are never collected through the Challenge claim form." },
]

export default function ChallengeLandingPage() {
    useDocumentHead({ title: "Tunse National Challenge" })

    const { data: phases = [] } = usePhases()
    const { data: institutions = [] } = useInstitutions()
    const phase1 = phases.find((p) => p.number === 1)

    return (
        <div>
            <section className="relative overflow-hidden bg-[#232332] text-white px-4 md:px-8 py-16 md:py-24">
                <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Tag color="success" className="!text-sm !px-3 !py-1">
                            National Student-Led Marketplace Activation Program
                        </Tag>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold leading-tight"
                    >
                        The Tunse National Challenge
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-[#CFDBFA] max-w-2xl"
                    >
                        Connect Skills. Create Opportunities. Build Communities. A phased competition
                        empowering tertiary-institution students to expand trusted skilled-work
                        opportunities across Nigeria.
                    </motion.p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link to="/challenge/register">
                            <Button type="primary" size="large" shape="round">
                                Join the Challenge
                            </Button>
                        </Link>
                        <Link to="/challenge/rules">
                            <Button size="large" shape="round" ghost>
                                Read the Rules
                            </Button>
                        </Link>
                    </div>
                    {phase1 && (
                        <div className="mt-4">
                            <CountdownTimer title="Phase 1 closes in" targetIso={phase1.ends_at} />
                        </div>
                    )}
                </div>
            </section>

            <section className="px-4 md:px-8 py-10 bg-white w-full flex flex-col mx-auto">
                <Row gutter={[24, 24]} justify="center" className="w-full max-w-5xl mx-auto self-center">
                    <Col xs={12} md={6}>
                        <Statistic title="Participating institutions" value={institutions.length} />
                    </Col>
                    <Col xs={12} md={6}>
                        <Statistic title="Priority categories" value={priorityCategories.length} />
                    </Col>
                    <Col xs={12} md={6}>
                        <Statistic title="Challenge phases" value={phases.filter((p) => p.number > 0).length} />
                    </Col>
                    <Col xs={12} md={6}>
                        <Statistic title="Total prize pool" value="N2,000,000+" />
                    </Col>
                </Row>
            </section>

            <section className="px-4 md:px-8 py-14 bg-[#F7F9F4]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#232332] mb-8 text-center">
                        How the Challenge Works
                    </h2>
                    <Steps
                        items={HOW_IT_WORKS.map((s) => ({ title: s.title, description: s.description }))}
                        responsive
                    />
                </div>
            </section>

            <section className="px-4 md:px-8 py-14 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#232332] mb-2 text-center">
                        Three Phases + One Continuous Track
                    </h2>
                    <p className="text-center text-gray-500 mb-8">
                        Each phase resets the leaderboard so every institution gets a fresh chance to win.
                    </p>
                    {phases.length > 0 && (
                        <Tabs
                            defaultActiveKey={String(phases[0].id)}
                            centered
                            items={phases.map((phase) => ({
                                key: String(phase.id),
                                label: phase.number === 0 ? "Community" : `Phase ${phase.number}`,
                                children: (
                                    <Card className="max-w-2xl mx-auto">
                                        <div className="flex items-center justify-between mb-3 gap-3">
                                            <h3 className="text-lg font-semibold m-0">{phase.name}</h3>
                                            <PhaseBadge status={phase.status} />
                                        </div>
                                        <p className="text-gray-600">{phase.prize_text}</p>
                                    </Card>
                                ),
                            }))}
                        />
                    )}
                </div>
            </section>

            <section className="px-4 md:px-8 py-14 bg-[#F7F9F4]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#232332] mb-8 text-center">
                        Priority Service Categories
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                        {priorityCategories.map((cat) => (
                            <div key={cat.id} className="flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform duration-200">
                                <CategoryIcon categoryId={cat.id} size={56} />
                                <span className="text-xs text-gray-600">{cat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 md:px-8 py-14 bg-[#F7F9F4]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#232332] mb-8 text-center">
                        Frequently Asked
                    </h2>
                    <Collapse items={FAQ_TEASER} />
                    <div className="text-center mt-6">
                        <Link to="/challenge/rules">
                            <Button shape="round">View full Rules & FAQ</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-4 md:px-8 py-16 bg-[#98BC77] text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Ready to build your community?
                </h2>
                <p className="text-white/90 max-w-xl mx-auto mb-6">
                    Build trusted skilled-work networks, expand access to services, compete with other
                    institutions and create measurable economic impact — one community at a time.
                </p>
                <Link to="/challenge/register">
                    <Button size="large" shape="round" className="!bg-[#232332] !text-white !border-none">
                        Join the Tunse National Challenge
                    </Button>
                </Link>
            </section>
        </div>
    )
}
