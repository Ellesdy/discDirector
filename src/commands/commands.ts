import { serviceContainer } from "../inversify.config";
import { CommandInterface } from "../interfaces/command.interface";
import VerifyCommand from "./model/verify";

export function loadCommands(): CommandInterface[] {
  return [serviceContainer.resolve<CommandInterface>(VerifyCommand)];
}
