import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/servers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  // 从 URL 路径中获取 locale
  const { locale } = await params;
  
  const tags = await getAllTags(locale);
  return NextResponse.json(tags);
} 