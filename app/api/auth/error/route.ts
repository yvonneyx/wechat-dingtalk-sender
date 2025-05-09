import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get("error") || "Default"

  // 记录错误信息
  console.error(`Auth error: ${error}`)

  // 重定向到错误页面
  return NextResponse.redirect(new URL(`/auth/error?error=${error}`, request.url))
}
