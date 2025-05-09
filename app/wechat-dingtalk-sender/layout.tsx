import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { AuthStatus } from '@/components/auth-status';
import { PermissionCheck } from '@/components/permission-check';

export default async function WeChatDingTalkSenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 检查用户是否已登录
  const session = await getSession();

  if (!session || session.expiresAt < Date.now()) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white" style={{ justifyItems: 'center' }}>
        <div className="container flex items-center justify-between h-14 ">
          <h1 className="text-lg font-semibold">微信文章钉钉群发工具</h1>
          <AuthStatus />
        </div>
      </header>
      <main className="flex-1 mt-20" style={{ justifyItems: 'center' }}>
        <PermissionCheck>{children}</PermissionCheck>
      </main>
    </div>
  );
}
