import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AuthStatus } from "@/components/auth-status"
import { SessionProvider } from "@/components/session-provider"
import { PermissionCheck } from "@/components/permission-check"

export default async function WeChatDingTalkSenderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 检查用户是否已登录
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between h-14">
            <h1 className="text-lg font-semibold">微信文章钉钉群发工具</h1>
            <AuthStatus />
          </div>
        </header>
        <main className="flex-1">
          <PermissionCheck>{children}</PermissionCheck>
        </main>
      </div>
    </SessionProvider>
  )
}
