
const InfoSection = () => {
    return (
        <>
            <div className="container mx-auto w-full lg:w-6xl p-5 py-20 grid grid-cols-1 md:grid-cols-2 gap-y-10">
                <div className="w-full flex flex-col items-center gap-1 lg:max-w-[70%] h-full place-self-center">
                    <img src="/assets/images/job-grouping.png" alt="job-grouping" className="size-44 pointer-events-none" />
                    <h2 className="text-4xl text-[#393A10] text-center font-bold mt-6">A Better Way to <br /> Work and Hire</h2>
                </div>
                <div className="h-full flex flex-col gap-2.5">
                    <p className="text-gray-500">Tunse was created with a clear mission: to make it easy and safe for anyone to find skilled, trustworthy artisans and reliable vendors—on-demand, anytime, anywhere.</p>
                    <p className="text-gray-500">We saw the challenges in the informal service sector: skilled professionals struggling to find consistent work, and customers unsure who to trust for essential services.</p>
                    <p className="text-gray-500">So we built Tunse—a smart, secure, and human-first platform that goes beyond connection. We bring structure to the unstructured, dignity to labor, and trust to every transaction.</p>
                    <p className="text-gray-500">Whether you need a plumber, tailor, cleaner, or carpenter, Tunse helps you book vetted professionals, get materials fast, and pay securely—all in one app.</p>
                    <p className="text-gray-500">At the heart of what we do are our core values. We call them <span className="font-semibold text-[#393A10]">R.I.D.E.</span>, and they power every experience on the platform.</p>
                </div>
            </div>
        </>
    )
}

export default InfoSection