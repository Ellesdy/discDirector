import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { LoggerServiceInterface } from "../../interfaces/logger.service.interface";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import { ValidationHelperServiceInterface } from "../../interfaces/validation.helper.service.interface";
import { ConfigType } from "../../types";

@injectable()
export class ValidationHelperService
  implements ValidationHelperServiceInterface
{
  constructor(
    @inject(TYPES.LoggerServiceInterface)
    private loggerService: LoggerServiceInterface,
    @inject(TYPES.ConfigServiceInterface)
    private configService: ConfigServiceInterface
  ) {}

  public logValidationStart(validationType: string): void {
    this.loggerService.logSystem(`Starting ${validationType} validation...`);
  }

  public logValidationSuccess(validationType: string, message: string): void {
    this.loggerService.logSuccess(
      `Validation succeeded for ${validationType}: ${message}`
    );
  }

  public logValidationFailure(
    validationType: string,
    message: string,
    error: Error
  ): void {
    this.loggerService.logError(
      `Validation failed for ${validationType}: ${message} - ${error.message}`
    );
  }

  public logValidationEnd(validationType: string): void {
    this.loggerService.logSystem(`Completed ${validationType} validation.`);
  }

  public validateConfig(config: string): ConfigType {
    if (!config) {
      throw new Error("Config is null or undefined.");
    }

    try {
      const parsedConfig = JSON.parse(config);
      if (typeof parsedConfig !== "object" || parsedConfig === null) {
        throw new Error("Invalid config format.");
      }
      if (!parsedConfig.Name || typeof parsedConfig.Content === "undefined") {
        throw new Error("Config is missing Name or Content.");
      }
      return parsedConfig as ConfigType;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw new Error("Error parsing config");
      }
    }
  }

  public async validateAll(): Promise<void> {
    this.logValidationStart("config");

    try {
      const configs = await this.configService.GetAllConfigs();
      configs.forEach((config) => {
        try {
          const validatedConfig = this.validateConfig(config.Content);
          this.logValidationSuccess("config", validatedConfig.Name);
        } catch (error) {
          if (error instanceof Error) {
            this.logValidationFailure("config", config.Name, error);
          } else {
            this.logValidationFailure(
              "config",
              config.Name,
              new Error("Unexpected error type")
            );
          }
        }
      });

      this.logValidationEnd("config");
    } catch (error) {
      if (error instanceof Error) {
        this.logValidationFailure("config", "general", error);
      } else {
        this.logValidationFailure(
          "config",
          "general",
          new Error("Unexpected error type")
        );
      }
    }
  }
}
