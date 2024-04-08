import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ClientServiceInterface } from "../../interfaces/client.service.interface";
import { LifecycleHelperServiceInterface } from "../../interfaces/lifecycle.helper.service.interface";
import { ValidationHelperServiceInterface } from "../../interfaces/validation.helper.service.interface";
import { CommandServiceInterface } from "../../interfaces/command.service.interface";
import { StartupServiceInterface } from "../../interfaces/startup.service.interface";

@injectable()
export class StartupService implements StartupServiceInterface {
  constructor(
    @inject(TYPES.ClientServiceInterface)
    private clientService: ClientServiceInterface,
    @inject(TYPES.LifecycleHelperServiceInterface)
    private lifecycleHelperService: LifecycleHelperServiceInterface,
    @inject(TYPES.ValidationHelperServiceInterface)
    private validationHelperService: ValidationHelperServiceInterface,
    @inject(TYPES.CommandServiceInterface)
    private commandService: CommandServiceInterface
  ) {}

  async init(): Promise<void> {
    try {
      await this.validationHelperService.validateAll();
      await this.lifecycleHelperService.setupListeners();
      await this.clientService.login();
    } catch (error) {
      console.error("Error initializing services:", error);
    }
  }
}
