import puppeteer from "puppeteer";

/**
 * 发送钉钉机器人消息
 */
async function sendDingTalkMessage(accessToken: string, messageBody: any) {
  const url = `https://oapi.dingtalk.com/robot/send?access_token=${accessToken}`;

  try {
    alert(`正在发送消息到钉钉机器人...${url}`);
    console.log("正在发送消息到钉钉机器人...");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageBody),
    });
    const result = await response.json();

    if (result.errcode === 0) {
      console.log("✅ 消息发送成功！");
      return true;
    } else {
      console.error(
        `❌ 消息发送失败: ${result.errmsg} (错误码: ${result.errcode})`
      );
      return false;
    }
  } catch (error: any) {
    console.error("发送消息时出错:", error.message);
    throw error;
  }
}

/**
 * 创建markdown类型的钉钉消息
 */
function createMarkdownMessage(title: string, text: string) {
  return {
    msgtype: "markdown",
    markdown: {
      title,
      text,
    },
  };
}

/**
 * 抓取微信公众号文章的标题、封面图和描述（来自 og meta 标签）
 * @param {string} url 微信公众号文章链接
 * @returns {Promise<{title: string, image: string, description: string, url: string}>}
 */
async function extractWeChatArticleInfo(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

  const result = await page.evaluate(() => {
    const getMeta = (prop: any) =>
      document
        .querySelector(`meta[property="${prop}"]`)
        ?.getAttribute("content") || "";

    return {
      title: getMeta("og:title"),
      image: getMeta("og:image"),
      description: getMeta("og:description"),
      author: getMeta("og:article:author"),
      url: window.location.href,
    };
  });

  await browser.close();
  return result;
}

export async function sendWeChatArticleToDingTalk(articleUrl: string, group: any) {
  const { title, image, description, url, author } =
    await extractWeChatArticleInfo(articleUrl);

  //   const markdownText = `
  // **[广播] AntV 数据可视化公众号推文新鲜出炉**

  // ---

  // [![封面图](${image})](${url})

  // **《${title}》**

  // > 作者：${author}

  // ${description}

  // ---

  // [向右][点击阅读原文](${url})
  // `;

  // const message = createMarkdownMessage("AntV 推文通知", markdownText);
  // const result = await sendDingTalkMessage(group.accessToken, message);
  return true;
}
