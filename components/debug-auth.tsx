"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DebugAuth() {
  const { data: session, status } = useSession()
  const [showDebug, setShowDebug] = useState(false)

  const clearAllCookies = () => {
    // 获取所有 cookie
    const cookies = document.cookie.split(";")

    // 删除每个 cookie
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    }

    // 刷新页面
    window.location.reload()
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" })
  }

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button variant="outline" size="sm" onClick={() => setShowDebug(true)}>
          调试信息
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">认证调试信息</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
              关闭
            </Button>
          </div>
          <CardDescription className="text-xs">状态: {status}</CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          {session ? (
            <div className="text-xs space-y-2 max-h-40 overflow-auto">
              <p>
                <strong>用户名:</strong> {session.user?.name}
              </p>
              <p>
                <strong>邮箱:</strong> {session.user?.email}
              </p>
              <p>
                <strong>令牌:</strong> {session.user?.accessToken ? "已获取" : "未获取"}
              </p>
              <details>
                <summary className="cursor-pointer">查看完整会话数据</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-[10px] overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <Alert>
              <AlertDescription className="text-xs">未登录或会话已过期</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between py-2">
          <Button variant="destructive" size="sm" onClick={clearAllCookies}>
            清除所有 Cookie
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            登出
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
