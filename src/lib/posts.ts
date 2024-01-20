import fs from "fs";
import matter from "gray-matter";
import path from "path";

const POSTS_DIRECTORY = path.join(process.cwd(), "posts");

export type Metadata = {
  id: string;
  frontmatter: Frontmatter;
};

export type Frontmatter = {
  title: string;
  date: string;
  tags?: Array<string>;
};

export const getSortedPostsMetadata = (): Array<Metadata> => {
  const fileNames = fs.readdirSync(POSTS_DIRECTORY);

  const posts: Array<Metadata> = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const postMarkdown = getPostMarkdown(id);
    return { id, frontmatter: postMarkdown.data };
  });

  const sortedPosts = posts.sort((a, b) =>
    new Date(a.frontmatter.date) > new Date(b.frontmatter.date) ? -1 : 1
  );
  return sortedPosts;
};

export const getPostMarkdown = (id: string) => {
  const fullPath = path.join(POSTS_DIRECTORY, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const parsedContent = matter(fileContents);
  return { ...parsedContent, data: parsedContent.data as Frontmatter };
};

export const getSortedPostsByTag = (tag: string) => {
  const posts = getSortedPostsMetadata();
  return posts.filter((post) => post.frontmatter.tags?.includes(tag));
};

export const getAllTags = () => {
  const posts = getSortedPostsMetadata();
  const tags = posts.flatMap((post) => post.frontmatter.tags ?? []);
  return [...new Set(tags)];
};
