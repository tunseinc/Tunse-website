import { motion } from "motion/react";

const Hero = () => {
    return (
        <section className="container mx-auto text-center py-10 space-y-5 p-3">
            <motion.h1
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, duration: 1.5, damping: 25, }}
                className="text-[#393A10] font-bold text-3xl md:text-5xl">Book trusted Artisans <br /> & Vendors On-Demand</motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 25, delay: 1.6, duration: 1.5 }}
                className="w-full md:w-1/3 mx-auto text-center text-gray-500">
                Tunse connects you with verified artisans and vendors for reliable home and lifestyle services across Nigeria.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 25, delay: 1.7, duration: 1.5 }}
                className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <a
                    href="https://play.google.com/store/apps/details?id=tunse.tech" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full border-transparent cursor-pointer text-white bg-[#98BC77] hover:bg-[#82aa5c] duration-300 flex items-center gap-2 min-w-[180px] justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    Play Store
                </a>
                <a 
                    href="https://apps.apple.com/za/app/tunse-mobile/id6744867626" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full border-transparent cursor-pointer text-white bg-[#98BC77] hover:bg-[#82aa5c] duration-300 flex items-center gap-2 min-w-[180px] justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                    App Store
                </a>
            </motion.div>
            <div className="container relative mx-auto flex flex-col items-center justify-center mt-5" style={{ backgroundImage: "url('./assets/images/circle-line.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
                <motion.img
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 25, duration: 1.7, delay: 1.9 }}
                    src="./assets/images/tunse-app.png" alt="tunse-app" className="mt-20 pointer-events-none " />
            </div>
        </section>
    )
}

export default Hero