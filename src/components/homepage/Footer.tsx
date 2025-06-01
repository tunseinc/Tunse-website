import { Link } from "react-router"
import { FaInstagram, FaFacebookF, FaXTwitter, FaLinkedinIn } from "react-icons/fa6"
const Footer = () => {
    return (
        <footer className="w-full">
            <div className="container mx-auto text-center py-10 flex flex-col w-full lg:w-6xl gap-5 p-5">
                <Link to={"/"} className="w-fit my-6">
                    <img src="./assets/images/TUNSE.png" alt="tunse" />
                </Link>
                <div className="flex items-center gap-20 md:gap-36">
                    <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-sm text-left text-[#343844]">About Tunse</h4>
                        <ul className="flex flex-col items-start gap-3">
                            <li className="text-[#4B5162]"><Link to={"#"} >Services</Link> </li>
                            <li className="text-[#4B5162]"><Link to={"#"} >FAQ</Link> </li>
                            <li className="text-[#4B5162]"><Link to={"#"} >Contact</Link> </li>
                            <li className="text-[#4B5162]"><Link to={"#"} >Testimonials</Link> </li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-sm text-left text-[#343844]">Connect</h4>
                        <ul className="flex flex-col items-start gap-3">
                            <li className="text-[#4B5162] flex items-center gap-2">
                                <FaInstagram className="text-xl" />
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                            </li>
                            <li className="text-[#4B5162] flex items-center gap-2">
                                <FaFacebookF className="text-xl" />
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                            </li>
                            <li className="text-[#4B5162] flex items-center gap-2">
                                <FaXTwitter className="text-xl" />
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter / X</a>
                            </li>
                            <li className="text-[#4B5162] flex items-center gap-2">
                                <FaLinkedinIn className="text-xl" />
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">Linkedin</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center justify-center flex-wrap md:justify-between mt-10 border-t py-5 border-gray-300">
                    <p className="text-[#626981]">
                        &copy;{new Date().getFullYear()} Tunse · All rights reserved.
                    </p>
                    <ul className="flex items-center gap-5">
                        <li className="text-[#4B5162]"><Link to={"/terms"} >Term of use</Link> </li>
                        <li className="text-[#4B5162]"><Link to={"/privacy-policy"} >Privacy policy</Link> </li>
                        <li className="text-[#4B5162]"><Link to={"/services"} >Security</Link> </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer