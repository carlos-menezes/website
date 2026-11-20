import fs from "node:fs";
import path from "node:path";
import { format } from "date-fns";
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
        <p>{frontmatter.title} </p>
        <p className="text-muted-foreground">
          {format(frontmatter.date, "MMMM dd, yyyy")}
        </p>
      </div>
      <MarkdownAsync
        remarkPlugins={[remarkGfm, remarkMdx]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypePrettyCode]}
        remarkRehypeOptions={{ allowDangerousHtml: true }}
      >
        {content}
      </MarkdownAsync>
    </article>
  );
}
