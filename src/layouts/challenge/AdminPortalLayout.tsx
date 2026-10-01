import { LogoutOutlined, MenuOutlined } from "@ant-design/icons"
import { Avatar, Button, Drawer, Grid, Layout, Tooltip } from "antd"
import { useState } from "react"
import { Outlet } from "react-router"
import { AdminSidebarMenu, ROLE_LABEL } from "../../components/challenge/admin/AdminSidebarMenu"
import { ChallengeLogo } from "../../components/challenge/shared/ChallengeLogo"
import type { StaffRole } from "../../data/challenge"
import { useAuthStore } from "../../stores/authStore"
import { useLogout } from "../../features/challenge/auth/useAuth"
import { useIdleLogout } from "../../features/challenge/auth/useIdleLogout"

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid

export default function AdminPortalLayout() {
    const screens = useBreakpoint()
    const isDesktop = screens.md
    const [drawerOpen, setDrawerOpen] = useState(false)
    const user = useAuthStore((s) => s.user)
    const logoutMutation = useLogout()
    useIdleLogout()
    const role = (user?.role ?? "admin") as StaffRole

    const menu = <AdminSidebarMenu role={role} onNavigate={() => setDrawerOpen(false)} />

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
                <Header className="!bg-white shadow-sm px-4 flex items-center justify-between h-16 sticky top-0 z-40 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {!isDesktop && (
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setDrawerOpen(true)}
                                aria-label="Open menu"
                            />
                        )}
                        {!isDesktop && <ChallengeLogo variant="light" />}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <Avatar style={{ backgroundColor: "#354B60" }}>{user?.name.charAt(0)}</Avatar>
                            <div className="leading-tight">
                                <div className="text-sm font-medium">{user?.name}</div>
                                <div className="text-xs text-gray-500">{ROLE_LABEL[role]}</div>
                            </div>
                        </div>
                        <Tooltip title="Log out">
                            <Button
                                type="text"
                                icon={<LogoutOutlined />}
                                onClick={() => logoutMutation.mutate()}
                                aria-label="Log out"
                            />
                        </Tooltip>
                    </div>
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
