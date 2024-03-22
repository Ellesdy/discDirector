import { Snowflake, GuildMember, Role } from "discord.js";
import GuildService from "./guild.service"; // Adjust the import path as necessary

class RoleService {
  private guildService: GuildService;

  constructor(guildService: GuildService) {
    this.guildService = guildService;
  }

  async getAllRoles(guildId: Snowflake): Promise<Role[]> {
    const guild = await this.guildService.getGuild(guildId);
    return guild ? Array.from(guild.roles.cache.values()) : [];
  }

  async getRoleByName(
    guildId: Snowflake,
    roleName: string
  ): Promise<Role | undefined> {
    const guild = await this.guildService.getGuild(guildId);
    return guild
      ? guild.roles.cache.find((role) => role.name === roleName)
      : undefined;
  }

  async getRoleById(
    guildId: Snowflake,
    roleId: Snowflake
  ): Promise<Role | undefined> {
    const guild = await this.guildService.getGuild(guildId);
    return guild ? guild.roles.cache.get(roleId) : undefined;
  }

  async getMemberRoles(member: GuildMember): Promise<Role[]> {
    return Array.from(member.roles.cache.values());
  }
}

export default RoleService;
