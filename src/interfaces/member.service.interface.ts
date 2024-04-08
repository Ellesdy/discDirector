import { GuildMember, Snowflake, RoleResolvable } from "discord.js";

export interface MemberServiceInterface {
  getMemberFromUser(userID: Snowflake): Promise<GuildMember | undefined>;
  ensureMember(
    discordId: string,
    username: string,
    guildName: string,
    guildId: string,
    isVerified: boolean,
    roleIds?: string[]
  ): Promise<void>;
  ensureAllGuildMembers(): Promise<void>;
  getMemberById(
    guildId: Snowflake,
    memberId: Snowflake
  ): Promise<GuildMember | null>;
  getMemberRoles(
    guildId: Snowflake,
    memberId: Snowflake
  ): Promise<RoleResolvable[] | null>;
  getMemberUsername(
    guildId: Snowflake,
    memberId: Snowflake
  ): Promise<string | null>;
  syncVerifiedMembersWithDiscordRoles(): Promise<void>;
  syncVerifiedMembersWithDatabase(guildId: Snowflake): Promise<void>;
}
