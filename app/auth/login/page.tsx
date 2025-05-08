"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      // 强制重新授权，添加 prompt=consent 参数
      await signIn("github", {
        callbackUrl: "https://v0-wechat-to-dingtalk-lo.vercel.app/wechat-dingtalk-sender",
        // 添加以下参数强制显示 GitHub 授权页面
        authorization: { params: { prompt: "consent" } },
      })
    } catch (err) {
      setError("登录过程中出现错误，请稍后再试")
      setIsLoading(false)
    }
  }

  // 添加清除 GitHub 会话的函数
  const clearGitHubSession = () => {
    // 打开 GitHub 登出页面
    window.open("https://github.com/logout", "_blank")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">微信钉钉群发工具</CardTitle>
          <CardDescription className="text-center">
            请使用 GitHub 账号登录，系统将验证您是否为仓库贡献者
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>登录失败</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleGitHubLogin} className="w-full" disabled={isLoading} size="lg">
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  登录中...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Github className="mr-2 h-5 w-5" />
                  使用 GitHub 登录
                </span>
              )}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                如果您没有看到 GitHub 授权页面，可能是因为您已经授权过此应用
              </p>
              <Button variant="outline" size="sm" onClick={clearGitHubSession}>
                清除 GitHub 会话
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-muted-foreground text-center">只有被授权的仓库贡献者才能访问此工具</p>
        </CardFooter>
      </Card>
    </div>
  )
}
