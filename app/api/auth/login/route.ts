import { NextResponse } from "next/server"
import { getGitHubAuthUrl } from "@/lib/github-oauth"
import { generateState, setState } from "@/lib/session"

export async function GET() {
  try {
    // 生成随机状态用于防止 CSRF 攻击
    const state = generateState()
    await setState(state)

    // 获取 GitHub 授权 URL
    const authUrl = getGitHubAuthUrl(state)

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error("生成授权 URL 失败:", error)
    return NextResponse.json({ error: "生成授权 URL 失败" }, { status: 500 })
  }
}
