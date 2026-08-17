import { Link2Off, ArrowLeft } from "lucide-react";

function LinkExpiredPage() {
    const handleCloseTab = () => {
        window.opener = null;
        window.open("", "_self");
        window.close();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-4 rounded-xl">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-amber-500 rounded-full p-6">
                                <Link2Off className="w-16 h-16 text-white" strokeWidth={2.5} />
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Link Expired
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            This link is no longer valid or has already been used.
                        </p>

                        <div className="w-full space-y-3">
                            <button
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                onClick={handleCloseTab}
                            >
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LinkExpiredPage;