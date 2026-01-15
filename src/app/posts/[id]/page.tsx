import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownAsync } from "react-markdown";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { getAllPostsFrontmatter, type TPost } from "@/lib/posts";

type Props = {
  params: Promise<{ id: string }>;
};

// This generates static params at build time
export async function generateStaticParams() {
  const posts = getAllPostsFrontmatter();

  return posts.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { authors } = await parent;
  const { id } = await params;
  const postsDirectory = path.join(process.cwd(), "posts");
  const fullPath = path.join(postsDirectory, `${id}.md`);

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);
  const frontmatter = data as TPost;

  return {
    authors,
    title: `${frontmatter.title} ✦ Carlos Menezes`,
    openGraph: {
      type: "article",
      title: frontmatter.title,
      publishedTime: frontmatter.date.toISOString(),
      images: [
        {
          url: `https://carlos-menezes.com/api/og?title=${frontmatter.title}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Get the post content
  const postsDirectory = path.join(process.cwd(), "posts");
  const fullPath = path.join(postsDirectory, `${id}.md`);

  if (!fs.existsSync(fullPath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as TPost;

  return (
    <article className="space-y-4">
      <div>
        <h1 className="font-semibold">{frontmatter.title}</h1>
        <time className="text-white/60 whitespace-nowrap shrink-0 font-mono">
          {frontmatter.date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </time>
      </div>
      <p>✦</p>
      <div className="space-y-2 normal-case">
        <MarkdownAsync
          remarkPlugins={[remarkGfm, remarkMdx]}
          rehypePlugins={[rehypeRaw, rehypeSlug, rehypePrettyCode]}
          remarkRehypeOptions={{ allowDangerousHtml: true }}
        >
          {content}
        </MarkdownAsync>
      </div>
    </article>
  );
}
