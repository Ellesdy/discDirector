import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ClientServiceInterface } from "../../interfaces/client.service.interface";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import { Client, TextChannel, VoiceState, GuildMember } from "discord.js";

@injectable()
export class LoggingHelperService {
  private logChannelId: string;

  constructor(
    @inject(TYPES.ClientServiceInterface)
    private clientService: ClientServiceInterface,
    @inject(TYPES.ConfigServiceInterface)
    private configService: ConfigServiceInterface
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
    const channel = (await this.clientService.Client.channels.fetch(
      this.logChannelId
    )) as TextChannel;
    channel.send(message);
  }

  private async logMemberJoin(member: GuildMember): Promise<void> {
    this.logToChannel(`Member joined: ${member.displayName}`);
  }

  private async logVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState
  ): Promise<void> {
    this.logToChannel(
      `Voice state updated for ${newState.member?.displayName}`
    );
  }
}
