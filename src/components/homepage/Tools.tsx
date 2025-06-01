import { motion } from "motion/react";


const Tools = () => {
    return (
        <section className="bg-[#393A10] w-full py-10">
            <div className="container mx-auto text-center flex flex-col w-full lg:w-6xl gap-5 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, stiffness: 100, type: "spring", damping: 25 }}
                        viewport={{ amount: 0.2 }}
                        className="flex flex-col gap-5 gap-x-10 items-center lg:items-start justify-center w-full">
                        <h1 className="text-white w-full lg:w-[80%] font-bold text-3xl lg:text-5xl lg:text-left">Reliable service <br /> you can count on. </h1>
                        <p className="w-full text-white/50 lg:w-[80%] lg:text-left">
                            Find verified artisans, track your bookings in real time, and pay securely — all in one place.
                        </p>
                        <motion.button
                            whileTap={{ scale: 0.7 }}
                            className="px-5 py-2 rounded-full border-transparent cursor-pointer text-white bg-[#98BC77] hover:bg-[#82aa5c] duration-300">
                            Download the app
                        </motion.button>
                    </motion.div>
                    <motion.img
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, stiffness: 100, type: "spring", damping: 25 }}
                        viewport={{ amount: 0.2 }}
                        src="./assets/images/worker.png" alt="worker" />
                </div>
            </div>
        </section>
    )
}

export default Tools