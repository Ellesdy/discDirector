import {
  ClientJSON,
  RoleJSON,
  ChannelJSON,
} from "../../repository/config.repository";

class ConfigService {
  [x: string]: any;
  public Channel = ChannelJSON;
  public Client = ClientJSON;
  public Role = RoleJSON;

  constructor() {}

  public GetAllConfigs(): any[] {
    return [this.Channel, this.Client, this.Role];
  }
}

export default ConfigService;
