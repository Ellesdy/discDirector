import { serviceContainer } from "../inversify.config";

export class ServiceFactory {
  static getService<T>(serviceIdentifier: symbol): T {
    return serviceContainer.get<T>(serviceIdentifier);
  }
}
