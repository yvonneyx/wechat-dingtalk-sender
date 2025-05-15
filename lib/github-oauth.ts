// GitHub OAuth 配置
export const GITHUB_CLIENT_ID = process.env.GITHUB_ID || ""
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_SECRET || ""
export const REDIRECT_URI = process.env.REDIRECT_URI || ""

// 生成 GitHub 授权 URL
export function getGitHubAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "read:user repo",
    state,
    allow_signup: "true",
  })

  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

// 获取访问令牌
export async function getAccessToken(code: string) {
  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("获取访问令牌失败:", error)
    return null
  }
}

// 获取用户信息
export async function getUserInfo(accessToken: string) {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "WeChatDingTalkSender",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API 错误: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取用户信息失败:", error)
    return null
  }
}

// 检查用户是否为仓库贡献者（已弃用，使用 hasRepoWritePermission 替代）
export async function isRepoContributor(accessToken: string, username: string, repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/contributors`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "WeChatDingTalkSender",
      },
    })

    if (!response.ok) {
      console.error("GitHub API 错误:", await response.text())
      return false
    }

    const contributors = await response.json()
    return contributors.some((contributor: any) => contributor.login.toLowerCase() === username.toLowerCase())
  } catch (error) {
    console.error("验证贡献者时出错:", error)
    return false
  }
}

// 检查用户是否有仓库的写入权限
export async function hasRepoWritePermission(accessToken: string, username: string, repo: string) {
  try {
    // 获取用户对仓库的权限
    const response = await fetch(`https://api.github.com/repos/${repo}/collaborators/${username}/permission`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "WeChatDingTalkSender",
      },
    })

    if (!response.ok) {
      console.error("GitHub API 错误:", await response.text())
      return false
    }

    const permission = await response.json()
    console.log("用户权限信息:", JSON.stringify(permission))
    // 检查权限是否为 write、admin 或 maintain（这些都包含写入权限）
    return ['write', 'admin', 'maintain'].includes(permission.permission)
  } catch (error) {
    console.error("验证写入权限时出错:", error)
    return false
  }
}
