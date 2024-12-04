import { ServerSubmitForm } from '@/components/ServerSubmitForm';

export default function SubmitPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Submit Your MCP Server</h1>
      
      <div className="max-w-2xl">
        <ServerSubmitForm />
      </div>
    </div>
  );
} 