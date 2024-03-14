import { Client, TextChannel, VoiceState, GuildMember } from "discord.js";
import ClientService from "../discordjs/client.service";
import ConfigService from "../system/config.service"; // Ensure this path is correct

class LoggingHelperService {
  private clientService: ClientService;
  private configService: ConfigService;
  private logChannelId: string;

  constructor(clientService: ClientService, configService: ConfigService) {
    this.clientService = clientService;
    this.configService = configService;
    // Using ConfigService to get the logging channel ID from ChannelJSON
    this.logChannelId = this.configService.Channel.LogChannel; // Adjust 'LogChannel' based on your actual config
    const client = this.clientService.Client;
    this.setupListeners(client);
  }

  private setupListeners(client: Client): void {
    client.on("guildMemberAdd", (member) => this.logMemberJoin(member));
    client.on("voiceStateUpdate", (oldState, newState) =>
      this.logVoiceStateUpdate(oldState, newState)
    );
    // Additional listeners here
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

  // Additional logging methods as needed
}

export default LoggingHelperService;
