// authContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { userAPI } from "../utils/api";

// Interface definitions
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Profile {
  id: number;
  user_id: number;
  start_date: string;
  saved_money: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (username: string, password: string) => Promise<void>;
  signup: (
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await refreshUserData();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const [userData, profileData] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getStats(),
      ]);

      setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });

      setProfile({
        id: profileData.id,
        user_id: profileData.user_id,
        start_date: profileData.start_date,
        saved_money: profileData.saved_money,
      });
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    clearAuthError();
    try {
      const response = await fetch(
        "https://staysober.onrender.com/auth/jwt/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const { refresh, access } = await response.json();
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      await refreshUserData();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Login failed");
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string
  ) => {
    clearAuthError();
    try {
      const response = await fetch(
        "https://staysober.onrender.com/auth/users/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
            email,
            first_name: firstname,
            last_name: lastname,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        // Handle password validation errors
        
        if (errorData.username) {
          const usernameErrors = Array.isArray(errorData.username)
            ? errorData.username.join(" ")
            : errorData.username;
          if (usernameErrors.includes("already")) {
            throw new Error("User with this Username already exists.");
          }
          throw new Error(usernameErrors);
        }
        if (errorData.email) {
          const emailErrors = Array.isArray(errorData.email)
            ? errorData.email.join(" ")
            : errorData.email;
          if (emailErrors.includes("already")) {
            throw new Error("User with this email already exists.");
          }
          throw new Error(emailErrors);
        }
        if (errorData.password) {
          const passwordErrors = Array.isArray(errorData.password)
            ? errorData.password.join(" ")
            : errorData.password;

          if (
            passwordErrors.includes("common") ||
            passwordErrors.includes("too common")
          ) {
            throw new Error(
              "Password is too common. Please choose a stronger password."
            );
          }
          throw new Error(passwordErrors);
        }

        throw new Error(errorData.detail || "Signup failed");
      }

      await login(username, password);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      setAuthError(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setProfile(null);
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (!refreshTokenValue) throw new Error("No refresh token");

      const response = await fetch(
        "https://staysober.onrender.com/auth/jwt/refresh",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshTokenValue }),
        }
      );

      if (!response.ok) throw new Error("Token refresh failed");

      const { access } = await response.json();
      localStorage.setItem("accessToken", access);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      await userAPI.updateUser({
        first_name: data.first_name || user?.first_name || "",
        last_name: data.last_name || user?.last_name || "",
        email: data.email || user?.email || "",
      });
      await refreshUserData();
    } catch (error) {
      throw new Error("Failed to update user");
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      await userAPI.updateProfile({
        start_date: data.start_date || profile?.start_date,
        saved_money: data.saved_money || profile?.saved_money,
      });
      await refreshUserData();
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        authError,
        clearAuthError,
        login,
        signup,
        logout,
        refreshToken,
        refreshUserData,
        updateUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
