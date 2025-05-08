// 检查用户是否为指定仓库的贡献者
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
