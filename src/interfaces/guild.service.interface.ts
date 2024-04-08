import { Guild } from "discord.js";

export interface GuildServiceInterface {
  getGuild(id: string): Promise<Guild | undefined>;
  getGuilds(): Promise<Guild[]>;
}
