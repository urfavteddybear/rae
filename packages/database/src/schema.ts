import { boolean, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// Phase 1 minimal schema: users/sessions/accounts (Better Auth),
// guilds + settings + user prefs. No playlists/favorites/history —
// those are Phase 7. No audio/lyrics storage — never.

// Better Auth core tables (schema matches better-auth drizzle adapter).
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    idToken: text("id_token"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("accounts_provider_account_idx").on(t.providerId, t.accountId)],
);

// better-auth verification table (email/OTP flows). Unused with
// OAuth-only auth but required by the adapter's expected schema.
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Discord guilds where the bot is (or was) present.
export const guilds = pgTable("guilds", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  iconHash: text("icon_hash"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  leftAt: timestamp("left_at"),
});

// Per-guild bot settings. JSON prefs column keeps Phase 1 minimal;
// promote to typed columns when a setting needs querying/indexing.
export const guildSettings = pgTable("guild_settings", {
  guildId: text("guild_id")
    .primaryKey()
    .references(() => guilds.id, { onDelete: "cascade" }),
  defaultVolume: text("default_volume").notNull().default("100"),
  settings: jsonb("settings").notNull().default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userPrefs = pgTable("user_prefs", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  prefs: jsonb("prefs").notNull().default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
