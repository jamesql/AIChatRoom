import { PrismaClient, AIUser as PrismaUser } from '@prisma/client';
import { AIUser } from "../../TYPES/types";

const prisma = new PrismaClient();

class AIUserService {
    async createAIUser(data: Omit<AIUser, "id">): Promise<AIUser> {
        return await prisma.aIUser.create({
            data: data as PrismaUser,
        });
    }

    async getAIUserById(id: string): Promise<AIUser | null> {
        return await prisma.aIUser.findUnique({
            where: { id },
        });
    }

    async getAllAIUsers(): Promise<AIUser[]> {
        return await prisma.aIUser.findMany();
    }

    async updateAIUser(id: string, data: Partial<AIUser>): Promise<AIUser> {
        return await prisma.aIUser.update({
            where: { id },
            data,
        });
    }

    async deleteAIUser(id: string): Promise<AIUser> {
        return await prisma.aIUser.delete({
            where: { id },
        });
    }
}

export default AIUserService;