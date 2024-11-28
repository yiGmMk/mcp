import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // 其他配置项
}

export default withNextIntl(nextConfig)
