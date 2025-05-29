import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "@/types/interfaces"
import { login } from "@/services/auth"

interface AuthState {
  // basic payload
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  clearUser: () => void

  // function
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),

      login: async (username, password) => {
        const response = await login(username, password)
        if (response.data) {
          const user: User = response.data
          set({ user, isAuthenticated: true })
        }
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user
          ? {
              userId: state.user.id,
              username: state.user.username,
              email: state.user.email,
              profilePicture: state.user.profilePicture,
            }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
