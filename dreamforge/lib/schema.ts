import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    uuid,
    jsonb,
    uniqueIndex,
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text("password"),
    role: text("role").default("student"), // student, mentor, admin
    currentRole: text("current_role"),
    targetRole: text("target_role"),
    level: integer("level").default(1),
    xp: integer("xp").default(0),
    matchScore: integer("match_score").default(0),
    streak: integer("streak").default(0),
    goals: jsonb("goals"),
})

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount["type"]>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
)

export const skills = pgTable("skills", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(), // core, branch
    level: integer("level").default(1),
    description: text("description"),
})

export const userSkills = pgTable("user_skills", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id),
    skillId: uuid("skill_id").references(() => skills.id),
    proficiency: integer("proficiency").default(1), // 1-10
    verified: integer("verified").default(0), // 0 or 1 boolean
}, (table) => ({
    userSkillIdx: uniqueIndex("user_skill_idx").on(table.userId, table.skillId),
}))
