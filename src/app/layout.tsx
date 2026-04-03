import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AdScript.AI',
  description: '影片腳本 × 分鏡管理工具',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
