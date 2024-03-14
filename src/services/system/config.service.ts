import { ClientJSON } from "../../repository/config.repository";

class ConfigService {
  [x: string]: any;
  public Client = ClientJSON;

  constructor() {}

  public GetAllConfigs(): any[] {
    return [this.Client];
  }
}

export default ConfigService;
