import { ConfigType } from "../types";

export interface ConfigServiceInterface {
  GetAllConfigs(): Promise<ConfigType[]>;
  UpdateConfig(name: string, config: ConfigType): Promise<void>;
  getBotToken(): string;
  getApplicationId(): string;
  getGuildId(): string;
  getRoleId(roleName: string): string; // Correctly include the parameter in the interface
}
