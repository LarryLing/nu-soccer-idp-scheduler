export type User = {
  uid: string;
  email: string;
};

export type UserContextType = {
  user: User | null;
  isLoading: boolean;
  signUp: (email?: string, password?: string) => Promise<void>;
  signIn: (email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email?: string) => Promise<void>;
  resetPassword: (newPassword?: string) => Promise<void>;
};
