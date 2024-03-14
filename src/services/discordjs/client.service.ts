import { Client } from "discord.js";
import ConfigService from "../system/config.service";

export class ClientService {
  private client: Client;
  private configService: ConfigService;

  constructor(configService: ConfigService) {
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
    } catch (error) {
      console.error("Error logging in to Discord:", error);
    }
  }
}

export default ClientService;
