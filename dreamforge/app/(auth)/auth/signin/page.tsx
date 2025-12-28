"use client";

import { use, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function SignInPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; registered?: string }>;
}) {
    const params = use(searchParams);
    const error = params?.error;
    const registered = params?.registered;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLocalError(null);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setLocalError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setLocalError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-slate-900/20 rotate-3 transition-transform hover:rotate-0">
                        DF
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access DreamForge</h1>
                    <p className="text-slate-500 text-sm mt-2">Sign in to your account</p>
                </div>

                {registered && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-medium flex items-center gap-3">
                        <div className="p-1 bg-emerald-100 rounded-full text-emerald-600">✓</div>
                        Account created! You can now sign in below.
                    </div>
                )}

                {(error || localError) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-shake">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-xs font-medium">
                            {localError || "Authentication failed. Please check your credentials."}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-slate-900" />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-slate-900" />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>
                    <button
                        disabled={isLoading}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
                    <p className="text-center text-sm text-slate-500">
                        New to DreamForge?{" "}
                        <Link href="/auth/signup" className="text-slate-900 font-bold hover:underline inline-flex items-center gap-1">
                            Create an account <UserPlus size={14} />
                        </Link>
                    </p>
                </div>

                <p className="text-center text-[10px] text-slate-400 mt-8 leading-relaxed">
                    By accessing the platform, you agree to our <span className="underline cursor-pointer hover:text-slate-600">Terms</span> and <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
                </p>
            </motion.div>
        </div>
    );
}
