import { Client } from "discord.js";

export interface ClientServiceInterface {
  get Client(): Client;
  login(): Promise<void>;
}
