'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';
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

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 获取授权 URL
      const response = await fetch('/api/auth/login');

      if (!response.ok) {
        throw new Error('获取授权 URL 失败');
      }

      const { authUrl } = await response.json();

      // 重定向到 GitHub 授权页面
      window.location.href = authUrl;
    } catch (err) {
      setError('登录过程中出现错误，请稍后再试');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            微信钉钉群发工具
          </CardTitle>
          <CardDescription className="text-center">
            请使用 GitHub 账号登录，系统将验证您是否为仓库贡献者
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>登录失败</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGitHubLogin}
              className="w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  登录中...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Github className="mr-2 h-5 w-5" />
                  使用 GitHub 登录
                </span>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            只有被授权的仓库贡献者才能访问此工具
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
