import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

const docsDirectory = join(process.cwd(), "docs");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  try {
    const { locale } = await params;
    const localeDir = join(docsDirectory, locale);

    // 如果找不到对应语言的目录，使用英文目录
    const targetDir = readdirSync(localeDir, { withFileTypes: true }).length > 0
      ? localeDir
      : join(docsDirectory, "en");

    const files = readdirSync(targetDir, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith(".md"))
      .map(dirent => {
        const fullPath = join(targetDir, dirent.name);
        const fileContents = readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);
        const slug = dirent.name.replace(/\.md$/, "");
        
        return {
          slug,
          title: data.title,
          description: data.description,
          section: data.section,
          prev: data.prev,
          next: data.next,
          pubDate: data.pubDate,
        };
      })
      .sort((a, b) => {
        // 按发布日期升序排序
        return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
      });

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error loading documents:", error);
    return NextResponse.json(
      { error: "Failed to load documents" },
      { status: 500 }
    );
  }
}
