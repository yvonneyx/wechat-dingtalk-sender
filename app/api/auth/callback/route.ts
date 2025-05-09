import { NextResponse } from "next/server"
import { getAccessToken, getUserInfo, isRepoContributor } from "@/lib/github-oauth"
import { verifyState, setSession } from "@/lib/session"
import { GITHUB_REQUIRED_REPO } from "@/constants"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    // 验证状态参数，防止 CSRF 攻击
    if (!state || !verifyState(state)) {
      return NextResponse.redirect(new URL("/auth/error?error=InvalidState", request.url))
    }

    // 验证授权码
    if (!code) {
      return NextResponse.redirect(new URL("/auth/error?error=NoCode", request.url))
    }

    // 获取访问令牌
    const accessToken = await getAccessToken(code)
    if (!accessToken) {
      return NextResponse.redirect(new URL("/auth/error?error=AccessTokenError", request.url))
    }

    // 获取用户信息
    const userInfo = await getUserInfo(accessToken)
    if (!userInfo) {
      return NextResponse.redirect(new URL("/auth/error?error=UserInfoError", request.url))
    }

    // 检查用户是否为仓库贡献者
    const isContributor = await isRepoContributor(accessToken, userInfo.login, GITHUB_REQUIRED_REPO)

    // 设置会话
    setSession({
      user: {
        id: userInfo.id,
        login: userInfo.login,
        name: userInfo.name,
        email: userInfo.email,
        avatar_url: userInfo.avatar_url,
      },
      accessToken,
      isAuthorized: isContributor,
      repo: GITHUB_REQUIRED_REPO,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24小时后过期
    })

    // 重定向到应用主页
    return NextResponse.redirect(new URL("/wechat-dingtalk-sender", request.url))
  } catch (error) {
    console.error("GitHub 回调处理失败:", error)
    return NextResponse.redirect(new URL("/auth/error?error=CallbackError", request.url))
  }
}
