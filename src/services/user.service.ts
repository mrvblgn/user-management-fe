import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import {
  CreateUserInput,
  UserRepository,
  UserResponse,
} from "@/repositories/user.repository";

export interface UploadRowInput {
  firstName: unknown;
  lastName: unknown;
  email: unknown;
  age: unknown;
  password: unknown;
  rowNumber: number;
}

export class UploadValidationError extends Error {
  constructor(public rowNumber: number, message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async listUsers(params: {
    page: number;
    pageSize: number;
    age?: number;
  }): Promise<{
    data: UserResponse[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    age?: number;
  }> {
    const page = Math.max(1, params.page);
    const pageSize = Math.min(50, Math.max(1, params.pageSize));
    const age = params.age;

    const [total, data] = await Promise.all([
      this.userRepository.countUsers(age),
      this.userRepository.findPaginated(page, pageSize, age),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      data,
      page,
      pageSize,
      total,
      totalPages,
      age,
    };
  }

  async uploadUsersFromExcel(rows: UploadRowInput[]): Promise<number> {
    if (rows.length === 0) {
      throw new UploadValidationError(0, "Aktarılacak satır bulunamadı");
    }

    const normalized: Array<CreateUserInput & { rowNumber: number }> = [];
    const emailRowMap = new Map<string, number>();

    for (const row of rows) {
      const firstName = String(row.firstName ?? "").trim();
      const lastName = String(row.lastName ?? "").trim();
      const email = String(row.email ?? "").trim().toLowerCase();
      const password = String(row.password ?? "").trim();
      const ageNumber = Number(row.age);

      if (!firstName) {
        throw new UploadValidationError(row.rowNumber, "firstName zorunludur");
      }
      if (!lastName) {
        throw new UploadValidationError(row.rowNumber, "lastName zorunludur");
      }
      if (!email) {
        throw new UploadValidationError(row.rowNumber, "email zorunludur");
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new UploadValidationError(row.rowNumber, "email geçersiz");
      }
      if (!Number.isInteger(ageNumber) || ageNumber <= 0) {
        throw new UploadValidationError(row.rowNumber, "age geçersiz");
      }
      if (!password) {
        throw new UploadValidationError(row.rowNumber, "password zorunludur");
      }

      if (emailRowMap.has(email)) {
        throw new UploadValidationError(
          row.rowNumber,
          "dosyada tekrar eden email var"
        );
      }

      emailRowMap.set(email, row.rowNumber);
      normalized.push({
        firstName,
        lastName,
        email,
        age: ageNumber,
        password,
        rowNumber: row.rowNumber,
      });
    }

    const count = await prisma.$transaction(async (tx) => {
      const existingEmails = await this.userRepository.findExistingEmails(
        Array.from(emailRowMap.keys()),
        tx
      );

      if (existingEmails.length > 0) {
        const email = existingEmails[0];
        const rowNumber = emailRowMap.get(email) ?? 0;
        throw new UploadValidationError(rowNumber, "email zaten kayitli");
      }

      const hashedData = await Promise.all(
        normalized.map(async (row) => ({
          ...row,
          password: await hashPassword(row.password),
        }))
      );

      const createData: CreateUserInput[] = hashedData.map(
        ({ rowNumber, ...data }) => data
      );

      return this.userRepository.createMany(createData, tx);
    });

    return count;
  }

  async createUser(data: CreateUserInput): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("email zaten kayitli");
    }

    const hashedPassword = await hashPassword(data.password);
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    return this.userRepository.findById(id);
  }
}
