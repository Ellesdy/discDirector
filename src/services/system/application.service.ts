import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import {
  ClientServiceInterface,
  LifecycleHelperServiceInterface,
  ValidationHelperServiceInterface,
  LoggerServiceInterface,
  ApplicationServiceInterface,
} from "../../interfaces";
import { loadCommands } from "../../commands/commands";

@injectable()
export class ApplicationService implements ApplicationServiceInterface {
  constructor(
    @inject(TYPES.ClientServiceInterface)
    private clientService: ClientServiceInterface,
    @inject(TYPES.LifecycleHelperServiceInterface)
    private lifecycleHelperService: LifecycleHelperServiceInterface,
    @inject(TYPES.ValidationHelperServiceInterface)
    private validationHelperService: ValidationHelperServiceInterface,
    @inject(TYPES.LoggerServiceInterface)
    private loggerService: LoggerServiceInterface
  ) {}

  public async init(): Promise<void> {
    try {
      this.loggerService.logInfo("Application is starting up...");
      await this.validationHelperService.validateAll();
      await this.lifecycleHelperService.setupListeners();
      await this.clientService.login();
      const commands = loadCommands();
      console.log(`Loaded ${commands.length} commands.`);

      this.loggerService.logInfo("Application is running.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error initializing services:", error.message);
      } else {
        console.error(
          "Error initializing services: An unknown error occurred."
        );
      }
    }
  }
}
