import { Guild } from "discord.js";
import ClientService from "./client.service";
import ConfigService from "../system/config.service";
import LoggerService from "../system/logger.service"; // Assuming LoggerService is available

class GuildService {
  private clientService: ClientService;
  private configService: ConfigService;
  private logger: LoggerService; // Added for error logging

  constructor(
    clientService: ClientService,
    configService: ConfigService,
    logger: LoggerService
  ) {
    this.clientService = clientService;
    this.configService = configService;
    this.logger = logger; // Initialize logger
  }

  async getGuild(id: string): Promise<Guild | undefined> {
    const guild = this.clientService.Client.guilds.cache.get(id);
    if (!guild) {
      this.logger.logError(`Guild with ID ${id} not found.`);
    }
    return guild;
  }

  async getGuilds(): Promise<Guild[]> {
    return this.clientService.Client.guilds.cache.map((guild) => guild);
  }
}

export default GuildService;
