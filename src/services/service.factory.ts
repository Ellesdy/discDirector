import MessageService from "./system/message.service";
import LoggerService from "./system/logger.service";
import ConfigService from "./system/config.service";
import ClientService from "./discordjs/client.service";
import GuildService from "./discordjs/guild.service";
import ChannelService from "./discordjs/channel.service";
import CommandService from "./discordjs/command.service";
import LifecycleHelperService from "./helpers/lifecycle.helper.service";
import StartupService from "./system/startup.service";
import ValidationHelperService from "./helpers/validation.helper.service";
import MemberService from "./discordjs/member.service";

class ServiceFactory {
  static createServices(): Record<string, any> {
    const messageService = new MessageService();
    const loggerService = new LoggerService(messageService);
    const configService = new ConfigService();
    const clientService = new ClientService(configService);

    const guildService = new GuildService(
      clientService,
      configService,
      loggerService
    );
    const memberService = new MemberService(
      clientService,
      configService,
      guildService
    );
    const validationHelperService = new ValidationHelperService(
      loggerService,
      configService
    );
    const channelService = new ChannelService(
      loggerService,
      messageService,
      configService,
      guildService
    );
    const commandService = new CommandService();
    const lifecycleHelperService = new LifecycleHelperService(
      clientService,
      commandService,
      messageService,
      memberService,
      loggerService
    );
    const startupService = new StartupService(
      clientService,
      lifecycleHelperService,
      validationHelperService,
      commandService
    );

    return {
      clientService,
      guildService,
      commandService,
      channelService,
      lifecycleHelperService,
      startupService,
      messageService,
      loggerService,
      configService,
      validationHelperService,
      memberService,
    };
  }
}

export default ServiceFactory;
