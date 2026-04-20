export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: import("@/types").User | null;
}
