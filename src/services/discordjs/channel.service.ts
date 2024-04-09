import { injectable } from "inversify";
import { ChannelServiceInterface } from "../../interfaces/channel.service.interface";
import {
  Guild,
  GuildChannel,
  VoiceChannel,
  CategoryChannel,
  ChannelType,
  StageChannel,
  GuildMember,
} from "discord.js";
import { MemberServiceInterface } from "../../interfaces";

@injectable()
export class ChannelService implements ChannelServiceInterface {
  public async getUserChannel(
    guild: Guild,
    userId: string
  ): Promise<VoiceChannel | StageChannel | null> {
    const member = await guild.members.fetch(userId);
    return member.voice.channel;
  }

  public async getChannelsInCategory(
    guild: Guild,
    categoryId: string
  ): Promise<GuildChannel[]> {
    const category = guild.channels.cache.get(categoryId) as CategoryChannel;
    if (category && category.type === ChannelType.GuildCategory) {
      return Array.from(category.children.cache.values());
    }
    return [];
  }

  public async getUsersInChannel(
    channel: GuildChannel
  ): Promise<GuildMember[]> {
    if (
      channel.type === ChannelType.GuildVoice ||
      channel.type === ChannelType.GuildStageVoice
    ) {
      return Array.from(
        (channel as VoiceChannel | StageChannel).members.values()
      );
    }
    throw new Error("Channel must be a voice or stage channel to list users.");
  }
}
