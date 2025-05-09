import { NextResponse } from "next/server"
import { deleteSession } from "@/lib/session"

export async function POST() {
  // 删除会话
  await deleteSession()

  return NextResponse.json({ success: true })
}
