import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { authConfig } from "./auth.config"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { users } from "./schema"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials as any;
                if (!email || !password) return null;

                const [user] = await db.select().from(users).where(eq(users.email, email));
                if (!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (passwordsMatch) return user;

                return null;
            },
        }),
    ]
})
