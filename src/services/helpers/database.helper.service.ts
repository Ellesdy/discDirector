import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { DatabaseHelperServiceInterface } from "../../interfaces/database.helper.service.interface";

@injectable()
export class DatabaseHelperService implements DatabaseHelperServiceInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findMemberById(discordId: string) {
    return await this.prisma.member.findUnique({
      where: { discordId },
    });
  }

  async upsertMemberVerification(
    discordId: string,
    isVerified: boolean,
    username: string,
    guildName: string,
    guildId: string
  ): Promise<void> {
    await this.prisma.member.upsert({
      where: { discordId },
      update: { isVerified, username, guildName, guildId },
      create: { discordId, isVerified, username, guildName, guildId },
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

  async updateMemberRoles(discordId: string, roleIds: string[]): Promise<void> {
    const member = await this.findMemberById(discordId);
    if (!member) {
      console.error(`Member with ID ${discordId} not found.`);
      return;
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.memberRole.deleteMany({
        where: { memberId: member.id },
      });
      for (const roleId of roleIds) {
        await prisma.memberRole.create({
          data: {
            memberId: member.id,
            role: roleId, 
          },
        });
      }
    });
  }
}
