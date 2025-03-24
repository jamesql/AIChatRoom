import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { User } from "../../TYPES/types";

const prisma = new PrismaClient();

class UserService {
    async createUser(data: Omit<User, 'id'>): Promise<User> {
        return await prisma.user.create({
            data: data as PrismaUser,
        });
    }

    async getUserById(id: string, 
        omitPassword: boolean = true
    ): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                gamesPlayed: true,
                gamesWon: true,
                gamesLost: true,
                password: omitPassword ? false : true,
            },
        });
    }

    async updateUser(id: string, data: Partial<User>): Promise<User> {
        return await prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: string): Promise<User> {
        return await prisma.user.delete({
            where: { id },
        });
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await prisma.user.findFirst({
            where: { name: username },
        });
    }
}

export default new UserService;