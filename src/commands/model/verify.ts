import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CommandInterface } from "../../interfaces/command.interface";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";

@injectable()
export class VerifyCommand implements CommandInterface {
  public data = new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verifies a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to verify")
        .setRequired(true)
    );
  public name: string = "verify"; // Since data.name might not be directly accessible
  public description: string = "Verifies a user.";

  constructor(
    @inject(TYPES.ConfigServiceInterface)
    private configService: ConfigServiceInterface
  ) {}

  public async execute(interaction: CommandInteraction): Promise<void> {
    if (!(interaction.member instanceof GuildMember) || !interaction.guild) {
      await interaction.reply({
        content: "This command can only be used within a server.",
        ephemeral: true,
      });
      return;
    }

    const userToVerify = interaction.options.getUser("user", true);
    if (!userToVerify) return; // Additional check for safety

    const memberToVerify = await interaction.guild.members.fetch(
      userToVerify.id
    );

    // Correctly retrieve role IDs
    const canVerifyRoleId = await this.configService.getRoleId("canVerify");
    const isVerifiedRoleId = await this.configService.getRoleId("isVerified");
    const notVerifiedRoleId = await this.configService.getRoleId("notVerified");

    // Ensure the roles are correctly fetched before proceeding with logic
    if (!memberToVerify.roles.cache.has(canVerifyRoleId)) {
      await interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    // Example verification logic
    if (!memberToVerify.roles.cache.has(isVerifiedRoleId)) {
      await memberToVerify.roles.add(isVerifiedRoleId);
      if (memberToVerify.roles.cache.has(notVerifiedRoleId)) {
        await memberToVerify.roles.remove(notVerifiedRoleId);
      }

      // Update the database accordingly
      // Assuming you have a method in the database helper to handle this

      await interaction.reply(
        `${userToVerify.username} has been verified successfully.`
      );
    } else {
      await interaction.reply(`${userToVerify.username} is already verified.`);
    }
  }
}
