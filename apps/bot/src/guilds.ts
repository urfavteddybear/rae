import { guilds, type Database } from "@rae/database";

// Upserts guild row on join/rejoin. Phase 2 wires this into
// guildCreate; foundation + shape only here.
export async function upsertGuildJoined(
  db: Database,
  guild: { id: string; name: string; iconHash: string | null },
): Promise<void> {
  await db
    .insert(guilds)
    .values({ id: guild.id, name: guild.name, iconHash: guild.iconHash, leftAt: null })
    .onConflictDoUpdate({
      target: guilds.id,
      set: { name: guild.name, iconHash: guild.iconHash, leftAt: null },
    });
}
