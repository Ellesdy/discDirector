import { serviceContainer } from "../inversify.config"; // Adjust the import path as needed
import { VerifyCommand } from "./model/verify";

export const commands = [serviceContainer.resolve(VerifyCommand)];
