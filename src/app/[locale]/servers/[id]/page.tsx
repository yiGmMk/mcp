import { ServerDetails } from '@/components/ServerDetails';


// 每小时重新生成页面
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
}


export default async function ServerDetailPage({
  params}: PageProps) {

  const { id } = await params;

  return (
    <div className="container mx-auto py-8">
      <ServerDetails id={id} />
    </div>
  );
} 