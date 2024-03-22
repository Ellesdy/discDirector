import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import DatabaseHelperService from "../../services/helpers/database.helper.service";
import ConfigService from "../../services/system/config.service";
import AuthHelperService from "../../services/helpers/auth.helper.service";
import CommandModel from "../command.model";

// Initialization of services
const configService = new ConfigService();
const databaseHelper = new DatabaseHelperService();

// Assuming these IDs are defined in your ConfigService or somewhere appropriate
const isVerifiedRoleID = configService.Role.isVerified;
const notVerifiedRoleID = configService.Role.notVerified;
const canVerifyRoleID = configService.Role.canVerify;

const verifyName = "verify";
const builder = new SlashCommandBuilder();

const execute = async (interaction: CommandInteraction) => {
  if (!(interaction.member instanceof GuildMember) || !interaction.guild) {
    await interaction.reply({
      content: "This command can only be used in a server.",
      ephemeral: true,
    });
    return;
  }

  const hasDiscordManageRolesPermission =
    AuthHelperService.hasManageRolesPermission(interaction.member);
  const hasBotSideVerifyPermission = interaction.member.roles.cache.has(
    configService.Role.canVerify
  );

  if (!hasDiscordManageRolesPermission && !hasBotSideVerifyPermission) {
    await interaction.reply({
      content: "You do not have permission to use this command.",
      ephemeral: true,
    });
    return;
  }

  const userToVerify = interaction.options.getUser("user");
  if (!userToVerify) {
    await interaction.reply({
      content: "Please mention a user to verify.",
      ephemeral: true,
    });
    return;
  }

  // Fetch member from the guild
  const memberToVerify = await interaction.guild.members.fetch(userToVerify.id);

  // Check if the member already has the 'isVerified' role
  if (memberToVerify.roles.cache.has(isVerifiedRoleID)) {
    // Check in database if the user is marked as verified
    const existingMember = await databaseHelper.findMemberById(userToVerify.id);
    if (!existingMember || !existingMember.isVerified) {
      await databaseHelper.upsertMemberVerification(
        userToVerify.id,
        true,
        userToVerify.username,
        interaction.guild.name,
        interaction.guild.id
      );
      await interaction.reply({
        content: `${userToVerify.username} is already verified in Discord. Database updated.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `${userToVerify.username} is already verified.`,
        ephemeral: true,
      });
    }
    return;
  }

  // Add the 'Verified' role and remove 'Unverified' role if exists
  await memberToVerify.roles.add(isVerifiedRoleID);
  if (memberToVerify.roles.cache.has(notVerifiedRoleID)) {
    await memberToVerify.roles.remove(notVerifiedRoleID);
  }

  // Update database
  await databaseHelper.upsertMemberVerification(
    userToVerify.id,
    true,
    userToVerify.username,
    interaction.guild.name,
    interaction.guild.id
  );

  await interaction.reply({
    content: `${userToVerify.username} has been verified successfully!`,
    ephemeral: true,
  });
};

builder
  .setName(verifyName)
  .setDescription("Verifies a user.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to verify")
      .setRequired(true)
  );

const verifyCommand = new CommandModel(verifyName, builder, execute);

export default verifyCommand;
