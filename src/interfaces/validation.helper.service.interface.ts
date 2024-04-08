export interface ValidationHelperServiceInterface {
  logValidationStart(validationType: string): void;
  logValidationSuccess(validationType: string, message: string): void;
  logValidationFailure(
    validationType: string,
    message: string,
    error: Error
  ): void;
  logValidationEnd(validationType: string): void;
  validateConfig(config: string | null | undefined): any; // Consider specifying a more precise return type than any
  validateAll(): Promise<void>;
}
