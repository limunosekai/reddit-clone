import create from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "../types";

type AuthState = {
  authenticated: boolean;
  user: User | null;
};

type AuthAction = {
  handleLogin: (user: User) => void;
  handleLogout: () => void;
};

type AuthStore = AuthState & AuthAction;

const INITIAL_STATE: AuthState = {
  authenticated: false,
  user: null,
};

const authStore = (set: any) => ({
  ...INITIAL_STATE,
  handleLogin: (userData: User) =>
    set(() => ({ authenticated: true, user: userData })),
  handleLogout: () => set(() => ({ ...INITIAL_STATE })),
});

const useAuthStore = create<AuthStore>()(devtools(authStore));

export default useAuthStore;
