import { AuthService } from "./auth.service";
import { UserRepository } from "@/repositories/user.repository";

/**
 * Service Factory - Tüm service'leri instantiate eder
 * Dependency injection'ı centralize eder
 */
export class ServiceFactory {
  /**
   * AuthService instance'ı oluştur
   */
  static createAuthService(): AuthService {
    const userRepository = new UserRepository();
    return new AuthService(userRepository);
  }
}
