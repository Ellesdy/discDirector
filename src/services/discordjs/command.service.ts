import { CommandInteraction, Interaction, REST, Routes } from "discord.js";
import ConfigService from "../system/config.service";
import defaultCommands from "../../commands/commands";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import CommandModel from "../../commands/command.model";
class CommandService {
  private configService: ConfigService;
  private commands: CommandModel[];

  constructor() {
    this.configService = new ConfigService();
    this.commands = [];
  }

  public async registerCommands(): Promise<void> {
    this.loadCommands();
    const rest = new REST().setToken(this.configService.Client.botToken);

    try {
      console.log(
        `Started registering ${this.commands.length} application (/) commands.`
      );
      const data = await rest.put(
        Routes.applicationGuildCommands(
          this.configService.Client.applicationId,
          this.configService.Client.guildId
        ),
        { body: this.commands }
      );
      console.log(
        `Successfully registered ${this.commands.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  }

  private loadCommands(): void {
    for (const command of defaultCommands) {
      this.loadCommand(command);
    }
  }

  private async loadCommand(command: {
    data: any;
    execute: any;
  }): Promise<void> {
    try {
      console.log(`Loading command ${command.data.name}`);
      this.commands.push(command.data);
    } catch (error) {
      console.error(`Error loading command`, error);
    }
  }

  public getCommands() {
    return defaultCommands;
  }

  public async handleCommand(interaction: CommandInteraction) {
    const command: any = this.getCommands().find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!command) return;

    try {
      // Execute the command
      command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command.",
        ephemeral: true,
      });
    }
  }
}

export default CommandService;
