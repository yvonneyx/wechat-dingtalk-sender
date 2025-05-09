import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">页面未找到</CardTitle>
          <CardDescription className="text-center">您请求的错误页面不存在</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">这可能是由于 URL 错误或系统配置问题导致的。</p>
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
