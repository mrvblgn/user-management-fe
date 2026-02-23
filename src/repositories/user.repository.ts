import { User } from "@prisma/client";
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
}
