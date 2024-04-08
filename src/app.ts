import "reflect-metadata";
import { inject } from "inversify";
import { LoggerServiceInterface } from "./interfaces/logger.service.interface";
import { TYPES } from "./types";
import { serviceContainer } from "./inversify.config";

class App {
  constructor(
    @inject(TYPES.LoggerServiceInterface)
    private loggerService: LoggerServiceInterface
  ) {}

  public run() {
    this.loggerService.logInfo("Application is running.");
  }
}

const app = serviceContainer.resolve(App);
app.run();
