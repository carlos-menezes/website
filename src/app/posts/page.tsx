import { getSortedPostsMetadata } from "@/lib/posts";
import { Flex, Heading, Link, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts - Carlos Menezes",
};

export default function Page() {
  const posts = getSortedPostsMetadata();

  return (
    <Flex direction="column" gap="4">
      <Flex direction="column">
        <Heading size="4">Posts</Heading>
        <Text size="3">
          Collections of thoughts on various topics. View{" "}
          <Link href="/tags">all tags</Link> for a more refined search.
        </Text>
      </Flex>
      {posts.length ? (
        posts.map(({ id, frontmatter: { date, title } }, i) => (
          <Flex direction="column" key={i}>
            <Text size="2">{format(date, "LLL dd, y")}</Text>
            <Heading size="3" weight="bold">
              <Link href={`post/${id}`}>{title}</Link>
            </Heading>
          </Flex>
        ))
      ) : (
        <Text size="3">No posts yet.</Text>
      )}
    </Flex>
  );
}
