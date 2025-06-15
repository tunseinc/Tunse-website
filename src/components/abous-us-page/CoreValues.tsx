
const CoreValues = () => {
    return (
        <div className="w-full bg-[#393A10] flex flex-col items-center justify-center gap-5 py-20">
            <h2 className="font-bold text-3xl lg:text-4xl text-white text-center">Our Core Values</h2>
            <p className="text-sm text-white/60 text-center w-[95%] md:max-w-[50%] lg:max-w-[22%] tracking-wide text">At the heart of what we do are our core values. We call them R.I.D.E., and they power every experience on the platform</p>

            <div className="container mx-auto w-full lg:w-6xl p-5 lg:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <div className="flex flex-col gap-2 bg-white/10 rounded-md p-5">
                    <h4 className="font-bold text-white">Reliability</h4>
                    <div className="mb-6">
                        <img src="./assets/images/shield.png" alt="shield" className="pointer-events-none" />
                    </div>
                    <p className="text-sm text-white/60">You can trust us to always deliver. Whether you're booking a service or sourcing materials, we make sure it gets done—consistently and professionally.</p>
                </div>
                <div className="flex flex-col gap-2 bg-white/10 rounded-md p-5">
                    <h4 className="font-bold text-white">Integrity</h4>
                    <div className="mb-6">
                        <img src="./assets/images/handshake.png" alt="handshake" className="pointer-events-none" />
                    </div>
                    <p className="text-sm text-white/60">Our word is our bond. If we say we'll deliver, we will—no matter what. Integrity drives every job accepted and every promise kept.</p>
                </div>
                <div className="flex flex-col gap-2 bg-white/10 rounded-md p-5">
                    <h4 className="font-bold text-white">Dignity</h4>
                    <div className="mb-6">
                        <img src="./assets/images/dignity.png" alt="dignity" className="pointer-events-none" />
                    </div>
                    <p className="text-sm text-white/60">Everyone deserves to be respected and valued. At Tunse, we treat every artisan, vendor, and customer like royalty—because you are.</p>
                </div>
                <div className="flex flex-col gap-2 bg-white/10 rounded-md p-5">
                    <h4 className="font-bold text-white">Efficiency</h4>
                    <div className="mb-6">
                        <img src="./assets/images/energy.png" alt="energy" className="pointer-events-none" />
                    </div>
                    <p className="text-sm text-white/60">Time is precious, and we respect yours. Tunse is built for speed, seamless coordination, and timely service delivery from booking to completion.</p>
                </div>
            </div>
        </div>
    )
}

export default CoreValues