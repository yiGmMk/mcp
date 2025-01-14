"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ServerCard } from "../ServerCard";
import type { MCPServer } from "@/types/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FeaturedServers() {
  const t = useTranslations("Servers");
  const { locale } = useParams();
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServers() {
      setLoading(true);
      try {
        // 获取前3个服务器作为精选
        const res = await fetch(`/api/servers/${locale}?pageSize=6`);
        const data = await res.json();
        setServers(data);
      } catch (error) {
        console.error("Failed to fetch featured servers:", error);
      }
      setLoading(false);
    }

    fetchServers();
  }, [locale]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/servers">
              {t("viewAll")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
