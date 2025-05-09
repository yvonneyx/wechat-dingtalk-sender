import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// import { getSession } from "@/lib/session"

export async function middleware(request: NextRequest) {
  // 获取会话
  // const session = await getSession()
  // const isAuthenticated = !!session && session.expiresAt > Date.now()
  // console.log('session', session)
  // 如果用户访问的是受保护的路径且未认证，重定向到登录页面
  if (
    // !isAuthenticated &&
    request.nextUrl.pathname.startsWith("/wechat-dingtalk-sender") &&
    !request.nextUrl.pathname.includes("/_next") &&
    !request.nextUrl.pathname.includes("/api/")
  ) {
    // return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api 路由 (用于认证API)
     * - 静态文件 (_next)
     * - 认证相关页面 (/auth/*)
     */
    "/((?!api|_next|auth).*)",
  ],
}
