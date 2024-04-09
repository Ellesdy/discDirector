export interface DatabaseHelperServiceInterface {
    findMemberById(discordId: string): Promise<any>; 
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
