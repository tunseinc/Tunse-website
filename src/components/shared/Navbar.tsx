import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"
import { Link } from "react-router";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [menuHeight, setMenuHeight] = useState(0);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => setIsOpen((prevState) => !prevState);

    useLayoutEffect(() => {
        if (isOpen && menuRef.current) {
            setMenuHeight(menuRef.current.scrollHeight);
        } else {
            setMenuHeight(0)
        }
    }, [isOpen])

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header className="fixed top-0 left-0  right-0 w-full z-50 transition-all duration-300 bg-white">
            <div className="container w-full lg:w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 24, delay: 0.3, duration: 1.2 }}
                    className="">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer">
                        <Link to={"/"} className="w-fit">
                            <img src="./assets/images/TUNSE.png" alt="tunse" />
                        </Link>
                    </div>
                </motion.div>
                {/* Desktop */}
                <nav className="lg:flex hidden space-x-8 text-[#7884A5]">
                    {["About", "Features", "How it Works", "Case Studies"].map((item, index) => (
                        <motion.a
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.7 + index * 0.2 }}
                            href="#" key={item} className="relative hover:text-[#393A10] dark:hover:text-[#393A10] font-medium transition-colors duration-300 group">
                            {item}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#393A10] group-hover:w-full transition-all duration-300"></span>
                        </motion.a>
                    ))}
                </nav>

                <div className="md:flex hidden items-center space-x-4">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.3, duration: 0.8 }}
                        className="px-5 py-2 rounded-full border border-[#98BC77] cursor-pointer text-[#98BC77]">
                        Get a demo
                    </motion.button>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.3, duration: 0.8 }}
                        className="px-5 py-2 rounded-full border-transparent cursor-pointer text-white bg-[#98BC77] hover:bg-[#82aa5c] duration-300">
                        Get Started Today
                    </motion.button>
                </div>

                {/* Hire me Button */}

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <motion.button
                        whileTap={{ scale: 0.7 }}
                        className="text-gray-500 cursor-pointer size-10 flex items-center justify-center" onClick={toggleMenu}>
                        {isOpen ? <FiX className="size-6" /> : <FiMenu className="size-6" />}
                    </motion.button>
                </div>
            </div>
            {/* Mobile Menu */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? menuHeight : 0 }}
                transition={{ duration: 0.1, type: "spring", stiffness: 100, damping: 20 }}
                className="w-full md:hidden overflow-hidden bg-white dark:bg-gray-900 shadow-lg space-y-5">
                <div ref={menuRef} className="px-4 py-5">
                    <nav
                        className="flex flex-col space-y-3">
                        {["About", "Features", "How it Works", "Case Studies"].map((item, index) => (
                            <motion.a
                                onClick={toggleMenu}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.7 + index * 0.2 }}
                                href="#" key={item} className="text-gray-300 font-medium py-2">
                                {item}
                            </motion.a>
                        ))}
                    </nav>

                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="w-full px-5 py-2 rounded-full border border-[#98BC77] cursor-pointer text-[#98BC77]">
                            Get a demo
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.7 }}
                            className="w-full px-5 py-2 rounded-full border-transparent cursor-pointer text-white bg-[#98BC77] hover:bg-[#82aa5c] duration-300">
                            Get Started Today
                        </motion.button>

                    </div>

                </div>
            </motion.div>

            {/* Contact Form */}
            {/* <AnimatePresence>
                {
                    contactFormOpen ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 30 }}
                                transition={{ type: "spring", damping: 30, stiffness: 200, duration: 0.8 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className="text-2xl font-bold text-gray-300">Get In Touch</h1>
                                    <button onClick={toggleContactForm} className="cursor-pointer hover:bg-gray-900 size-8 flex items-center justify-center duration-300 rounded-full">
                                        <FiX className="size-5 text-gray-300 font-extrabold" />
                                    </button>
                                </div>
                                
                                <form className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                        <input type="text" name="name" id="name" placeholder="You Name" className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-700 " />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                        <input type="email" name="email" id="email" placeholder="You Email" className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-700 " />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                        <textarea name="message" rows={4} id="message" placeholder="You Message" className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-700 "></textarea>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        className="cursor-pointer w-full px-4 py-2 rounded-md bg-gradient-to-r from-violet-600 to-violet-400 hover:from-violet-700 hover:to-purple-700 shadow-md hover:shadow-lg hover:shadow-violet-600/50">
                                        Send Message
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>
                    ) : null
                }
            </AnimatePresence> */}

        </header>
    )
}

export default Navbar