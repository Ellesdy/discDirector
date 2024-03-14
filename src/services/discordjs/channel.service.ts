import {
  CommandInteraction,
  GuildChannel,
  ChannelType,
  GuildChannelCreateOptions,
} from "discord.js";
import LoggerService from "../system/logger.service";
import MessageService from "../system/message.service";
import ConfigService from "../system/config.service";
import GuildService from "./guild.service";

type GuildChannelType =
  | ChannelType.GuildText
  | ChannelType.GuildVoice
  | ChannelType.GuildCategory
  | ChannelType.GuildNews
  | ChannelType.GuildStageVoice
  | undefined;

class ChannelService {
  private logger: LoggerService;
  private message: MessageService;
  private config: ConfigService;
  private guild: GuildService;

  constructor(
    logger: LoggerService,
    message: MessageService,
    config: ConfigService,
    guild: GuildService
  ) {
    this.logger = logger;
    this.message = message;
    this.config = config;
    this.guild = guild;
  }

  /**
   * Fetches a guild channel by name.
   * @param guildId The ID of the guild.
   * @param channelName The name of the channel to fetch.
   * @returns The GuildChannel if found, otherwise null.
   */
  public async getGuildChannel(
    guildId: string,
    channelName: string
  ): Promise<GuildChannel | null> {
    const guild = await this.guild.getGuild(guildId);
    if (!guild) return null;

    const channel = guild.channels.cache.find(
      (channel) => channel.name === channelName
    );

    // Ensure the channel is a GuildChannel (not a thread or other types)
    if (channel instanceof GuildChannel) {
      return channel;
    } else {
      return null;
    }
  }

  /**
   * Creates a new channel in the guild.
   * @param guildId The ID of the guild.
   * @param channelName The name of the new channel.
   * @param channelType The type of the new channel.
   * @param parent The ID of the parent category (optional).
   * @returns The created GuildChannel if successful, otherwise null.
   */
  public async createChannel(
    guildId: string,
    channelName: string,
    channelType: GuildChannelType,
    parent?: string
  ): Promise<GuildChannel | null> {
    const guild = await this.guild.getGuild(guildId);
    if (!guild) {
      this.logger.logError("Guild not found");
      return null;
    }

    try {
      const options: GuildChannelCreateOptions = {
        name: channelName,
        type: channelType,
        parent,
      };
      const channel = await guild.channels.create(options);
      this.logger.logSuccess(`Channel '${channelName}' created successfully`);
      return channel;
    } catch (error) {
      this.logger.logError(
        `Failed to create channel '${channelName}': ${error}`
      );
      return null;
    }
  }

  /**
   * Deletes a channel in the guild.
   * @param guildId The ID of the guild.
   * @param channelId The ID of the channel to delete.
   */
  public async deleteChannel(
    guildId: string,
    channelId: string
  ): Promise<void> {
    const guild = await this.guild.getGuild(guildId);
    if (!guild) {
      this.logger.logError("Guild not found");
      return;
    }

    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
      this.logger.logError("Channel not found");
      return;
    }

    try {
      await channel.delete();
      this.logger.logSuccess(`Channel '${channelId}' deleted successfully`);
    } catch (error) {
      this.logger.logError(`Failed to delete channel '${channelId}': ${error}`);
    }
  }
}

export default ChannelService;
