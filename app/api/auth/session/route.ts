import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()
    return NextResponse.json({ session })
  } catch (error) {
    console.error("获取 session 失败:", error)
    return NextResponse.json({ error: "获取 session 失败" }, { status: 500 })
  }
}
