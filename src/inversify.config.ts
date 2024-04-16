import { Container } from "inversify";
import { TYPES } from "./types";
// Interfaces
import {
  ConfigServiceInterface,
  LoggerServiceInterface,
  DatabaseHelperServiceInterface,
  ClientServiceInterface,
  CommandInterface,
  AuthHelperServiceInterface,
  ValidationHelperServiceInterface,
  CommandServiceInterface,
  LifecycleHelperServiceInterface,
  MessageServiceInterface,
  ApplicationServiceInterface,
  MemberServiceInterface,
  GuildServiceInterface,
  RoleServiceInterface,
  ChannelServiceInterface,
  LoggerHelperServiceInterface,
} from "./interfaces";
// Implementations
import {
  RoleService,
  GuildService,
  MemberService,
  ApplicationService,
  LifecycleHelperService,
  ValidationHelperService,
  AuthHelperService,
  ConfigService,
  LoggerService,
  DatabaseHelperService,
  ClientService,
  CommandModel,
  CommandService,
  MessageService,
  ChannelService,
  LoggerHelperService,
} from "./services";

export const serviceContainer = new Container();

// System Services
serviceContainer
  .bind<ConfigServiceInterface>(TYPES.ConfigServiceInterface)
  .to(ConfigService);
serviceContainer
  .bind<LoggerServiceInterface>(TYPES.LoggerServiceInterface)
  .to(LoggerService);
serviceContainer
  .bind<ApplicationServiceInterface>(TYPES.ApplicationServiceInterface)
  .to(ApplicationService);
serviceContainer
  .bind<MessageServiceInterface>(TYPES.MessageServiceInterface)
  .to(MessageService);

// Discord Services
serviceContainer
  .bind<ClientServiceInterface>(TYPES.ClientServiceInterface)
  .to(ClientService);
serviceContainer
  .bind<MemberServiceInterface>(TYPES.MemberServiceInterface)
  .to(MemberService);
serviceContainer
  .bind<GuildServiceInterface>(TYPES.GuildServiceInterface)
  .to(GuildService);
serviceContainer
  .bind<RoleServiceInterface>(TYPES.RoleServiceInterface)
  .to(RoleService);
serviceContainer
  .bind<CommandServiceInterface>(TYPES.CommandServiceInterface)
  .to(CommandService);
serviceContainer
  .bind<ChannelServiceInterface>(TYPES.ChannelServiceInterface)
  .to(ChannelService);

// Helper Services
serviceContainer
  .bind<DatabaseHelperServiceInterface>(TYPES.DatabaseHelperServiceInterface)
  .to(DatabaseHelperService);
serviceContainer
  .bind<AuthHelperServiceInterface>(TYPES.AuthHelperServiceInterface)
  .to(AuthHelperService);
serviceContainer
  .bind<ValidationHelperServiceInterface>(
    TYPES.ValidationHelperServiceInterface
  )
  .to(ValidationHelperService);
serviceContainer
  .bind<LifecycleHelperServiceInterface>(TYPES.LifecycleHelperServiceInterface)
  .to(LifecycleHelperService);
serviceContainer
  .bind<LoggerHelperServiceInterface>(TYPES.LoggerHelperServiceInterface)
  .to(LoggerHelperService);

// Commands
serviceContainer
  .bind<CommandInterface>(TYPES.CommandInterface)
  .to(CommandModel);

export default serviceContainer;
