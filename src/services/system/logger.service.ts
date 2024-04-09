import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { MessageServiceInterface } from "../../interfaces/message.service.interface";
import { LoggerServiceInterface } from "../../interfaces/logger.service.interface";

@injectable()
export class LoggerService implements LoggerServiceInterface {
  private messageService: MessageServiceInterface;

  constructor(
    @inject(TYPES.MessageServiceInterface)
    messageService: MessageServiceInterface
  ) {
    this.messageService = messageService;
  }

  logSystem(message: string): void {
    const formattedMessage = this.messageService.formatMessage(
      message,
      "SYSTEM"
    );
    console.log(formattedMessage);
  }

  logSuccess(message: string): void {
    const formattedMessage = this.messageService.formatMessage(
      message,
      "SUCCESS"
    );
    console.log(formattedMessage);
  }

  logInfo(message: string): void {
    const formattedMessage = this.messageService.formatMessage(message, "INFO");
    console.log(formattedMessage);
  }

  logWarning(message: string): void {
    const formattedMessage = this.messageService.formatMessage(
      message,
      "WARNING"
    );
    console.warn(formattedMessage);
  }

  logError(message: string): void {
    const formattedMessage = this.messageService.formatMessage(
      message,
      "ERROR"
    );
    console.error(formattedMessage);
  }
}
