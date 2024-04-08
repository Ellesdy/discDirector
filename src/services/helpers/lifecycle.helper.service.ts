import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ClientServiceInterface } from "../../interfaces/client.service.interface";
import { CommandServiceInterface } from "../../interfaces/command.service.interface";
import { MessageServiceInterface } from "../../interfaces/message.service.interface";
import { MemberServiceInterface } from "../../interfaces/member.service.interface";
import { LoggerServiceInterface } from "../../interfaces/logger.service.interface";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import { GuildMember, Interaction } from "discord.js";

@injectable()
export class LifecycleHelperService {
  constructor(
    @inject(TYPES.ConfigServiceInterface)
    private configService: ConfigServiceInterface,
    @inject(TYPES.ClientServiceInterface)
    private clientService: ClientServiceInterface,
    @inject(TYPES.CommandServiceInterface)
    private commandService: CommandServiceInterface,
    @inject(TYPES.MessageServiceInterface)
    private messageService: MessageServiceInterface,
    @inject(TYPES.MemberServiceInterface)
    private memberService: MemberServiceInterface,
    @inject(TYPES.LoggerServiceInterface)
    private loggerService: LoggerServiceInterface
  ) {}

  async setupListeners(): Promise<void> {
    const client = this.clientService.Client;

    client.on("ready", async () => {
      const clientUser = client.user;
      if (clientUser) {
        this.loggerService.logSystem(`Logged in as ${clientUser.tag}!`);
        await this.commandService.registerCommands();
        await this.memberService.ensureAllGuildMembers();
        await this.memberService.syncVerifiedMembersWithDiscordRoles();
        await this.memberService.syncVerifiedMembersWithDatabase(
          this.configService.getGuildId()
        );
      }
    });

    client.on("guildMemberAdd", async (member: GuildMember) => {
      await this.memberService.ensureMember(
        member.id,
        member.user.username,
        member.guild.name,
        member.guild.id,
        false,
        []
      );
      await this.memberService.syncVerifiedMembersWithDatabase(member.guild.id);
    });

    client.on("interactionCreate", async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;

      await this.commandService.handleCommand(interaction);
    });
  }
}
