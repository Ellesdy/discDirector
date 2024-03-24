import { Snowflake, GuildMember, RoleResolvable } from "discord.js";
import { PrismaClient } from "@prisma/client";
import ConfigService from "../system/config.service";
import GuildService from "../discordjs/guild.service";
import ClientService from "../discordjs/client.service";

const prisma = new PrismaClient();

class MemberService {
  private clientService: ClientService;
  private configService: ConfigService;
  private guildService: GuildService;

  constructor(
    clientService: ClientService,
    configService: ConfigService,
    guildService: GuildService
  ) {
    this.clientService = clientService;
    this.configService = configService;
    this.guildService = guildService;
  }

  async getMemberFromUser(userID: Snowflake): Promise<GuildMember | undefined> {
    const guildId = this.configService.Client.guildId;
    const guild = await this.guildService.getGuild(guildId);
    if (!guild) return undefined;
    return guild.members.fetch(userID);
  }

  async ensureMember(
    discordId: string,
    username: string,
    guildName: string,
    guildId: string,
    isVerified: boolean,
    roleIds: string[] = [] // Assuming these are the role strings you want to associate
  ): Promise<void> {
    try {
      // Upsert the member to ensure they exist
      const member = await prisma.member.upsert({
        where: { discordId },
        update: { username, isVerified, guildName, guildId },
        create: { discordId, username, isVerified, guildName, guildId },
      });

      // Assuming roleIds are strings that you want to assign to the member
      // Clear existing roles
      await prisma.memberRole.deleteMany({
        where: { memberId: member.id },
      });

      // Assign new roles
      for (const role of roleIds) {
        await prisma.memberRole.create({
          data: {
            role,
            memberId: member.id, // This should reference the actual Member ID
          },
        });
      }
    } catch (error) {
      console.error("Error ensuring member in database:", error);
    }
  }
  async ensureAllGuildMembers(): Promise<void> {
    try {
      const guildId = this.configService.Client.guildId;
      const guild = await this.guildService.getGuild(guildId);
      if (!guild) return;
      const members = await guild.members.fetch();
      for (const member of members.values()) {
        await this.ensureMember(
          member.id,
          member.user.username,
          guild.name,
          guild.id,
          false,
          []
        );
      }
    } catch (error) {
      console.error("Error ensuring all guild members:", error);
    }
  }

  async getMemberById(
    guildId: Snowflake,
    memberId: Snowflake
  ): Promise<GuildMember | null> {
    const guild = await this.guildService.getGuild(guildId);
    if (!guild) return null;
    try {
      return await guild.members.fetch(memberId);
    } catch {
      return null;
    }
  }

  async getMemberRoles(
    guildId: Snowflake,
    memberId: Snowflake
  ): Promise<RoleResolvable[] | null> {
    const member = await this.getMemberById(guildId, memberId);
    if (!member) return null;
    return member.roles.cache.map((role) => role.id);
  }

  async getMemberUsername(
    guildId: Snowflake,
    memberId: Snowflake
  ): Promise<string | null> {
    const member = await this.getMemberById(guildId, memberId);
    if (!member) return null;
    return member.user.username;
  }

  async syncVerifiedMembersWithDiscordRoles(): Promise<void> {
    try {
      const guild = await this.guildService.getGuild(
        this.configService.Client.guildId
      );
      if (!guild) return;

      const verifiedMembers = await prisma.member.findMany({
        where: { isVerified: true },
      });

      for (const verifiedMember of verifiedMembers) {
        const member = await guild.members
          .fetch(verifiedMember.discordId)
          .catch(() => null);
        if (!member) continue;

        const hasVerifiedRole = member.roles.cache.has(
          this.configService.Role.isVerified
        );
        if (!hasVerifiedRole) {
          await member.roles.add(this.configService.Role.isVerified);
        }
        // Optionally remove the Unverified role if present
        if (member.roles.cache.has(this.configService.Role.notVerified)) {
          await member.roles.remove(this.configService.Role.notVerified);
        }
      }
    } catch (error) {
      console.error(
        "Error syncing verified members with Discord roles:",
        error
      );
    }
  }

  async syncVerifiedMembersWithDatabase(guildId: Snowflake): Promise<void> {
    try {
      const guild = await this.guildService.getGuild(guildId);
      if (!guild) return;

      // Fetch the verified role ID from your configuration
      const verifiedRoleId = this.configService.Role.isVerified; // Assume this is configured correctly

      const members = await guild.members.fetch();
      for (const member of members.values()) {
        const isVerifiedInDiscord = member.roles.cache.has(verifiedRoleId);

        // Only update the database if the member has the verified role in Discord
        if (isVerifiedInDiscord) {
          await this.ensureMember(
            member.id,
            member.user.username,
            guild.name,
            guild.id,
            true, // Set isVerified to true since the member has the verified role
            member.roles.cache.map((role) => role.id)
          );
        }
      }
    } catch (error) {
      console.error("Error syncing verified members with database:", error);
    }
  }
}

export default MemberService;
