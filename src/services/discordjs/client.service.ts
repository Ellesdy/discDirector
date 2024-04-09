import { injectable, inject } from "inversify";
import { Client } from "discord.js";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import { TYPES } from "../../types";

@injectable()
export class ClientService {
  private client: Client;
  private configService: ConfigServiceInterface;

  constructor(
    @inject(TYPES.ConfigServiceInterface) configService: ConfigServiceInterface
  ) {
    this.configService = configService;
    this.client = this.createClient();
  }

  private createClient(): Client {
    return new Client({ intents: 32767 });
  }

  get Client(): Client {
    return this.client;
  }

  async login(): Promise<void> {
    try {
      const botToken = this.configService.Client.botToken;
      await this.client.login(botToken);
    } catch (error: unknown) {
      // Handle unknown type for error
      console.error(
        "Error logging in to Discord:",
        error instanceof Error ? error.message : error
      );
    }
  }
}
