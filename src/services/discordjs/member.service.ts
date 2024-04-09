import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { MemberServiceInterface } from "../../interfaces/member.service.interface";
import { GuildMember, Snowflake } from "discord.js";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import { GuildServiceInterface } from "../../interfaces/guild.service.interface";
import { PrismaClient } from "@prisma/client";

@injectable()
export class MemberService implements MemberServiceInterface {
  private prisma: PrismaClient;
  private configService: ConfigServiceInterface;
  private guildService: GuildServiceInterface;

  constructor(
    @inject(TYPES.ConfigServiceInterface) configService: ConfigServiceInterface,
    @inject(TYPES.GuildServiceInterface) guildService: GuildServiceInterface
  ) {
    this.configService = configService;
    this.guildService = guildService;
    this.prisma = new PrismaClient();
  }

  async getMemberFromUser(userID: Snowflake): Promise<GuildMember | undefined> {
    const guildId = await this.configService.Client.guildId;
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
    roleIds: Snowflake[] = []
  ): Promise<void> {
    try {
      await this.prisma.member.upsert({
        where: { discordId },
        update: { username, isVerified, guildName, guildId },
        create: { discordId, username, isVerified, guildName, guildId },
      });
    } catch (error: any) {
      console.error("Error ensuring member in database:", error.message);
    }
  }

  async syncVerifiedMembersWithDiscordRoles(): Promise<void> {
    const guildId = await this.configService.Client.guildId;
    const guild = await this.guildService.getGuild(guildId);
    if (!guild) return;

    const isVerifiedRoleId = await this.configService.Role.isVerified;
    const notVerifiedRoleId = await this.configService.Role.notVerified;

    const members = await guild.members.fetch();
    members.forEach(async (member) => {
      const verifiedMember = await this.prisma.member.findUnique({
        where: { discordId: member.id },
      });
      if (verifiedMember && verifiedMember.isVerified) {
        await member.roles.add(isVerifiedRoleId).catch(console.error);
        await member.roles.remove(notVerifiedRoleId).catch(console.error);
      }
    });
  }

  async syncVerifiedMembersWithDatabase(guildId: string): Promise<void> {
    const guild = await this.guildService.getGuild(guildId);
    if (!guild) return;
    const isVerifiedRoleId = await this.configService.Role.isVerified;
    const notVerifiedRoleId = await this.configService.Role.notVerified;

    const members = await guild.members.fetch();
    members.forEach(async (member) => {
      const isVerifiedInDiscord = member.roles.cache.has(isVerifiedRoleId);

      const existingMember = await this.prisma.member.findUnique({
        where: { discordId: member.id },
      });

      if (
        (existingMember && existingMember.isVerified !== isVerifiedInDiscord) ||
        !existingMember
      ) {
        await this.prisma.member.upsert({
          where: { discordId: member.id },
          update: { isVerified: isVerifiedInDiscord },
          create: {
            discordId: member.id,
            isVerified: isVerifiedInDiscord,
            username: member.user.username,
            guildName: guild.name,
            guildId: guildId,
          },
        });
        console.log(
          `Updated verification status in database for member: ${member.id}`
        );
      }
    });
  }

  async ensureAllGuildMembers(): Promise<void> {}

  async getMemberById(
    guildId: Snowflake,
    memberId: Snowflake
  ): Promise<GuildMember | null> {
    const guild = await this.guildService.getGuild(guildId);
    return guild ? await guild.members.fetch(memberId) : null;
  }

  async getMemberRoles(
    guildId: Snowflake,
    memberId: Snowflake
  ): Promise<Snowflake[]> {
    const member = await this.getMemberById(guildId, memberId);
    return member
      ? Array.from(member.roles.cache.values(), (role) => role.id)
      : [];
  }

  async getMemberUsername(memberId: Snowflake): Promise<string | null> {
    const member = await this.prisma.member.findUnique({
      where: { discordId: memberId },
    });
    return member ? member.username : null;
  }
}
