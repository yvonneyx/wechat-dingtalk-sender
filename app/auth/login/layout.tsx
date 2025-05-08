import type React from "react"
import { DebugAuth } from "@/components/debug-auth"
import { SessionProvider } from "@/components/session-provider"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <DebugAuth />
    </SessionProvider>
  )
}
