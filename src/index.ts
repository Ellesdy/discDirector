import "reflect-metadata"; // Required for InversifyJS
import { serviceContainer } from "./inversify.config"; // Assuming serviceContainer is your renamed InversifyJS container
import { TYPES } from "./types";
import { StartupServiceInterface } from "./interfaces/startup.service.interface";

async function initializeServices() {
  try {
    const startupService = serviceContainer.get<StartupServiceInterface>(
      TYPES.StartupServiceInterface
    );

    if (startupService) {
      await startupService.init();
      console.log("Startup service initialized successfully");
    } else {
      console.error("Startup service is not available or can't be initialized");
    }
  } catch (err) {
    console.error("Error initializing services:", err);
  }
}

initializeServices();
