import { useRef, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "motion/react";

const faqData = [
    {
        question: "What is Tunse?",
        answer: "Neuros is an AI-powered business analytics platform designed to provide real-time insights, predictive analytics, and seamless integrations with various tools. Unlike traditional analytics platforms, Neuros harnesses the power of artificial intelligence to offer more accurate forecasts, customizable dashboards, and a user-friendly interface tailored for businesses of all sizes."
    },
    {
        question: "How do I become a T-worker?",
        answer: "Neuros is an AI-powered business analytics platform designed to provide real-time insights, predictive analytics, and seamless integrations with various tools. Unlike traditional analytics platforms, Neuros harnesses the power of artificial intelligence to offer more accurate forecasts, customizable dashboards, and a user-friendly interface tailored for businesses of all sizes."
    },
    {
        question: "Can I trust the artisans?",
        answer: "Neuros is an AI-powered business analytics platform designed to provide real-time insights, predictive analytics, and seamless integrations with various tools. Unlike traditional analytics platforms, Neuros harnesses the power of artificial intelligence to offer more accurate forecasts, customizable dashboards, and a user-friendly interface tailored for businesses of all sizes."
    },
    {
        question: "How is Pricing determined?",
        answer: "Neuros is an AI-powered business analytics platform designed to provide real-time insights, predictive analytics, and seamless integrations with various tools. Unlike traditional analytics platforms, Neuros harnesses the power of artificial intelligence to offer more accurate forecasts, customizable dashboards, and a user-friendly interface tailored for businesses of all sizes."
    }
];


const Faq = () => {

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };



    return (
        <section className="container mx-auto text-center flex flex-col w-full lg:w-6xl gap-5 p-5 py-20">
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 w-full">
                    <motion.h1
                        initial={{ opacity: 0, y: -100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, stiffness: 100, type: "spring", damping: 25 }}
                        viewport={{ amount: 0.2 }}
                        className="text-[#393A10] font-bold text-3xl text-left">Frequently asked Questions</motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, stiffness: 100, type: "spring", damping: 25 }}
                        viewport={{ amount: 0.2 }}
                        className="w-full text-gray-500 text-left">
                        We've gathered answers to the questions you're most likely to ask, so you can use Tunse with ease.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, stiffness: 100, type: "spring", damping: 25 }}
                    viewport={{ amount: 0.2 }}
                    className="col-span-12 lg:col-span-8">
                    <div className="w-full flex flex-col gap-3">
                        {faqData.map((item, idx) => (
                            <div key={idx} className="border-b border-gray-200 overflow-hidden">
                                <button
                                    className="relative w-full cursor-pointer text-left px-4 py-3 font-semibold flex justify-between items-center"
                                    onClick={() => toggleAccordion(idx)}
                                >
                                    <div className="w-[3px] h-[15px] rounded-full bg-[#98BC77] absolute top-1/2 left-0 -translate-y-1/2" />
                                    <span>{item.question}</span>
                                    <span className="ml-2">
                                        {openIndex === idx ? <FiChevronUp size={22} className="text-gray-500" /> : <FiChevronDown size={22} className="text-gray-500" />}
                                    </span>
                                </button>
                                <div
                                    ref={el => { contentRefs.current[idx] = el; }}
                                    className="transition-all duration-300 ease-in-out px-4 text-gray-600"
                                    style={{
                                        maxHeight:
                                            openIndex === idx
                                                ? contentRefs.current[idx]?.scrollHeight + "px"
                                                : "0px",
                                        opacity: openIndex === idx ? 1 : 0,
                                        paddingBottom: openIndex === idx ? "12px" : "0px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div aria-hidden={openIndex !== idx} className="w-full text-gray-500 text-sm text-left py-2">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Faq