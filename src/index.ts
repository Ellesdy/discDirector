import ServiceFactory from "./services/service.factory";

async function initializeServices() {
  try {
    const services = ServiceFactory.createServices();
    if (services.startupService && services.startupService.init) {
      await services.startupService.init();
      console.log("Startup service initialized successfully");
    } else {
      console.error("Startup service is not available or can't be initialized");
    }
  } catch (err) {
    console.error("Error initializing services", err);
  }
}

initializeServices();
