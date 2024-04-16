export const TYPES = {
  LoggerServiceInterface: Symbol.for("LoggerServiceInterface"),
  ConfigServiceInterface: Symbol.for("ConfigServiceInterface"),
  ClientServiceInterface: Symbol.for("ClientServiceInterface"),
  DatabaseHelperServiceInterface: Symbol.for("DatabaseHelperServiceInterface"),
  CommandInterface: Symbol.for("CommandInterface"),
  AuthHelperServiceInterface: Symbol.for("AuthHelperServiceInterface"),
  ValidationHelperServiceInterface: Symbol.for(
    "ValidationHelperServiceInterface"
  ),
  CommandServiceInterface: Symbol.for("CommandServiceInterface"),
  LifecycleHelperServiceInterface: Symbol.for(
    "LifecycleHelperServiceInterface"
  ),
  ApplicationServiceInterface: Symbol.for("ApplicationServiceInterface"),
  MessageServiceInterface: Symbol.for("MessageServiceInterface"),
  MemberServiceInterface: Symbol.for("MemberServiceInterface"),
  GuildServiceInterface: Symbol.for("GuildServiceInterface"),
  RoleServiceInterface: Symbol.for("RoleServiceInterfaceInterface"),
  ChannelServiceInterface: Symbol.for("ChannelServiceInterface"),
  LoggerHelperServiceInterface: Symbol.for("LoggerHelperServiceInterface"),
};

export type ConfigType = {
  Name: string;
  Content: string;
};

export type ChannelConfigType = {
  logChannelId: string;
};

export type ClientConfigType = {
  botToken: string;
  applicationId: string;
  clientId: string;
  guildId: string;
};

export type RoleConfigType = {
  canVerify: string;
  isVerified: string;
  notVerified: string;
};
