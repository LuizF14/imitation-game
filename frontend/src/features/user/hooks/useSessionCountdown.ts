import { useEffect, useState } from "react";

const SESSION_DURATION_SECONDS = 5 * 60;

export function useSessionCountdown(startedAt: string | undefined) {
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    useEffect(() => {
        if (!startedAt) return;

        const calc = () => {
            const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
            return Math.max(SESSION_DURATION_SECONDS - elapsed, 0);
        };

        setSecondsLeft(calc());

        const interval = setInterval(() => {
            const remaining = calc();
            setSecondsLeft(remaining);
            if (remaining === 0) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [startedAt]);

    return { secondsLeft, isExpired: secondsLeft === 0 };
}