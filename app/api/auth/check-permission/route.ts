import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isRepoContributor } from "@/lib/github"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ isAuthorized: false, message: "未登录" }, { status: 401 })
    }

    const { name, accessToken } = session.user

    if (!name || !accessToken) {
      return NextResponse.json({ isAuthorized: false, message: "缺少用户信息或访问令牌" }, { status: 400 })
    }

    const requiredRepo = process.env.GITHUB_REQUIRED_REPO

    if (!requiredRepo) {
      return NextResponse.json({ isAuthorized: false, message: "未配置仓库" }, { status: 500 })
    }

    // 检查用户是否为仓库贡献者
    const isContributor = await isRepoContributor(accessToken, name, requiredRepo)

    return NextResponse.json({
      isAuthorized: isContributor,
      repo: requiredRepo,
      message: isContributor ? "授权成功" : "您不是该仓库的贡献者",
    })
  } catch (error) {
    console.error("权限检查出错:", error)
    return NextResponse.json({ isAuthorized: false, message: "权限检查失败" }, { status: 500 })
  }
}
