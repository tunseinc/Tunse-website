import { useState } from "react";

const SupportPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <main className="relative w-full min-h-screen bg-white">
            {isLoading ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                    <div className="flex flex-col items-center gap-3">
                        <span className="size-10 rounded-full border-4 border-[#d7e7c7] border-t-[#98BC77] animate-spin" />
                        <p className="text-sm text-center text-gray-600">Loading support chat...</p>
                    </div>
                </div>
            ) : null}

            <section className="h-screen w-full">
                <iframe
                    title="Tunse Support Chat"
                    src="https://tawk.to/chat/6a252579641a371c2f638578/1jqghkovt"
                    className="h-full w-full border-0"
                    allow="clipboard-write; microphone; camera"
                    onLoad={() => setIsLoading(false)}
                />
            </section>
        </main>
    );
};

export default SupportPage;
