import { useRef, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "motion/react";

const faqData = [
    {
        question: "What is Tunse?",
        answer: "Tunse is a smart, on-demand platform that connects you with trusted artisans (T-workers) and verified vendors for home and lifestyle services. From plumbing and tailoring to electrical work and cleaning, Tunse helps you find and book reliable service providers—all through a single mobile app."
    },
    {
        question: "How do I become a T-worker?",
        answer: "To join as a T-worker, download the Tunse app and select “Join as a T-worker.” You’ll need to complete a profile, upload your credentials or skillset details, and provide valid identification. Once you’re verified, you can begin receiving job requests from customers near you."
    },
    {
        question: "Can I trust the artisans?",
        answer: "Yes. All T-workers are verified through a multi-step process that includes ID checks, skill validation, and behavior screening. Additionally, every completed job is rated and reviewed by customers, so you can hire based on real experiences and community feedback."
    },
    {
        question: "How is pricing determined?",
        answer: "Tunse allows T-workers to set custom quotes based on the job request. Customers can then bargain or negotiate directly with the T-worker to agree on a fair price. Once an agreement is reached, payment is made by the customer to Tunse before the service begins—this assures the T-worker of the customer’s commitment.\n\nHowever, Tunse does not release full payment to the T-worker immediately.\n• An initial percentage is paid after job completion.\n• The remaining balance is held during a guarantee period, after which it's released—provided there are no complaints.\n• If a customer raises an issue, the T-worker must revisit and resolve it before final payment is remitted.\n\nThis structure protects both parties and ensures service quality and accountability."
    },
    {
        question: "Can I cancel a booking?",
        answer: "Yes, customers can cancel a job before it starts. However, if a payment has already been made and the T-worker has arrived or committed time/resources, a small cancellation fee may apply. This ensures fairness to service providers. Specific cancellation terms are outlined in our app during the booking process."
    },
    {
        question: "What happens if I’m not satisfied with the service?",
        answer: "If you're not satisfied with the job done, you can report the issue through the app within the guarantee period. The assigned T-worker will be required to revisit and resolve the issue at no extra charge. Tunse holds part of the payment until the job is completed to your satisfaction."
    },
    {
        question: "How are materials sourced?",
        answer: "T-workers can request materials directly from verified vendors listed on the Tunse platform. Customers can also view material quotes and approve purchases before work begins. This integrated process ensures speed, quality, and transparency in sourcing materials for any job."
    },
    {
        question: "When do T-workers receive payment?",
        answer: "T-workers receive an initial percentage of the payment after successfully completing the job. The remaining amount is held by Tunse during the service guarantee period and is released only after the customer confirms satisfaction or the period lapses without complaint."
    },
    {
        question: "How do I become a vendor on Tunse?",
        answer: "If you supply materials like building tools, plumbing parts, or beauty products, you can become a vendor on Tunse. Simply download the app and select “Join as a Vendor.” You’ll be guided through a simple onboarding process to upload your business details, product catalog, and delivery preferences. Once verified, your shop will be available to artisans and customers across your area."
    },
    {
        question: "What is the next-of-kin notification feature for T-workers?",
        answer: "Tunse is committed to the safety and accountability of our artisans (T-workers). Each T-worker is encouraged to register a trusted next of kin. When the T-worker accepts a job, Tunse automatically sends an email to their next of kin with details about the job—such as location, time, and service type—so that someone they trust is always informed about their work movements."
    },
    {
        question: "Is the Tunse app available on all devices?",
        answer: "Yes. The Tunse app is available for download on Android via the Google Play Store. An iOS version will be available soon. We recommend keeping your app updated to access the latest features, security improvements, and service enhancements."
    },
    {
        question: "How do I contact Tunse for help?",
        answer: "If you have any questions, complaints, or need assistance using the app, you can reach out to our customer support team directly through the app or by emailing support@tunse.tech. We aim to respond to all inquiries within 24 hours. You can also visit our Help Center on the website for more guides and tips."
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