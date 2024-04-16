import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CommandInterface } from "../../interfaces/command.interface";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  GuildMemberRoleManager,
} from "discord.js";

@injectable()
export default class VerifyCommand implements CommandInterface {
  public data = new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verifies a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to verify")
        .setRequired(true)
    );

  public name: string = "verify";
  public description: string = "Verifies a user.";

  constructor(
    @inject(TYPES.ConfigServiceInterface)
    private configService: ConfigServiceInterface
  ) {}

  public async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used within a server.",
        ephemeral: true,
      });
      return;
    }

    const member = interaction.member as GuildMember | null;
    if (!member) {
      await interaction.reply({
        content: "You need to be a member of a server to use this command.",
        ephemeral: true,
      });
      return;
    }

    const userToVerify = interaction.options.getUser("user", true);
    const memberToVerify = await interaction.guild.members.fetch(
      userToVerify.id
    );

    const canVerifyRoleId = this.configService.Role.canVerify;
    const isVerifiedRoleId = this.configService.Role.isVerified;
    const notVerifiedRoleId = this.configService.Role.notVerified;

    if (!(member.roles as GuildMemberRoleManager).cache.has(canVerifyRoleId)) {
      await interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
      return;
    }
    if (
      !(memberToVerify.roles as GuildMemberRoleManager).cache.has(
        isVerifiedRoleId
      )
    ) {
      await memberToVerify.roles.add(isVerifiedRoleId);
      if (
        (memberToVerify.roles as GuildMemberRoleManager).cache.has(
          notVerifiedRoleId
        )
      ) {
        await memberToVerify.roles.remove(notVerifiedRoleId);
      }
      await interaction.reply(
        `${userToVerify.username} has been verified successfully.`
      );
    } else {
      await interaction.reply(`${userToVerify.username} is already verified.`);
    }
  }
}
