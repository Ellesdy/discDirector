import { CommandInteraction } from "discord.js";

export interface CommandServiceInterface {
  registerCommands(): Promise<void>;
  handleCommand(interaction: CommandInteraction): Promise<void>;
}
