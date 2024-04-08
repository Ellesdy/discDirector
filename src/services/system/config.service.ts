import { injectable } from "inversify";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import {
  ConfigType,
  ChannelConfigType,
  ClientConfigType,
  RoleConfigType,
} from "../../types";

import {
  ClientJSON,
  RoleJSON,
  ChannelJSON,
} from "../../repository/config.repository";

@injectable()
export class ConfigService implements ConfigServiceInterface {
  public Channel: ChannelConfigType = ChannelJSON;
  public Client: ClientConfigType = ClientJSON;
  public Role: RoleConfigType = RoleJSON;

  constructor() {}

  public GetAllConfigs(): Promise<ConfigType[]> {
    return Promise.resolve([
      { Name: "Channel", Content: JSON.stringify(this.Channel) },
      { Name: "Client", Content: JSON.stringify(this.Client) },
      { Name: "Role", Content: JSON.stringify(this.Role) },
    ]);
  }

  public async UpdateConfig(name: string, config: ConfigType): Promise<void> {
    switch (name) {
      case "Channel":
        this.Channel = JSON.parse(config.Content);
        break;
      case "Client":
        this.Client = JSON.parse(config.Content);
        break;
      case "Role":
        this.Role = JSON.parse(config.Content);
        break;
      default:
        throw new Error("Unknown config name");
    }
  }

  public getBotToken(): string {
    return this.Client.botToken;
  }

  public getApplicationId(): string {
    return this.Client.applicationId;
  }

  public getGuildId(): string {
    return this.Client.guildId;
  }

  // Implement the getRoleId method
  public getRoleId(roleName: string): string {
    // Access the Role configuration to return the requested role ID
    // This is a simple implementation; adjust according to your actual configuration structure
    const role = this.Role[roleName as keyof RoleConfigType];
    if (!role) {
      throw new Error(`Role ID for '${roleName}' not found.`);
    }
    return role;
  }
}
