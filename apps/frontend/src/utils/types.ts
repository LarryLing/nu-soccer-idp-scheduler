import React from "react";

export type User = {
  uid: string;
  email: string;
};

export type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  signin: (email: string, password: string) => Promise<boolean>;
  signout: () => Promise<void>;
  loadUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (password: string, accessToken: string) => Promise<boolean>;
};
