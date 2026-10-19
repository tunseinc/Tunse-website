import { Button, Layout } from "antd"
import { Link, Outlet, useLocation } from "react-router"
import { ChallengeLogo } from "../../components/challenge/shared/ChallengeLogo"

const { Header, Content, Footer } = Layout

export default function ChallengeLandingLayout() {
    const location = useLocation()
    const isAuthPage = location.pathname.includes("register") || location.pathname.includes("login")

    return (
        <Layout className="min-h-screen !bg-white">
            <Header className="!bg-white shadow-sm !px-4 md:!px-8 flex items-center justify-between gap-2 sticky top-0 z-50 h-16">
                <ChallengeLogo variant="light" />
                {!isAuthPage && (
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link to="/challenge/rules" className="hidden sm:block">
                            <Button type="text">Rules & FAQ</Button>
                        </Link>
                        <Link to="/challenge/login">
                            <Button shape="round">Login</Button>
                        </Link>
                        <Link to="/challenge/register">
                            <Button type="primary" shape="round">
                                <span className="sm:hidden">Join</span>
                                <span className="hidden sm:inline">Join the Challenge</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </Header>
            <Content>
                <Outlet />
            </Content>
            <Footer className="!bg-[#232332] text-center text-[#CFDBFA]">
                Tunse National Challenge — Connect Skills. Create Opportunities. Build Communities.
            </Footer>
        </Layout>
    )
}
