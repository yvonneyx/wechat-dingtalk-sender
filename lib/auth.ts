import type { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: "Ov23liPlU2l5WrvmamLj",
      clientSecret: "d6a6c7a73ed04f97fdbbaeab44a1785beac4a125",
      authorization: {
        params: {
          // 添加 prompt=consent 参数强制显示授权页面
          prompt: "consent",
          scope: "read:user repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // 将 GitHub 访问令牌添加到 JWT 中，以便后续使用
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // 将访问令牌添加到会话中，以便在客户端使用
      if (session.user) {
        ;(session.user as any).accessToken = token.accessToken
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24小时
  },
  // 禁用自动登录
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60, // 24小时
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
}
