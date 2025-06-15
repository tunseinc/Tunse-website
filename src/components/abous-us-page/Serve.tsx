import { motion } from "motion/react";


const Serve = () => {
    return (
        <div className="w-full bg-[#DEEFCE]">
            <section className="container mx-auto text-center py-10 flex flex-col w-full lg:w-6xl gap-5 p-5 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, stiffness: 100, type: "spring", damping: 25 }}
                        viewport={{ amount: 0.2 }}
                        className="flex flex-col gap-5 gap-x-10 items-center lg:items-end justify-center w-full">
                        <h1 className="text-[#393A10] w-full font-bold text-3xl lg:text-5xl lg:text-left">Made to Serve. <br /> Built to Grow. </h1>
                        <p className="w-full self-start lg:w-[80%] lg:text-left text-gray-500">
                            We're not just a service platform—we're building a movement. One that creates real work opportunities, restores trust in local labor, and celebrates excellence at every level.
                        </p>
                    </motion.div>
                    <motion.img
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, stiffness: 100, type: "spring", damping: 25 }}
                        viewport={{ amount: 0.2 }}
                        src="./assets/images/carpentar-lady.png" alt="carpentar-lady"
                    />
                </div>
            </section>
        </div>
    )
}

export default Serve