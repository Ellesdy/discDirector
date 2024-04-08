import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { LoggerServiceInterface } from "../../interfaces/logger.service.interface";
import { ConfigServiceInterface } from "../../interfaces/config.service.interface";
import { ValidationHelperServiceInterface } from "../../interfaces/validation.helper.service.interface";
import { ConfigType } from "../../types"; // Import ConfigType from where it is defined

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

  logValidationStart(validationType: string): void {
    this.loggerService.logSystem(`Starting ${validationType} validation...`);
  }

  logValidationSuccess(validationType: string, message: string): void {
    this.loggerService.logSuccess(
      `Validation succeeded for ${validationType}: ${message}`
    );
  }

  logValidationFailure(
    validationType: string,
    message: string,
    error: Error
  ): void {
    const errorMessage = `Validation failed for ${validationType}: ${message} - ${error.message}`;
    this.loggerService.logError(new Error(errorMessage).message);
  }

  logValidationEnd(validationType: string): void {
    this.loggerService.logSystem(`Completed ${validationType} validation.`);
  }

  validateConfig(config: string | null | undefined): ConfigType {
    if (config === null || config === undefined) {
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
      return parsedConfig as ConfigType; // Now correctly recognizes ConfigType
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Error parsing config: ${e.message}`);
      } else {
        throw new Error("Error parsing config");
      }
    }
  }

  async validateAll(): Promise<void> {
    const configs = await this.configService.GetAllConfigs(); // Adding 'await' here
    this.logValidationStart("config");

    for (const config of configs) {
      try {
        const validatedConfig = this.validateConfig(config.Content);
        this.logValidationSuccess("config", validatedConfig.Name);
        await this.configService.UpdateConfig(config.Name, validatedConfig);
        this.logValidationEnd("config");
      } catch (error) {
        if (error instanceof Error) {
          this.logValidationFailure("config", config.Name, error);
        } else {
          this.loggerService.logError(
            new Error(
              `Unexpected error during validation of config: ${config.Name}`
            ).message
          );
        }
      }
    }

    this.logValidationEnd("config");
  }
}
