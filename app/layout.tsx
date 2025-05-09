import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '微信文章钉钉群发工具',
  description: 'Created by yvonneyx',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
