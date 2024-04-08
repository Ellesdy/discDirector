import { GuildMember, Role, Snowflake } from "discord.js";

export interface RoleServiceInterface {
  getAllRoles(guild: Snowflake): Promise<Role[]>;
  getRoleByName(guild: Snowflake, roleName: string): Promise<Role | undefined>;
  getRoleById(guild: Snowflake, roleId: Snowflake): Promise<Role | undefined>;
  getMemberRoles(member: GuildMember): Promise<Role[]>;
}
