import {
    AuditOutlined,
    BankOutlined,
    DashboardOutlined,
    DownloadOutlined,
    FlagOutlined,
    ScheduleOutlined,
    SolutionOutlined,
    TrophyOutlined,
} from "@ant-design/icons"
import { Menu } from "antd"
import { useLocation, useNavigate } from "react-router"
import type { StaffRole } from "../../../data/challenge"

interface AdminSidebarMenuProps {
    role: StaffRole
    onNavigate?: () => void
}

interface AdminMenuItem {
    key: string
    icon: React.ReactNode
    label: string
    roles: StaffRole[]
}

const ALL_ITEMS: AdminMenuItem[] = [
    { key: "/challenge/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard", roles: ["admin", "auditor", "super_admin"] },
    { key: "/challenge/admin/claims", icon: <SolutionOutlined />, label: "Claims Queue", roles: ["admin", "super_admin"] },
    { key: "/challenge/admin/audit-queue", icon: <AuditOutlined />, label: "Audit Queue", roles: ["admin", "auditor", "super_admin"] },
    { key: "/challenge/admin/phases", icon: <ScheduleOutlined />, label: "Phases & Scoring", roles: ["admin", "super_admin"] },
    { key: "/challenge/admin/institutions", icon: <BankOutlined />, label: "Institutions", roles: ["admin", "super_admin"] },
    { key: "/challenge/admin/disqualifications", icon: <FlagOutlined />, label: "Disqualifications", roles: ["admin", "super_admin"] },
    { key: "/challenge/admin/leaderboards", icon: <TrophyOutlined />, label: "Leaderboard Control", roles: ["admin", "super_admin"] },
    { key: "/challenge/admin/exports", icon: <DownloadOutlined />, label: "Exports", roles: ["admin", "super_admin"] },
]

export function AdminSidebarMenu({ role, onNavigate }: AdminSidebarMenuProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const items = ALL_ITEMS.filter((item) => item.roles.includes(role)).map(({ key, icon, label }) => ({
        key,
        icon,
        label,
    }))

    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={({ key }) => {
                navigate(key)
                onNavigate?.()
            }}
        />
    )
}

export const ROLE_LABEL: Record<StaffRole, string> = {
    admin: "Challenge Admin",
    auditor: "Auditor",
    super_admin: "Super Admin",
}
