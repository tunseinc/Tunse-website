import { motion } from "motion/react";


const featuresData = [
    {
        img: "./assets/images/verified.png",
        alt: "appointment",
        title: "Verified Artisans and Service providers",
        desc: "Every professional on Tunse is vetted for skill, reliability, and professionalism. Book with confidence.",
    },
    {
        img: "./assets/images/appointment.png",
        alt: "appointment",
        title: "Real-time Booking and Tracking",
        desc: "No more guesswork. Book instantly, track progress live, and stay updated from start to finish — all from your phone.",
    },
    {
        img: "./assets/images/vendor.png",
        alt: "appointment",
        title: "Fast Material Sourcing via Trusted Vendors",
        desc: "Every professional on Tunse is vetted for skill, reliability, and professionalism. Book with confidence.",
    },
    {
        img: "./assets/images/secure.png",
        alt: "appointment",
        title: "Secure In-App Payments",
        desc: "Every professional on Tunse is vetted for skill, reliability, and professionalism. Book with confidence.",
    },
    {
        img: "./assets/images/users.png",
        alt: "appointment",
        title: "Rated & Reviewed by Real Users",
        desc: "No more guesswork. Book instantly, track progress live, and stay updated from start to finish — all from your phone.",
    },
];


const Features = () => {
    return (
        <section className="container mx-auto text-center py-10 flex flex-col w-full lg:w-6xl gap-5 p-5">
            <h1 className="text-[#393A10] font-bold text-3xl md:text-5xl">Trusted Help, <br /> When You Need It</h1>
            <p className="w-full md:w-1/3 mx-auto text-center text-gray-500">
                Find verified artisans, track your bookings in real time, and pay securely — all in one place.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-20 gap-y-16 w-full mt-10">
                {featuresData.map((feature, idx) => (
                    <motion.article
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", damping: 25, stiffness: 100, duration: 0.5, delay: idx * 0.2 }}
                        viewport={{ amount: 0.2 }}
                        key={idx} className="flex flex-col w-full gap-3 text-left">
                        <img src={feature.img} alt={feature.alt} className="size-8 pointer-events-auto" />
                        <h3 className="text-[#393A10] font-semibold">{feature.title}</h3>
                        <p className="text-gray-500 w-full lg:w-[323px]">{feature.desc}</p>
                    </motion.article>
                ))}
            </div>
        </section>
    )
}

export default Features