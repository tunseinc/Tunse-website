import { Link } from "react-router"
const DeleteAccount = () => {
    return (
        <div className="w-full flex flex-col gap-3">
            <div className="border-b border-gray-200">
                <div className="p-5">
                    <Link to={"/"}>
                        <img src="./assets/images/tunse-dark-logo.png" alt="" />
                    </Link>
                </div>
            </div>
            <div className="min-h-dvh flex flex-col gap-3 w-full lg:max-w-[760px]  mx-auto p-5">
                <h2 className="font-bold text-[#0C2740] text-3xl lg:text-[46px]">How to Close Your Tunse Account</h2>
                <p className="text-[#354B60]">Data deletion can only be performed within the app due to security and verification reasons.</p>
                <p className="text-[#354B60]">Before deleting data, please make sure to meet the following preconditions, otherwise the data deletion will fail:</p>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="size-[5px] rounded-full bg-[#0C2740] shrink-0" />
                        <p className="text-[#354B60]">Maintain a zero balance: Your account balance must be 0 before you can delete your data.</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="size-[5px] rounded-full bg-[#0C2740] shrink-0 " />
                        <p className="text-[#354B60] inline-flex">Have no pending transactions: You cannot have an outstanding transaction. All your Tunse requests must be completed.</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="size-[5px] rounded-full bg-[#0C2740] shrink-0 " />
                        <p className="text-[#354B60] inline-flex font-normal">No transactions in the past 7 days: You cannot have any transactions within the past 7 days before deleting your data.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-green-800 shrink-0 text-white flex items-center justify-center">1</div>
                        <h2 className="text-[#354B60]">Login to your Tunse Account</h2>
                    </div>
                    <div className="flex items-center justify-center  bg-[#cde4dd] pt-6 rounded-sm">
                        <img src="./assets/images/login-screen-01.png" alt="login-screen-01" />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-green-800 shrink-0 text-white flex items-center justify-center">2</div>
                        <h2 className="text-[#354B60]">Make sure you have no pending transactions</h2>
                    </div>
                    <div className="flex items-center justify-center  bg-[#cde4dd] pt-6 rounded-sm">
                        <img src="./assets/images/login-screen-01.png" alt="login-screen-01" />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="self-start size-7 rounded-full bg-green-800 shrink-0 text-white flex items-center justify-center">3</div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[#354B60] flex items-center gap-2"> <span className="size-[5px] rounded-full bg-green-800 shrink-0"></span> Go to the Homepage and click the menu icon at the top left</h2>
                            <h2 className="text-[#354B60] flex items-center gap-2"> <span className="size-[5px] rounded-full bg-green-800 shrink-0"></span> Then click on “Settings” on the side menu</h2>
                        </div>
                    </div>
                    <div className="flex items-center justify-center  bg-[#cde4dd] pt-6 rounded-sm">
                        <img src="./assets/images/settings-lg.png" alt="settings-lg" />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="self-start size-7 rounded-full bg-green-800 shrink-0 text-white flex items-center justify-center">4</div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[#354B60] flex items-center gap-2"> <span className="size-[5px] rounded-full bg-green-800 shrink-0"></span> Click “Delete Account”. Let us know why you'd like to delete your account and then, click “Request Deletion”.</h2>
                        </div>
                    </div>
                    <div className="flex items-center justify-center  bg-[#cde4dd] pt-6 rounded-sm">
                        <img src="./assets/images/delete-account-lg.png" alt="delete-account-lg" />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="self-start size-7 rounded-full bg-green-800 shrink-0 text-white flex items-center justify-center">5</div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[#354B60] flex items-center gap-2"> <span className="size-[5px] rounded-full bg-green-800 shrink-0"></span> Your account will be deleted once all the requirements are met.</h2>
                        </div>
                    </div>
                    <div className="flex items-center justify-center  bg-[#cde4dd] pt-6 rounded-sm">
                        <img src="./assets/images/delete-confirmations.png" alt="delete-confirmations" />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DeleteAccount