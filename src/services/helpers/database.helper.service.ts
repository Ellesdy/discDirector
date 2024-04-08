// src/services/database.helper.service.ts

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
    // Assuming you have a relation set up in your Prisma schema between members and roles
    // This will remove all existing roles and add the new ones provided
    const member = await this.findMemberById(discordId);
    if (!member) {
      console.error(`Member with ID ${discordId} not found.`);
      return;
    }

    // Begin a transaction to ensure data consistency
    await this.prisma.$transaction(async (prisma) => {
      // Remove existing roles
      await prisma.memberRole.deleteMany({
        where: { memberId: member.id },
      });

      // Add new roles
      for (const roleId of roleIds) {
        await prisma.memberRole.create({
          data: {
            memberId: member.id,
            role: roleId, // Assuming your MemberRole model uses 'roleId' to reference roles
          },
        });
      }
    });
  }
}
