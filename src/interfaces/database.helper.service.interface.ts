// src/interfaces/database.helper.service.interface.ts

export interface DatabaseHelperServiceInterface {
    findMemberById(discordId: string): Promise<any>; // Consider defining a more specific type than any
    upsertMemberVerification(
        discordId: string,
        isVerified: boolean,
        username: string,
        guildName: string,
        guildId: string
    ): Promise<void>;
    updateMemberVerification(
        discordId: string,
        isVerified: boolean
    ): Promise<void>;
    updateMemberRoles(discordId: string, roleIds: string[]): Promise<void>;
}
