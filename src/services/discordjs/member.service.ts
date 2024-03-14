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

  // MemberService adjustments
  async ensureMember(
    discordId: Snowflake,
    username: string,
    guildName: string,
    guildId: string,
    isVerified: boolean,
    roles: RoleResolvable[] = []
  ): Promise<void> {
    try {
      const roleIds = roles.map((role) =>
        typeof role === "string" ? role : role.id
      );

      await prisma.member.upsert({
        where: { discordId },
        update: {
          username,
          isVerified,
        },
        create: {
          discordId,
          username,
          guildName,
          guildId,
          isVerified,
        },
      });

      // console.log(`Member ${discordId} upserted with verification status: ${isVerified}.');

      await prisma.memberRole.deleteMany({
        where: { memberId: discordId }, // Assuming `memberId` in `MemberRole` refers to `discordId` in `Member`
      });

      // Then, add the new set of roles
      for (const roleId of roleIds) {
        await prisma.memberRole.create({
          data: {
            memberId: discordId, // Ensure this matches your schema's expectations
            role: roleId,
          },
        });
      }

      // console.log(`Roles for member ${discordId} updated in database.`);
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
}

export default MemberService;
