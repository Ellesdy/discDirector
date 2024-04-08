import { injectable, inject } from "inversify";
import { TYPES } from "../../types"; // Adjust the import path as necessary
import { GuildMember, Role, Snowflake } from "discord.js";
import { RoleServiceInterface } from "../../interfaces/role.service.interface";
import { GuildServiceInterface } from "../../interfaces/guild.service.interface";

@injectable()
export class RoleService implements RoleServiceInterface {
  constructor(
    @inject(TYPES.GuildServiceInterface)
    private guildService: GuildServiceInterface
  ) {}

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
