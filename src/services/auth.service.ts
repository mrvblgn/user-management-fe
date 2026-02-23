import { UserRepository } from "@/repositories/user.repository";
import { comparePassword } from "@/lib/hash";
import { generateToken } from "@/lib/jwt";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
  };
}

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Login metoduyla kullanıcıyı doğrula ve JWT token döndür
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Şifreli kullanıcıyı bul
    const user = await this.userRepository.findByEmailWithPassword(email);

    // Kullanıcı bulunamazsa veya şifre yanlışsa
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Şifre doğrula
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // JWT token oluştur
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
      },
    };
  }
}
