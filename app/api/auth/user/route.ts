import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 })
  }

  return NextResponse.json({
    user: session.user,
    isAuthorized: session.isAuthorized,
    repo: session.repo,
  })
}
