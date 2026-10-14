import { pgTable, serial, text, timestamp, unique, integer, index } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    body: text("body").notNull(),
    status: text("status").notNull().default("draft"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    socialAccountId: integer("social_account_id").references(
        () => socialAccounts.id,
        { onDelete: "set null" }
    ),
    externalId: text("external_id"),
    error: text("error"),
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

export const postMedia = pgTable("post_media", {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
        .notNull()
        .references(() => posts.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    fileId: text("file_id"),
    type: text("type").notNull(),
    position: integer("position").notNull().default(0),
})

export const postTargets = pgTable("post_targets", {
        id: serial("id").primaryKey(),
        postId: integer("post_id")
            .notNull()
            .references(() => posts.id, { onDelete: "cascade" }),
        socialAccountId: integer("social_account_id").references(
            () => socialAccounts.id,
            { onDelete: "set null" }
        ),
        provider: text("provider").notNull(),
        status: text("status").notNull().default("scheduled"),
        externalId: text("external_id"),
        error: text("error"),
        publishedAt: timestamp("published_at", { withTimezone: true }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => [
        unique().on(t.postId, t.socialAccountId),
        index("post_targets_post_idx").on(t.postId),
    ]
);
