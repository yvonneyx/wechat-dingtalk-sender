import { sendWeChatArticleToDingTalk } from "@/lib/dingtalk-send";
import { NextResponse } from "next/server";
import { dingGroups } from "@/constants";

export async function POST(request: Request) {
  const { articleUrl, groupId } = await request.json();

  const group = dingGroups.find((g) => g.id === groupId)!;
  const result = await sendWeChatArticleToDingTalk(articleUrl, group);

  return NextResponse.json({ success: result });
}
