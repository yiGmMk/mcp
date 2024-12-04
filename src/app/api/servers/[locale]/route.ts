import { NextResponse } from 'next/server';
import { getServers } from '@/lib/servers';
import type { ServerSearchParams } from '@/types/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const { searchParams } = new URL(request.url);
  const p = Object.fromEntries(searchParams) as unknown as ServerSearchParams;
  
  let servers = await getServers(locale);

  // 关键词搜索
  if (p.keyword) {
    const keyword = p.keyword.toLowerCase();
    servers = servers.filter(server => 
      server.name.toLowerCase().includes(keyword) ||
      server.description.toLowerCase().includes(keyword) ||
      server.digest.toLowerCase().includes(keyword)
    );
  }

  // 标签过滤
  if (p.tags?.length) {
    // 确保 p.tags 是数组，并且服务器包含所有选中的标签
    const tags = Array.isArray(p.tags) ? p.tags : [p.tags];
    servers = servers.filter(server =>
      tags.every(tag => server.tags.includes(tag))
    );
  }

  // 分页
  const page = p.page || 1;
  const pageSize = p.pageSize || 10;
  const start = (page - 1) * pageSize;
  const paginatedServers = servers.slice(start, start + pageSize);

  return NextResponse.json(paginatedServers);
}
