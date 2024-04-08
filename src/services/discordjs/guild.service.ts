import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { GuildServiceInterface } from "../../interfaces/guild.service.interface";
import { Guild } from "discord.js";
import { ClientServiceInterface } from "../../interfaces/client.service.interface";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import { LoggerServiceInterface } from "../../interfaces/logger.service.interface";

@injectable()
export class GuildService implements GuildServiceInterface {
  private clientService: ClientServiceInterface;
  private configService: ConfigServiceInterface;
  private logger: LoggerServiceInterface;

  constructor(
    @inject(TYPES.ClientServiceInterface) clientService: ClientServiceInterface,
    @inject(TYPES.ConfigServiceInterface) configService: ConfigServiceInterface,
    @inject(TYPES.LoggerServiceInterface) logger: LoggerServiceInterface
  ) {
    this.clientService = clientService;
    this.configService = configService;
    this.logger = logger;
  }

  async getGuild(id: string): Promise<Guild | undefined> {
    const guild = this.clientService.Client.guilds.cache.get(id);
    if (!guild) {
      this.logger.logError(`Guild with ID ${id} not found.`);
      return undefined;
    }
    return guild;
  }

  async getGuilds(): Promise<Guild[]> {
    return this.clientService.Client.guilds.cache.map((guild) => guild);
  }
}
