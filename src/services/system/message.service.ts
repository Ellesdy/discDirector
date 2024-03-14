class MessageService {
  constructor() {}

  // Formats a message with a timestamp and a custom tag
  formatMessage(message: string, tag: string = "INFO"): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${tag}] ${message}`;
  }

  // Logs an informational message to the console
  logInfo(message: string): void {
    console.log(this.formatMessage(message, "INFO"));
  }

  // Logs a warning message to the console
  logWarning(message: string): void {
    console.warn(this.formatMessage(message, "WARNING"));
  }

  // Logs an error message to the console
  logError(message: string): void {
    console.error(this.formatMessage(message, "ERROR"));
  }

  // You can add more methods for different log levels or message types as needed
}

export default MessageService;
