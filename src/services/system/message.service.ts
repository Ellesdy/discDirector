import { injectable } from "inversify";
import { MessageServiceInterface } from "../../interfaces/message.service.interface";

@injectable()
export class MessageService implements MessageServiceInterface {
  constructor() {}

  formatMessage(message: string, tag: string = "INFO"): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${tag}] ${message}`;
  }

  logInfo(message: string): void {
    console.log(this.formatMessage(message, "INFO"));
  }

  logWarning(message: string): void {
    console.warn(this.formatMessage(message, "WARNING"));
  }

  logError(message: string): void {
    console.error(this.formatMessage(message, "ERROR"));
  }
}
