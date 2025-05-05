import { Link } from "react-router"
import LogoWhite from "../../components/Icons/Logo-white"
import { services } from "./services-data"
import { footer, whyUsData } from "./why-us-data"

const Home = () => {
    return (
        <>
            <section className="relative min-h-dvh flex flex-col w-full">
                <div className="absolute inset-0 bg-[url('/assets/images/header_bg.png')] bg-contain bg-center w-full h-full"> </div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950  via-gray-800 to-gray-700/80 "></div>
                <div className="relative z-10 flex flex-col flex-1 gap-5 p-5 w-full lg:max-w-[95%] mx-auto h-full">
                    <Link to={"/"} className="w-fit"> <LogoWhite /> </Link>
                    <div className="flex-1 h-full flex flex-col gap-10 justify-center">
                        <h2 className="text-white font-semibold text-4xl">Tunse! Get Dignified And <br /> Reliable Experts</h2>
                        <p className="text-white">We are on a mission to create a marketplace that brings together basic <br /> handy service providers and customers in need of their services.</p>
                        <button className="w-fit p-3 rounded-md text-black bg-[#8ebe6e] hover:bg-[#498147] transition-colors duration-300 cursor-pointer px-6">Get Started</button>
                    </div>
                </div>
            </section>
            <section className="bg-[#be6e8e] p-5 py-20">
                <div className="w-full lg:max-w-[95%] mx-auto flex flex-col gap-5">
                    <h2 className="text-white font-semibold text-4xl">Who we are & <br />What we do</h2>
                    <p className="text-white lg:max-w-[70%]">
                        Tunse is a platform that connects Artisans to Clients with ease by leveraging on the power of Digital Technology.
                        We connect clients with those who can get the job done via our platform. Our utmost priority is to make your life easier by linking you up with efficient service providers (T-Workers). We are the "E-Commerce of Labour”.
                    </p>
                    <h4 className="font-semibold text-4xl text-white">Our Services</h4>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-20 py-10">
                        {
                            services.map((service) => (
                                <div key={`service-${service.id}`} title={service.name} className="flex items-center gap-1.5 cursor-pointer hover:scale-105 lg:hover:scale-110 duration-300">
                                    <div className="size-16 p-2 rounded-md flex items-center justify-center" style={{ backgroundColor: service.bgColor, border: service.border }}>
                                        <service.Icon />
                                    </div>
                                    <span className="text-white">{service.name}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="w-full p-5 py-20 pb-5 bg-[#232332]">
                <div className="w-full lg:max-w-[70%] mx-auto">
                    <h2 className="text-white font-semibold text-4xl">{whyUsData.sectionTitle}</h2>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 py-10">
                        {whyUsData.features.map((feature) => (
                            <div key={feature.id} className="flex items-center gap-2">
                                <div className="size-24 p-2 rounded-md flex items-center justify-center">
                                    <feature.Icon />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-white font-medium text-2xl">{feature.title}</h2>
                                    <p className="text-white">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative w-full lg:max-w-[95%] mx-auto bg-[#8ebe6e] rounded-3xl overflow-hidden">
                    <div className="hidden lg:block absolute w-[450px] h-[300px] right-0 bottom-0">
                        <img
                            src="assets/images/call-to-action-bg.png"
                            alt="Background"
                            className="w-full h-full pointer-events-none"
                        />
                    </div>
                    <div className="relative w-fit z-10 flex flex-col gap-6 p-10 py-20">
                        <h2 className="text-white font-medium text-2xl">
                            Get the app now!<br /> You click it! we fix it!
                        </h2>
                        <p className="text-white">
                            It only takes a minute to start benefiting the goodness<br /> of our one click fix solution!
                        </p>
                        <button className="w-fit hover:scale-105 p-3 rounded-md text-[#8ebe6e] bg-[#232332] transition-all duration-300 cursor-pointer px-6">
                            Get Started
                        </button>
                    </div>
                </div>

                <div className=" w-full lg:max-w-[95%] pt-10 mx-auto flex items-center flex-wrap gap-3">
                    <Link to={"/"} title="Tunse">{<footer.logo />}</Link>
                    {footer.links.map((link) => (
                        <a
                            href={link.url}
                            className="text-white"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.text}
                        </a>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Home