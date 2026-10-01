import { Navigate, Route, Routes } from "react-router"
import AdminPortalLayout from "../../layouts/challenge/AdminPortalLayout"
import ChallengeLandingLayout from "../../layouts/challenge/ChallengeLandingLayout"
import StudentPortalLayout from "../../layouts/challenge/StudentPortalLayout"
import { AntdProvider } from "../../theme/AntdProvider"
import ProtectedRoute from "../../routes/ProtectedRoute"
import RoleGuard from "../../routes/RoleGuard"
import ChallengeLoginPage from "./auth/ChallengeLoginPage"
import ChallengeRegisterPage from "./auth/ChallengeRegisterPage"
import ChallengeLandingPage from "./landing/ChallengeLandingPage"
import InstitutionOverviewPage from "./institution/InstitutionOverviewPage"
import AdminAuditQueuePage from "./admin/AdminAuditQueuePage"
import AdminClaimDetailPage from "./admin/AdminClaimDetailPage"
import AdminClaimsQueuePage from "./admin/AdminClaimsQueuePage"
import AdminDashboardPage from "./admin/AdminDashboardPage"
import AdminDisqualificationsPage from "./admin/AdminDisqualificationsPage"
import AdminExportsPage from "./admin/AdminExportsPage"
import AdminInstitutionsPage from "./admin/AdminInstitutionsPage"
import AdminLeaderboardControlPage from "./admin/AdminLeaderboardControlPage"
import AdminPhasesPage from "./admin/AdminPhasesPage"
import ClaimDetailPage from "./student/ClaimDetailPage"
import EditClaimPage from "./student/EditClaimPage"
import ContinuousTrackSubmitPage from "./student/ContinuousTrackSubmitPage"
import IndividualLeaderboardPage from "./student/IndividualLeaderboardPage"
import InstitutionLeaderboardPage from "./student/InstitutionLeaderboardPage"
import MyClaimsPage from "./student/MyClaimsPage"
import RulesFaqPage from "./student/RulesFaqPage"
import StudentDashboardPage from "./student/StudentDashboardPage"
import SubmitClaimPage from "./student/SubmitClaimPage"

export default function ChallengeRoutes() {
    return (
        <AntdProvider>
            <Routes>
                <Route element={<ChallengeLandingLayout />}>
                    <Route index element={<ChallengeLandingPage />} />
                    <Route path="register" element={<ChallengeRegisterPage />} />
                    <Route path="login" element={<ChallengeLoginPage />} />
                    <Route path="rules" element={<RulesFaqPage />} />
                </Route>

                <Route
                    path="student"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allow={["student"]}>
                                <StudentPortalLayout />
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<StudentDashboardPage />} />
                    <Route path="claims/new" element={<SubmitClaimPage />} />
                    <Route path="claims" element={<MyClaimsPage />} />
                    <Route path="claims/:claimId" element={<ClaimDetailPage />} />
                    <Route path="claims/:claimId/edit" element={<EditClaimPage />} />
                    <Route path="community/new" element={<ContinuousTrackSubmitPage />} />
                    <Route path="leaderboard/individual" element={<IndividualLeaderboardPage />} />
                    <Route path="leaderboard/institution" element={<InstitutionLeaderboardPage />} />
                    <Route path="rules" element={<RulesFaqPage />} />
                </Route>

                <Route path="institution" element={<StudentPortalLayout variant="institution" />}>
                    <Route index element={<InstitutionOverviewPage />} />
                </Route>

                <Route
                    path="admin"
                    element={
                        <ProtectedRoute>
                            <RoleGuard allow={["admin", "auditor", "super_admin"]}>
                                <AdminPortalLayout />
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="claims" element={<AdminClaimsQueuePage />} />
                    <Route path="claims/:claimId" element={<AdminClaimDetailPage />} />
                    <Route path="audit-queue" element={<AdminAuditQueuePage />} />
                    <Route path="phases" element={<AdminPhasesPage />} />
                    <Route path="institutions" element={<AdminInstitutionsPage />} />
                    <Route path="disqualifications" element={<AdminDisqualificationsPage />} />
                    <Route path="leaderboards" element={<AdminLeaderboardControlPage />} />
                    <Route path="exports" element={<AdminExportsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/challenge" replace />} />
            </Routes>
        </AntdProvider>
    )
}
