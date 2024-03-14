import { Client, CommandInteraction, Interaction, Message } from "discord.js";

import ClientService from "../discordjs/client.service";
import CommandService from "../discordjs/command.service";
import MessageService from "../system/message.service";
import MemberService from "../discordjs/member.service";
import LoggerService from "../system/logger.service";

class LifecycleHelperService {
  private clientService: ClientService;
  private commandService: CommandService;
  private messageService: MessageService;
  private memberService: MemberService;
  private loggerService: LoggerService;

  constructor(
    clientService: ClientService,
    commandService: CommandService,
    messageService: MessageService,
    memberService: MemberService,
    loggerService: LoggerService
  ) {
    this.clientService = clientService;
    this.commandService = commandService;
    this.messageService = messageService;
    this.memberService = memberService;
    this.loggerService = loggerService;
  }

  async setupListeners(): Promise<void> {
    this.clientService.Client.on("ready", async () => {
      const clientUser = this.clientService.Client.user;
      if (clientUser) {
        this.loggerService.logSystem(`Logged in as ${clientUser.tag}!`);
        await this.commandService.registerCommands();
        await this.memberService.ensureAllGuildMembers();
      }
    });

    this.clientService.Client.on("guildMemberAdd", async (member) => {
      await this.memberService.ensureMember(
        member.id,
        member.user.username,
        member.guild.name,
        member.guild.id,
        false,
        []
      );
    });

    this.clientService.Client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      this.commandService.handleCommand(interaction);
    });
  }
}

export default LifecycleHelperService;
