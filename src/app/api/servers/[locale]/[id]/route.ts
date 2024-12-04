import { NextResponse } from 'next/server';
import { getServer } from '@/lib/servers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string, id: string }> }
) {
  const { locale, id } = await params;
  
  const server = await getServer(id, locale);
  
  if (!server) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.json(server);
} 