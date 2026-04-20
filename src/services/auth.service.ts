import type { User } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser: User = {
      id: "1",
      email: credentials.email,
      name: "אליעזר",
      role: "ADMIN",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      user: mockUser,
      token: "mock-jwt-token",
    };
  }

  async logout(): Promise<void> {
    // TODO: Replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Replace with real API call
    return null;
  }
}

export const authService = new AuthService();
