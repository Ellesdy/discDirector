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
}
