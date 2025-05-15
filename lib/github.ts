// 检查用户是否为指定仓库的贡献者（已弃用，使用 hasRepoWritePermission 替代）
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
    // 检查权限是否为 write、admin 或 maintain（这些都包含写入权限）
    return ['write', 'admin', 'maintain'].includes(permission.permission)
  } catch (error) {
    console.error("验证写入权限时出错:", error)
    return false
  }
}

// 获取用户的 GitHub 信息
export async function getGitHubUserInfo(accessToken: string) {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "WeChatDingTalkSender",
      },
    })

    if (!response.ok) {
      console.error("获取 GitHub 用户信息失败:", await response.text())
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("获取 GitHub 用户信息时出错:", error)
    return null
  }
}
