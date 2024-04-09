import { ConfigType, ChannelConfigType, ClientConfigType, RoleConfigType } from "../types";

export interface ConfigServiceInterface {
  Channel: ChannelConfigType;
  Client: ClientConfigType;
  Role: RoleConfigType;
  GetAllConfigs(): Promise<ConfigType[]>;
  UpdateConfig(name: string, config: ConfigType): Promise<void>;
}