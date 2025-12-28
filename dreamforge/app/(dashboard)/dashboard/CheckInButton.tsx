"use client";

import { dailyCheckIn } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import { Flame } from "lucide-react";

export function CheckInButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckIn = async () => {
        setIsLoading(true);
        try {
            const result = await dailyCheckIn();
            toast.success("Daily Check-in Complete! +100 XP gained.", {
                icon: <Flame className="text-orange-500" />
            });
        } catch (error) {
            toast.error("Failed to check in.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckIn}
            disabled={isLoading}
            className="w-full py-4 mt-6 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/20 text-center block disabled:opacity-50"
        >
            {isLoading ? "Synchronizing..." : "Start Daily Learning Plan"}
        </button>
    );
}
