import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { LoggerHelperServiceInterface } from "../../interfaces/logger.helper.service.interface";
import { ClientServiceInterface } from "../../interfaces/client.service.interface";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import { LoggerServiceInterface } from "../../interfaces/logger.service.interface";
import { Client, TextChannel, VoiceState, GuildMember } from "discord.js";

@injectable()
export class LoggerHelperService implements LoggerHelperServiceInterface {
  private logChannelId: string;

  constructor(
    @inject(TYPES.ClientServiceInterface)
    private clientService: ClientServiceInterface,
    @inject(TYPES.ConfigServiceInterface)
    private configService: ConfigServiceInterface,
    @inject(TYPES.LoggerServiceInterface) // Inject LoggerService
    private loggerService: LoggerServiceInterface // Use LoggerService for logging
  ) {
    this.logChannelId = this.configService.Channel.logChannelId;
    const client = this.clientService.Client;
    this.setupListeners(client);
  }

  private setupListeners(client: Client): void {
    client.on("guildMemberAdd", (member) => this.logMemberJoin(member));
    client.on("voiceStateUpdate", (oldState, newState) =>
      this.logVoiceStateUpdate(oldState, newState)
    );
  }

  private async logToChannel(message: string): Promise<void> {
    try {
      const channel = (await this.clientService.Client.channels.fetch(
        this.logChannelId
      )) as TextChannel;
      channel.send(message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("failed to log to channel: ", error.message);
      } else {
        console.error("An unknown error occurred.");
      }
    }
  }

  public async logMemberJoin(member: GuildMember): Promise<void> {
    this.logToChannel(`Member joined: ${member.displayName}`);
  }

  public async logVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState
  ): Promise<void> {
    this.logToChannel(
      `Voice state updated for ${newState.member?.displayName}`
    );
  }
}
