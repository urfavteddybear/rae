// Discord MANAGE_GUILD bit (0x20). OAuth scopes identify+guilds tell us
// WHO the user is and WHICH guilds they belong to; this bit tells us
// whether they may CONTROL that guild's playback. Always checked
// server-side per request — never trust a browser-supplied claim.
// Wires into playback routes in Phase 4.
export const MANAGE_GUILD_BIT = 0x20;

export function hasGuildControl(permissionBits: number | bigint | string): boolean {
  try {
    return (BigInt(permissionBits) & BigInt(MANAGE_GUILD_BIT)) !== 0n;
  } catch {
    return false;
  }
}
