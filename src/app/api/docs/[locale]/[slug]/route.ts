import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { NextResponse } from "next/server";

const docsDirectory = join(process.cwd(), "docs");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string, slug: string }> }
) {
  try {
    const { locale, slug } = await params;
    const fullPath = join(docsDirectory, locale, `${slug}.md`);

    let fileContents: string;
    try {
      fileContents = readFileSync(fullPath, "utf8");
    } catch (error) {
      // 如果找不到对应语言的文档，尝试使用英文文档
      if (locale !== "en") {
        const enPath = join(docsDirectory, "en", `${slug}.md`);
        console.log("Fallback to English:", enPath);
        fileContents = readFileSync(enPath, "utf8");
      } else {
        throw error;
      }
    }

    const { data, content } = matter(fileContents);

    // 如果只请求元数据（不包含 content 参数）
    const searchParams = new URL(request.url).searchParams;
    if (!searchParams.has('content')) {
      return NextResponse.json({
        title: data.title,
        description: data.description,
        section: data.section,
        prev: data.prev,
        next: data.next,
      });
    }

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return NextResponse.json({
      title: data.title,
      description: data.description,
      section: data.section,
      prev: data.prev,
      next: data.next,
      content: contentHtml,
    });
  } catch (error) {
    console.error("Error loading document:", error);
    return NextResponse.json(
      { error: "Failed to load document" },
      { status: 404 }
    );
  }
}
