import { CommandInteraction } from "discord.js";

export interface CommandInterface {
  name: string;
  description: string;
  data: any;
  execute(interaction: CommandInteraction): Promise<void>;
}
