'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Github } from 'lucide-react';
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

export function PermissionCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [permissionState, setPermissionState] = useState<{
    isChecking: boolean;
    isAuthorized: boolean;
    message: string;
    repo: string;
    user: any;
  }>({
    isChecking: true,
    isAuthorized: false,
    message: '',
    repo: '',
    user: null,
  });

  useEffect(() => {
    async function checkPermission() {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          // 未认证，重定向到登录页面
          router.push("/auth/login")
          return
        }

        const data = await response.json();
        setPermissionState({
          isChecking: false,
          isAuthorized: data.isAuthorized,
          message: data.isAuthorized ? '授权成功' : '您不是该仓库的贡献者',
          repo: data.repo || '',
          user: data.user,
        });
      } catch (error) {
        setPermissionState({
          isChecking: false,
          isAuthorized: false,
          message: '权限检查失败，请刷新页面重试',
          repo: '',
          user: null,
        });
      }
    }

    checkPermission();
  }, [router]);

  if (permissionState.isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-sm text-muted-foreground">正在验证权限...</p>
        </div>
      </div>
    );
  }

  if (!permissionState.isAuthorized) {
    return (
      <div className="container max-w-md py-10">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-center">
              访问受限
            </CardTitle>
            <CardDescription className="text-center">
              您没有访问此应用的权限
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>权限不足</AlertTitle>
              <AlertDescription>{permissionState.message}</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <p className="text-sm text-center">
                您已使用 GitHub 账号{' '}
                <strong>{permissionState.user?.login}</strong>{' '}
                登录，但您不是仓库 <strong>{permissionState.repo}</strong>{' '}
                的贡献者。
              </p>
              <p className="text-sm text-center text-muted-foreground">
                请联系仓库管理员将您添加为贡献者，或使用有权限的 GitHub
                账号登录。
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <a
                href={`https://github.com/${permissionState.repo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                访问 GitHub 仓库
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
