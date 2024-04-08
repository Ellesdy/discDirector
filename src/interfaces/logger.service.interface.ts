export interface LoggerServiceInterface {
  logInfo(message: string): void;
  logError(message: string): void;
  logWarning(message: string): void;
  logSystem(message: string): void;
  logSuccess(message: string): void;
}
