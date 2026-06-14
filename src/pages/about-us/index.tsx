import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/homepage/Footer'
import AboutUsHero from '../../components/abous-us-page/AboutUsHero'
import InfoSection from '../../components/abous-us-page/InfoSection'
import CoreValues from '../../components/abous-us-page/CoreValues'
import Faq from '../../components/homepage/Faq'
import Serve from '../../components/abous-us-page/Serve'
import useDocumentHead from '../../hooks/use-document-head'

const AboutUs = () => {
    useDocumentHead({ title: "About Us" });
    return (
        <>
            <Navbar />
            <main className="relative flex flex-col w-full min-h-[calc(100dvh-5rem)] overflow-x-hidden mt-[5rem] py-5">
                <AboutUsHero />
                <InfoSection />
                <CoreValues />
                <Faq />
                <Serve />
                <Footer />
            </main>
        </>
    )
}

export default AboutUs