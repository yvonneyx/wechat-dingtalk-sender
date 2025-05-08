"use client"

import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

const errorMessages: Record<string, { title: string; description: string }> = {
  AccessDenied: {
    title: "访问被拒绝",
    description: "您不是指定仓库的贡献者，无法访问此应用。",
  },
  AccessTokenError: {
    title: "认证失败",
    description: "无法获取 GitHub 访问令牌，请重试。",
  },
  Default: {
    title: "认证错误",
    description: "登录过程中出现错误，请重试。",
  },
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const errorType = searchParams.get("error") || "Default"

  const errorInfo = errorMessages[errorType] || errorMessages.Default

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">认证失败</CardTitle>
          <CardDescription className="text-center">无法完成 GitHub 认证</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{errorInfo.title}</AlertTitle>
            <AlertDescription>{errorInfo.description}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              如果您认为这是一个错误，请联系仓库管理员添加您为贡献者，或检查您是否使用了正确的 GitHub 账号登录。
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/auth/login">返回登录页面</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
