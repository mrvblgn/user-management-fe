import { Prisma, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  password: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  /**
   * Email ile kullanıcı bul
   * Şifre döndürmez
   */
  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * ID ile kullanıcı bul
   * Şifre döndürmez
   */
  async findById(id: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Email ile kullanıcı bul (şifre ile)
   * Sadece authentication için kullan
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Yeni kullanıcı oluştur
   * Şifre döndürmez
   */
  async create(data: CreateUserInput): Promise<UserResponse> {
    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Tüm kullanıcıları getir
   * Şifreler döndürmez
   */
  async findAll(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  }

  async countUsers(age?: number): Promise<number> {
    const where = age ? { age } : undefined;
    return prisma.user.count({ where });
  }

  async findPaginated(
    page: number,
    pageSize: number,
    age?: number
  ): Promise<UserResponse[]> {
    const where = age ? { age } : undefined;
    const skip = (page - 1) * pageSize;

    return prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Kullanıcıyı güncelle
   * Şifre döndürmez
   */
  async update(
    id: string,
    data: Partial<CreateUserInput>
  ): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Kullanıcıyı sil
   * Hataları service layer'a gönder
   */
  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findExistingEmails(
    emails: string[],
    tx?: Prisma.TransactionClient
  ): Promise<string[]> {
    if (emails.length === 0) {
      return [];
    }

    const client = tx ?? prisma;
    const results = await client.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      select: {
        email: true,
      },
    });

    return results.map((item) => item.email);
  }

  async createMany(
    data: CreateUserInput[],
    tx?: Prisma.TransactionClient
  ): Promise<number> {
    if (data.length === 0) {
      return 0;
    }

    const client = tx ?? prisma;
    const result = await client.user.createMany({
      data,
    });

    return result.count;
  }
}
