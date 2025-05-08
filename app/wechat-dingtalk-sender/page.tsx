"use client"

import type React from "react"

import { useState } from "react"
import { SendHorizontal, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 模拟钉钉群组数据
const dingGroups = [
  { id: "group1", name: "产品团队" },
  { id: "group2", name: "技术团队" },
  { id: "group3", name: "市场团队" },
  { id: "group4", name: "销售团队" },
  { id: "group5", name: "管理层" },
]

export default function WeChatDingTalkSender() {
  const [wechatUrl, setWechatUrl] = useState("")
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<
    {
      groupId: string
      groupName: string
      success: boolean
      message: string
    }[]
  >([])
  const [error, setError] = useState("")

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const handleSelectAll = () => {
    if (selectedGroups.length === dingGroups.length) {
      setSelectedGroups([])
    } else {
      setSelectedGroups(dingGroups.map((group) => group.id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证输入
    if (!wechatUrl) {
      setError("请输入微信公众号文章链接")
      return
    }

    if (selectedGroups.length === 0) {
      setError("请至少选择一个钉钉群组")
      return
    }

    // 清除之前的错误和结果
    setError("")
    setIsLoading(true)

    try {
      // 模拟发送到钉钉群的过程
      const newResults = await Promise.all(
        selectedGroups.map(async (groupId) => {
          // 模拟API调用延迟
          await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

          // 随机成功或失败（80%成功率）
          const success = Math.random() > 0.2
          const group = dingGroups.find((g) => g.id === groupId)!

          return {
            groupId,
            groupName: group.name,
            success,
            message: success ? "发送成功" : "发送失败，请重试",
          }
        }),
      )

      setResults(newResults)
    } catch (err) {
      setError("发送过程中出现错误，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>微信文章钉钉群发工具</CardTitle>
          <CardDescription>输入微信公众号文章链接，选择要发送的钉钉群组</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wechat-url">微信公众号文章链接</Label>
                <Input
                  id="wechat-url"
                  placeholder="https://mp.weixin.qq.com/s/..."
                  value={wechatUrl}
                  onChange={(e) => setWechatUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>选择钉钉群组</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedGroups.length === dingGroups.length ? "取消全选" : "全选"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {dingGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={group.id}
                        checked={selectedGroups.includes(group.id)}
                        onCheckedChange={() => handleGroupToggle(group.id)}
                      />
                      <Label htmlFor={group.id}>{group.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>错误</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
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
                    发送中...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <SendHorizontal className="mr-2 h-4 w-4" />
                    发送到钉钉群
                  </span>
                )}
              </Button>
            </div>
          </form>

          {results.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">发送结果</h3>
              <div className="space-y-2 text-xs">
                {results.map((result) => (
                  <div
                    key={result.groupId}
                    className={`p-3 rounded-md flex items-center justify-between ${
                      result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      {result.success ? (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>{result.groupName}</span>
                    </div>
                    <span className={result.success ? "text-green-600" : "text-red-600"}>{result.message}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm">
                  <span>总计：{results.length}个群组</span>
                  <span>
                    成功：{results.filter((r) => r.success).length}， 失败：{results.filter((r) => !r.success).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <p>提示：请确保微信文章链接有效且可公开访问</p>
        </CardFooter>
      </Card>
    </div>
  )
}
