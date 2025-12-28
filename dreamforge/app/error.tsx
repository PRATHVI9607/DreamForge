"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong!</h2>
                <p className="text-slate-500 mb-6 text-sm">
                    We encountered an unexpected error. Our team has been notified.
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-slate-950 text-slate-300 p-4 rounded-xl text-xs text-left overflow-auto max-h-40 mb-6 font-mono">
                        {error.message}
                        {error.digest && <div className="mt-2 text-slate-500">Digest: {error.digest}</div>}
                    </div>
                )}

                <button
                    onClick={() => reset()}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                    <RefreshCcw size={16} />
                    Try again
                </button>
            </div>
        </div>
    );
}
