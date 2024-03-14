import MessageService from "./message.service";

class LoggerService {
  private messageService: MessageService;

  constructor(messageService: MessageService) {
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

export default LoggerService;
