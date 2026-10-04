import { pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    body: text("body").notNull(),
    status: text("status").notNull().default("draft"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialAccounts = pgTable(
    "social_accounts",
    {
        id: serial("id").primaryKey(),
        userId: text("user_id").notNull(),
        provider: text("provider").notNull(),
        externalId: text("external_id").notNull(),
        displayName: text("display_name").notNull(),
        avatarUrl: text("avatar_url"),
        accessToken: text("access_token").notNull(),
        refreshToken: text("refresh_token"),
        expiresAt: timestamp("expires_at", { withTimezone: true }),
        status: text("status").notNull().default("active"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => [unique().on(t.userId, t.provider, t.externalId)]
);