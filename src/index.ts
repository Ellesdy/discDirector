import "reflect-metadata";
import { serviceContainer } from "./inversify.config";
import { ApplicationServiceInterface } from "./interfaces/application.service.interface";

import { TYPES } from "./types";

(async () => {
  try {
    const applicationService =
      serviceContainer.get<ApplicationServiceInterface>(
        TYPES.ApplicationServiceInterface
      );
    await applicationService.init();
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Fatal error during application initialization:", error);
  }
})();
