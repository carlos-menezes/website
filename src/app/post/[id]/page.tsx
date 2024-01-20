import {
  Frontmatter,
  getSortedPostsMetadata,
  getPostMarkdown,
} from "@/lib/posts";
import { Box, Flex, Link, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import { Metadata } from "next";
import Markdown, { Components } from "react-markdown";

type PageParams = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const posts = getSortedPostsMetadata();

  return posts.map(({ id }) => ({
    slug: id,
  }));
}

export async function generateMetadata({ params }: PageParams) {
  const post = getPostMarkdown(params.id);
  const data = post.data;

  return {
    title: `${data.title} - Carlos Menezes`,
  };
}

export default async function Page({ params }: PageParams) {
  const { id } = params;
  const markdown = getPostMarkdown(id);
  const data = markdown.data as Frontmatter;

  const components: Components = {
    p: (props) => <Text size="3">{props.children}</Text>,
    li: (props) => (
      <li>
        <Text size="3">{props.children}</Text>
      </li>
    ),
  };

  return (
    <Flex direction="column" gap="4">
      <Flex direction="column">
        <Text size="2">{format(data.date, "LLL dd, y")}</Text>
        <Text size="6" weight="bold">
          {data.title}
        </Text>
      </Flex>
      <Box>
        <Markdown components={components}>{markdown.content}</Markdown>
      </Box>
      {data.tags && (
        <Text size="3">
          Tags:{" "}
          {data.tags.map((tag, i) => (
            <>
              <Link key={tag} href={`/tags#${tag}`}>
                <Text size="3">{tag}</Text>
              </Link>
              {data.tags && i !== data.tags.length - 1 && (
                <Text size="3">,</Text>
              )}{" "}
            </>
          ))}
        </Text>
      )}
    </Flex>
  );
}
