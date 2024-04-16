import { injectable } from "inversify";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { CommandInterface } from "../interfaces/command.interface";

@injectable()
export class CommandModel implements CommandInterface {
  name: string;
  description: string;
  data: SlashCommandBuilder;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.data = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description);
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
