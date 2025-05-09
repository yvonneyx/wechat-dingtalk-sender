import { redirect } from 'next/navigation';

export default function Home() {
  console.log('redirecting to wdchat-dingtalk-sender');
  redirect('/wechat-dingtalk-sender');
}
