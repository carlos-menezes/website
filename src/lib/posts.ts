import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type TPost = {
  id: string;
  title: string;
  date: Date;
  [key: string]: unknown;
};

const postsDirectory = path.join(process.cwd(), "posts");

export const getAllPostsFrontmatter = (): TPost[] => {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: TPost[] = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as Record<string, unknown>),
    } as TPost;
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
};
