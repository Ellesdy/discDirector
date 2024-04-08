import { CommandInteraction } from "discord.js";

export interface CommandInterface {
  name: string;
  description: string;
  data: any; // Use appropriate type for command data.
  execute(interaction: CommandInteraction): Promise<void>;
}
