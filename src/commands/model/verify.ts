import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { PrismaClient } from "@prisma/client";
import ConfigService from "../../services/system/config.service";
import AuthHelperService from "../../services/helpers/auth.helper.service";

import CommandModel from "../command.model";

const prisma = new PrismaClient();
const configService = new ConfigService(); // Configure as needed

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

  if (
    !AuthHelperService.hasManageRolesPermission(interaction.member) &&
    !interaction.member.roles.cache.has(configService.Role.canVerify[0]) &&
    !interaction.member.roles.cache.has(configService.Role.canVerify[1])
  ) {
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

  const memberToVerify = await interaction.guild.members.fetch(userToVerify.id);
  if (!memberToVerify || !memberToVerify.user) {
    await interaction.reply({
      content: "Unable to verify the user.",
      ephemeral: true,
    });
    return;
  }

  // Checking in database if the user is already marked as verified
  const existingMember = await prisma.member.findUnique({
    where: { discordId: userToVerify.id },
  });

  if (existingMember && existingMember.isVerified) {
    await interaction.reply({
      content: `${memberToVerify.user.username} is already verified in the database!`,
      ephemeral: true,
    });
    return;
  }

  if (!memberToVerify.roles.cache.has(configService.Role.isVerified)) {
    if (memberToVerify.roles.cache.has(configService.Role.notVerified)) {
      await memberToVerify.roles.remove(configService.Role.notVerified);
    }
    await memberToVerify.roles.add(configService.Role.isVerified);

    // Update or create the member's verification status in the database
    // Update or create the member's verification status in the database
    await prisma.member.upsert({
      where: { discordId: userToVerify.id },
      update: { isVerified: true },
      create: {
        discordId: userToVerify.id,
        username: userToVerify.username,
        guildName: interaction.guild.name, // Adjust this based on your actual data source
        guildId: interaction.guild.id, // Adjust this based on your actual data source
        isVerified: true,
      },
    });

    await interaction.reply({
      content: `${memberToVerify.user.username} has been verified!`,
      ephemeral: true,
    });
  } else {
    await interaction.reply({
      content: `${memberToVerify.user.username} is already verified!`,
      ephemeral: true,
    });
  }
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
