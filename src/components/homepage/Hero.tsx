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
            <motion.button
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 25, delay: 1.7, duration: 1.5 }}
                className="px-5 py-2 rounded-full border-transparent cursor-pointer text-white bg-[#98BC77] hover:bg-[#82aa5c] duration-300">
                Download the app
            </motion.button>
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