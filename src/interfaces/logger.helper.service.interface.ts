import { GuildMember, VoiceState } from "discord.js";

export interface LoggerHelperServiceInterface {
  logMemberJoin(member: GuildMember): Promise<void>;
  logVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState
  ): Promise<void>;
}
