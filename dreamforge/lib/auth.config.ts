
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";

// Mock Email Provider moved to auth.ts for Adapter compatibility
export const authConfig = {
    providers: [
        Google,
        LinkedIn,
    ],
    pages: {
        signIn: '/auth/signin',
        newUser: '/onboarding',
    },
    session: { strategy: "jwt" as const },
    callbacks: {
        async session({ session, token }: any) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
    },
} satisfies NextAuthConfig;
