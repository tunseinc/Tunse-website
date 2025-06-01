import { motion } from "motion/react";

const testimonials = [
    {
        img: "./assets/images/user.jpg",
        alt: "user",
        text: 'My plumber arrived in 20 minutes and fixed everything perfectly. Tunse is a lifesaver!',
        name: "Kemi, Lagos",
    },
    {
        img: "./assets/images/user.jpg",
        alt: "user",
        text: 'My plumber arrived in 20 minutes and fixed everything perfectly. Tunse is a lifesaver!',
        name: "Kemi, Lagos",
    },
    {
        img: "./assets/images/user.jpg",
        alt: "user",
        text: 'My plumber arrived in 20 minutes and fixed everything perfectly. Tunse is a lifesaver!',
        name: "Kemi, Lagos",
    },
];


const WhatUsersSay = () => {
    return (
        <section className="container mx-auto text-center py-10 flex flex-col w-full lg:w-6xl gap-5 p-5">
            <h1 className="text-[#393A10] font-bold text-3xl md:text-5xl">What Users Are Saying</h1>
            <p className="w-full md:w-1/3 mx-auto text-center text-gray-500">
                Find verified artisans, track your bookings in real time, and pay securely — all in one place.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-16 w-full mt-10">
                {testimonials.map((item, idx) => (
                    <motion.article
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 25, duration: 0.5, delay: idx * 0.2 }}
                        viewport={{ amount: 0.2 }}
                        key={idx} className="flex flex-col w-full gap-3 text-left rounded-md overflow-hidden">
                        <div className="relative h-[428px]">
                            <img src={item.img} alt={item.alt}
                                className="h-full w-full object-cover pointer-events-auto filter grayscale rounded-md"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white z-10 w-[60%] mx-auto flex flex-col gap-3">
                                <p className="italic text-xs">{item.text}</p>
                                <h4 className="font-semibold text-sm"> - {item.name}</h4>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    )
}

export default WhatUsersSay