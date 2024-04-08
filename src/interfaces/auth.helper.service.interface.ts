import { GuildMember } from "discord.js";

export interface AuthHelperServiceInterface {
  hasManageRolesPermission(user: GuildMember): boolean;
  hasTimeoutPermission(user: GuildMember): boolean;
}
