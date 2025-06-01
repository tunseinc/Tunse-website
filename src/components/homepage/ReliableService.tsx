import { motion } from "motion/react";


const ReliableService = () => {
    return (
        <section className="container mx-auto text-center py-10 flex flex-col w-full lg:w-6xl gap-5 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <motion.img
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, stiffness: 100, type: "spring", damping: 25 }}
                    viewport={{ amount: 0.2 }}
                    src="./assets/images/reliable-service.png" alt="reliable-service" />
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, stiffness: 100, type: "spring", damping: 25 }}
                    viewport={{ amount: 0.2 }}
                    className="flex flex-col gap-5 gap-x-10 items-center lg:items-end justify-center w-full">
                    <h1 className="text-[#393A10] w-full lg:w-[80%] font-bold text-3xl lg:text-5xl lg:text-left">Reliable service <br /> you can count on. </h1>
                    <p className="w-full lg:w-[80%] lg:text-left text-gray-500">
                        Find verified artisans, track your bookings in real time, and pay securely — all in one place.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

export default ReliableService