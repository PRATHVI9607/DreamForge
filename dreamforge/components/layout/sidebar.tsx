"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Network, Map as MapIcon, User, FlaskConical, ChevronLeft, ChevronRight, LayoutDashboard, LogOut, FileText, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const sidebarItems = [
    { name: "Growth Hub", href: "/dashboard", icon: LayoutDashboard },
    { name: "Career Map", href: "/map", icon: MapIcon },
    { name: "Skill Tree", href: "/tree", icon: Network },
    { name: "AI Coach", href: "/interview", icon: User },
    { name: "Opportunity", href: "/jobs", icon: Briefcase },
    { name: "Design Lab", href: "/lab", icon: FlaskConical },
    { name: "Profile", href: "/profile", icon: FileText },
];

export function Sidebar() {
    const { data: session } = useSession();
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const userName = session?.user?.name || "Pioneer";
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <motion.div
            initial={{ width: 240 }}
            animate={{ width: collapsed ? 80 : 240 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen bg-card border-r border-border flex flex-col relative z-20 shadow-sm"
        >
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-9 bg-background border border-border rounded-full p-1.5 shadow-sm hover:bg-muted transition-colors z-30"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className="h-20 flex items-center justify-center border-b border-border/50">
                <AnimatePresence mode="wait">
                    {!collapsed ? (
                        <motion.div
                            key="full-logo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent"
                        >
                            DreamForge
                        </motion.div>
                    ) : (
                        <motion.div
                            key="short-logo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-2xl font-bold text-primary"
                        >
                            DF
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <nav className="flex-1 px-3 space-y-2 mt-6">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group overflow-hidden",
                                isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />

                            <span className={cn(
                                "whitespace-nowrap transition-all duration-300",
                                collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
                            )}>
                                {item.name}
                            </span>

                            {isActive && !collapsed && (
                                <motion.div layoutId="active-pill" className="absolute right-0 w-1 h-6 bg-primary rounded-l-full" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border flex flex-col gap-4">
                <div className={cn("flex items-center gap-3 transition-all", collapsed ? "justify-center" : "")}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-400 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-700">
                            {userInitials || "P"}
                        </div>
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-foreground truncate">{userName}</span>
                            <span className="text-xs text-muted-foreground truncate">DreamForge Member</span>
                        </div>
                    )}
                </div>

                {!collapsed && (
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all text-sm font-semibold"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                )}
            </div>
        </motion.div>
    );
}
