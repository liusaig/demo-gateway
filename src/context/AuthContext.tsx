import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'demo_gateway_authenticated'

function getStoredAuth(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function setStoredAuth(authenticated: boolean) {
  try {
    if (authenticated) {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

/** 站点密码：可通过环境变量 VITE_SITE_PASSWORD 配置，未设置时使用下方默认密码 */
const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD ?? 'Gw@2025-Demo!'

type AuthContextValue = {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredAuth)

  useEffect(() => {
    setIsAuthenticated(getStoredAuth())
  }, [])

  const login = useCallback((password: string): boolean => {
    if (password === SITE_PASSWORD) {
      setStoredAuth(true)
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setStoredAuth(false)
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
