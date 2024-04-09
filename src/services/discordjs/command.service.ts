import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import { CommandServiceInterface } from "../../interfaces/command.service.interface";
import { CommandInterface } from "../../interfaces/command.interface";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { CommandInteraction } from "discord.js";
import fs from "fs";
import path from "path";

@injectable()
export class CommandService implements CommandServiceInterface {
  private commands: CommandInterface[] = [];

  constructor(
    @inject(TYPES.ConfigServiceInterface)
    private configService: ConfigServiceInterface
  ) {
    this.loadCommands();
  }

  private loadCommands(): void {
    const commandsPath = path.join(__dirname, "../../commands/model");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const { default: command } = require(`${commandsPath}/${file}`);
      if (command) {
        this.commands.push(new command(this.configService));
      }
    }
  }

  public async registerCommands(): Promise<void> {
    const rest = new REST({ version: "9" }).setToken(
      this.configService.Client.botToken
    );

    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(
        Routes.applicationGuildCommands(
          this.configService.Client.applicationId,
          this.configService.Client.guildId
        ),
        { body: this.commands.map((command) => command.data.toJSON()) }
      );
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error("Error refreshing application (/) commands:", error);
    }
  }

  public async handleCommand(interaction: CommandInteraction): Promise<void> {
    const command = this.commands.find(
      (c) => c.name === interaction.commandName
    );
    if (!command) {
      console.warn(`Command not found: ${interaction.commandName}`);
      return;
    }

    await command.execute(interaction);
  }
}
