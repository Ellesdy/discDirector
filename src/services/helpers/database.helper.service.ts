import { PrismaClient } from "@prisma/client";

class DatabaseHelperService {
  prisma = new PrismaClient();

  async findMemberById(discordId: string) {
    return this.prisma.member.findUnique({
      where: { discordId },
    });
  }

  async upsertMemberVerification(
    discordId: string,
    isVerified: boolean,
    username: string, // Add username parameter
    guildName: string, // Add guildName parameter
    guildId: string // Add guildId parameter
  ) {
    await this.prisma.member.upsert({
      where: { discordId },
      update: { isVerified },
      create: {
        discordId,
        isVerified,
        username, // Include username in create object
        guildName, // Include guildName in create object
        guildId, // Include guildId in create object
      },
    });
  }

  async updateMemberVerification(
    discordId: string,
    isVerified: boolean
  ): Promise<void> {
    await this.prisma.member.update({
      where: { discordId },
      data: { isVerified },
    });
  }

  async updateMemberRoles(discordId: string, roleIds: string[]) {
    const member = await this.findMemberById(discordId);
    if (!member) return;

    // First, clear existing roles for the member
    await this.prisma.memberRole.deleteMany({
      where: { memberId: member.id },
    });

    // Then, add new roles based on provided roleIds
    for (const roleId of roleIds) {
      await this.prisma.memberRole.create({
        data: {
          role: roleId,
          memberId: member.id,
        },
      });
    }
  }
}

export default DatabaseHelperService;
