import { MenuOutlined } from "@ant-design/icons"
import { Avatar, Button, Drawer, Dropdown, Grid, Layout } from "antd"
import { useState } from "react"
import { Outlet } from "react-router"
import { ChallengeLogo } from "../../components/challenge/shared/ChallengeLogo"
import { PhaseBadge } from "../../components/challenge/shared/PhaseBadge"
import { StudentSidebarMenu } from "../../components/challenge/student/StudentSidebarMenu"
import { useActivePhase } from "../../features/challenge/phases/usePhases"
import { useLogout } from "../../features/challenge/auth/useAuth"
import { useIdleLogout } from "../../features/challenge/auth/useIdleLogout"
import { useAuthStore } from "../../stores/authStore"

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid

interface StudentPortalLayoutProps {
    variant?: "student" | "institution"
}

export default function StudentPortalLayout({ variant = "student" }: StudentPortalLayoutProps) {
    const screens = useBreakpoint()
    const isDesktop = screens.md
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { data: phase } = useActivePhase()
    const user = useAuthStore((s) => s.user)
    const logoutMutation = useLogout()
    useIdleLogout()

    const menu = <StudentSidebarMenu variant={variant} onNavigate={() => setDrawerOpen(false)} />

    return (
        <Layout className="min-h-screen">
            {isDesktop && (
                <Sider width={248} theme="dark" className="!bg-[#232332]">
                    <div className="h-16 flex items-center px-4">
                        <ChallengeLogo variant="dark" />
                    </div>
                    {menu}
                </Sider>
            )}
            <Layout>
                <Header className="!bg-white shadow-sm px-4 flex items-center justify-between h-16 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        {!isDesktop && (
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setDrawerOpen(true)}
                                aria-label="Open menu"
                            />
                        )}
                        {!isDesktop && <ChallengeLogo variant="light" />}
                        {phase && <PhaseBadge status={phase.status} />}
                    </div>
                    <Dropdown
                        menu={{
                            items: [
                                { key: "id", label: `Challenge ID: ${user?.student_profile?.challenge_id ?? "—"}`, disabled: true },
                                { key: "logout", label: "Log out", onClick: () => logoutMutation.mutate() },
                            ],
                        }}
                    >
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar style={{ backgroundColor: "#98BC77" }}>{user?.name.charAt(0)}</Avatar>
                            <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                        </div>
                    </Dropdown>
                </Header>
                <Content className="p-4 md:p-6 bg-[#F7F9F4]">
                    <Outlet />
                </Content>
            </Layout>
            <Drawer
                placement="left"
                open={!isDesktop && drawerOpen}
                onClose={() => setDrawerOpen(false)}
                closable={false}
                width={248}
                styles={{ body: { padding: 0, background: "#232332" } }}
            >
                <div className="h-16 flex items-center px-4">
                    <ChallengeLogo variant="dark" />
                </div>
                {menu}
            </Drawer>
        </Layout>
    )
}
