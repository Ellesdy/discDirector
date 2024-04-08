// src/interfaces/message.service.interface.ts

export interface MessageServiceInterface {
  formatMessage(message: string, tag?: string): string;
  logInfo(message: string): void;
  logWarning(message: string): void;
  logError(message: string): void;
}
