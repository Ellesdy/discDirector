import { Guild, GuildChannel, GuildMember } from "discord.js";

export interface ChannelServiceInterface {
  getUserChannel(guild: Guild, userId: string): Promise<GuildChannel | null>;
  getChannelsInCategory(
    guild: Guild,
    categoryId: string
  ): Promise<GuildChannel[]>;
  getUsersInChannel(channel: GuildChannel): Promise<GuildMember[]>;
}
