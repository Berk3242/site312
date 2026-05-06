"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface UserProgress {
  grade: number;
  topic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  date: string;
}

export interface User {
  username: string;
  avatar: string;
  createdAt: string;
  totalScore: number;
  gamesPlayed: number;
  progress: UserProgress[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateProgress: (progress: UserProgress) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const AVATARS = [
  "Aslan",
  "Kartal",
  "Panda",
  "Yunus",
  "Kelebek",
  "Baykus",
  "Tilki",
  "Tavsan",
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("mathgame_user");
    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("mathgame_user");
      }
    }
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("mathgame_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("mathgame_user");
    }
  };

  const updateProgress = (progress: UserProgress) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      totalScore: user.totalScore + progress.score,
      gamesPlayed: user.gamesPlayed + 1,
      progress: [...user.progress, progress],
    };
    setUser(updatedUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateProgress,
        isLoggedIn: !!user,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export { AVATARS };
