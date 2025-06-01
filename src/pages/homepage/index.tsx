import Faq from "../../components/homepage/Faq"
import Features from "../../components/homepage/Features"
import Footer from "../../components/homepage/Footer"
import Hero from "../../components/homepage/Hero"
import HowItWorks from "../../components/homepage/HowItWorks"
import ReliableService from "../../components/homepage/ReliableService"
import Tools from "../../components/homepage/Tools"
import WhatUsersSay from "../../components/homepage/WhatUsersSay"
import Navbar from "../../components/shared/Navbar"

const Homepage = () => {
    return (
        <>
            <Navbar />
            <main className="relative flex flex-col w-full min-h-[calc(100dvh-5rem)] overflow-x-hidden mt-[5rem] py-5">
                <Hero />
                <Features />
                <HowItWorks />
                <ReliableService />
                <WhatUsersSay />
                <Faq />
                <Tools />
                <Footer />
            </main>
        </>
    )
}

export default Homepage