
const HowItWorks = () => {
    return (
        <section className="container mx-auto text-center my-20 flex flex-col w-full lg:w-6xl gap-5 p-5">
            <h1 className="text-[#393A10] font-bold text-3xl md:text-5xl text-left">How it Works</h1>
            <p className="w-full md:w-1/3 text-left text-gray-500">
                Find verified artisans, track your bookings in real time, and pay securely — all in one place.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20 w-full mt-10">
                <article className="flex flex-col w-full gap-3 text-left md:w-[260px]">
                    <div className="h-[285px]">
                        <img src="./assets/images/wk-1.png" alt="wk-1" className="h-full w-full object-cover pointer-events-none" />
                    </div>
                    <div className="flex flex-col gap-2 py-2 mt-3 w-full">
                        <h3 className="text-[#393A10] font-semibold">Browse</h3>
                        <p className=" text-gray-500  w-full">Explore 20+ service categories - all in one place.</p>
                    </div>
                </article>
                <article className="flex flex-col w-full gap-3 text-left md:w-[260px]">
                    <div className="h-[285px]">
                        <img src="./assets/images/wk-1.png" alt="wk-1" className="h-full w-full object-cover pointer-events-none" />
                    </div>
                    <div className="flex flex-col gap-2 py-2 mt-3 w-full">
                        <h3 className="text-[#393A10] font-semibold">Book</h3>
                        <p className=" text-gray-500  w-full">Choose a trusted artisan or vendor near you.</p>
                    </div>
                </article>
                <article className="flex flex-col w-full gap-3 text-left md:w-[260px]">
                    <div className="h-[285px]">
                        <img src="./assets/images/wk-1.png" alt="wk-1" className="h-full w-full object-cover pointer-events-none" />
                    </div>
                    <div className="flex flex-col gap-2 py-2 mt-3 w-full">
                        <h3 className="text-[#393A10] font-semibold">Pay</h3>
                        <p className=" text-gray-500  w-full">Make secure in-app payments after the job is done to your satisfaction.</p>
                    </div>
                </article>
                <article className="flex flex-col w-full gap-3 text-left md:w-[260px]">
                    <div className="h-[285px]">
                        <img src="./assets/images/wk-1.png" alt="wk-1" className="h-full w-full object-cover pointer-events-none" />
                    </div>
                    <div className="flex flex-col gap-2 py-2 mt-3 w-full">
                        <h3 className="text-[#393A10] font-semibold">Review</h3>
                        <p className=" text-gray-500  w-full">Share feedback and earn loyalty rewards.</p>
                    </div>
                </article>

            </div>
        </section>
    )
}

export default HowItWorks