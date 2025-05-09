import { cookies } from "next/headers"
import { encrypt, decrypt } from "./crypto"

// 会话数据类型
export interface SessionData {
  user: {
    id: number
    login: string
    name: string | null
    email: string | null
    avatar_url: string | null
  }
  accessToken: string
  isAuthorized: boolean
  repo?: string
  expiresAt: number
}

// 设置会话
export async function setSession(data: SessionData) {
  const cookieStore = await cookies()
  const encryptedData = encrypt(JSON.stringify(data))

  cookieStore.set("session", encryptedData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 24小时
    path: "/",
    sameSite: "lax",
  })
}

// 获取会话
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const decryptedData = decrypt(sessionCookie.value)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error("解析会话数据失败:", error)
    return null
  }
}

// 删除会话
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
}

// 生成随机状态
export function generateState() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 设置状态
export async function setState(state: string) {
  const cookieStore = await cookies()
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60, // 10分钟
    path: "/",
  })
}

// 获取并验证状态
export async function verifyState(state: string) {
  const cookieStore = await cookies()
  const stateCookie = cookieStore.get("oauth_state")

  if (!stateCookie) {
    return false
  }

  // 验证后删除状态 cookie
  cookieStore.set("oauth_state", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })

  return stateCookie.value === state
}
