import { Outlet } from "react-router"
import Navbar from "../components/shared/Navbar"


const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main className="relative flex flex-col w-full min-h-[calc(100dvh-5rem)] overflow-x-hidden mt-[5rem] py-5">
                <Outlet />
            </main>
        </>
    )
}

export default MainLayout