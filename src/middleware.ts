import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { searchParams, pathname } = req.nextUrl;

  // 客戶連結（有 ?c= token）→ 不需要 admin 驗證
  if (searchParams.get('c')) return NextResponse.next();

  // 檢查 admin cookie
  const session = req.cookies.get('admin_session')?.value;
  if (session && session === process.env.ADMIN_PASSWORD) return NextResponse.next();

  // 未登入 → 跳登入頁
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/script', '/script/:path*'],
};
