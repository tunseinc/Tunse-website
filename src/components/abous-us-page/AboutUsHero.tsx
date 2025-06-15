
const AboutUsHero = () => {
    return (
        <div className="container mx-auto w-full lg:w-6xl p-5 grid grid-cols-1 md:grid-cols-2 py-10">
            <div className="w-full flex flex-col gap-3 lg:max-w-[70%] place-self-center">
                <h4 className="font-semibold text-[#98BC77]">About Us</h4>
                <h2 className="text-4xl text-[#393A10] font-bold">Empowering Work. <br /> Connecting Lives.</h2>
                <p className="text-gray-500">Tunse helps you book vetted professionals, get materials fast, and pay securely—all in one app.</p>
            </div>
            <div className="flex-1 h-full rounded-md overflow-hidden flex justify-end">
                <img src="/assets/images/measurement.png" alt="artisan-taking-measurement" />
            </div>
        </div>
    )
}

export default AboutUsHero