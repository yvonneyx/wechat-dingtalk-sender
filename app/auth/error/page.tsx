'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

const errorMessages: Record<string, { title: string; description: string }> = {
  AccessDenied: {
    title: '访问被拒绝',
    description: '您不是指定仓库的贡献者，无法访问此应用。',
  },
  AccessTokenError: {
    title: '认证失败',
    description: '无法获取 GitHub 访问令牌，请重试。',
  },
  Verification: {
    title: '验证失败',
    description: '无法验证您的请求，请重试。',
  },
  OAuthSignin: {
    title: 'OAuth 签名错误',
    description: '启动 OAuth 流程时出错，请重试。',
  },
  OAuthCallback: {
    title: 'OAuth 回调错误',
    description: '处理 OAuth 回调时出错，请重试。',
  },
  OAuthCreateAccount: {
    title: '创建账号错误',
    description: '无法创建关联的 OAuth 账号，请重试。',
  },
  EmailCreateAccount: {
    title: '创建账号错误',
    description: '无法创建关联的电子邮件账号，请重试。',
  },
  Callback: {
    title: '回调错误',
    description: 'OAuth 回调过程中出错，请重试。',
  },
  OAuthAccountNotLinked: {
    title: '账号未关联',
    description: '此电子邮件已经与另一个账号关联，请使用原始提供商登录。',
  },
  EmailSignin: {
    title: '邮件发送失败',
    description: '无法发送验证邮件，请检查您的邮箱地址。',
  },
  CredentialsSignin: {
    title: '登录失败',
    description: '登录信息无效，请检查您提供的详细信息。',
  },
  SessionRequired: {
    title: '需要登录',
    description: '您需要登录才能访问此页面。',
  },
  Default: {
    title: '认证错误',
    description: '登录过程中出现错误，请重试。',
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<string>('Default');

  useEffect(() => {
    // 获取错误类型参数
    const error = searchParams.get('error');
    if (error) {
      setErrorType(error);
      // 记录错误信息到控制台，帮助调试
      console.error(`Auth error page: ${error}`);
    }
  }, [searchParams]);

  const errorInfo = errorMessages[errorType] || errorMessages.Default;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            认证失败
          </CardTitle>
          <CardDescription className="text-center">
            无法完成 GitHub 认证
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{errorInfo.title}</AlertTitle>
            <AlertDescription>{errorInfo.description}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              如果您认为这是一个错误，请联系仓库管理员添加您为贡献者，或检查您是否使用了正确的
              GitHub 账号登录。
            </p>

            <div className="p-3 bg-gray-50 rounded-md text-xs">
              <p className="font-semibold mb-1">调试信息：</p>
              <p>错误类型: {errorType}</p>
              <p>时间: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/auth/login">返回登录页面</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
