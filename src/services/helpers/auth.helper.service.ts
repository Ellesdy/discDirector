import { injectable } from "inversify";
import { GuildMember, PermissionsBitField } from "discord.js";
import { AuthHelperServiceInterface } from "../../interfaces/auth.helper.service.interface";

@injectable()
export class AuthHelperService implements AuthHelperServiceInterface {
  hasManageRolesPermission(user: GuildMember): boolean {
    console.log(user);
    return user.permissions.has(PermissionsBitField.Flags.ManageRoles);
  }

  hasTimeoutPermission(user: GuildMember): boolean {
    console.log(user);
    return user.permissions.has(PermissionsBitField.Flags.ModerateMembers);
  }
}
