import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-secondary/30 text-foreground selection:bg-primary/20">
            <Sidebar />
            <main className="flex-1 overflow-auto relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-40 pointer-events-none" />
                {children}
            </main>
        </div>
    );
}
