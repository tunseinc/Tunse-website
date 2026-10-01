import {
    DashboardOutlined,
    FileAddOutlined,
    FileTextOutlined,
    NotificationOutlined,
    QuestionCircleOutlined,
    TeamOutlined,
    TrophyOutlined,
} from "@ant-design/icons"
import { Menu } from "antd"
import { useLocation, useNavigate } from "react-router"

interface StudentSidebarMenuProps {
    variant?: "student" | "institution"
    onNavigate?: () => void
}

const studentItems = [
    { key: "/challenge/student/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/challenge/student/claims/new", icon: <FileAddOutlined />, label: "Submit a Claim" },
    { key: "/challenge/student/claims", icon: <FileTextOutlined />, label: "My Claims" },
    { key: "/challenge/student/community/new", icon: <NotificationOutlined />, label: "Community & Media" },
    { key: "/challenge/student/leaderboard/individual", icon: <TrophyOutlined />, label: "Individual Leaderboard" },
    { key: "/challenge/student/leaderboard/institution", icon: <TeamOutlined />, label: "Institution Leaderboard" },
    { key: "/challenge/student/rules", icon: <QuestionCircleOutlined />, label: "Rules & FAQ" },
]

const institutionItems = [
    { key: "/challenge/institution", icon: <DashboardOutlined />, label: "Institution Overview" },
]

export function StudentSidebarMenu({ variant = "student", onNavigate }: StudentSidebarMenuProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const items = variant === "institution" ? institutionItems : studentItems

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
