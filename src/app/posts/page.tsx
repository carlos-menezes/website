import { getSortedPostsMetadata } from "@/lib/posts";
import { Flex, Heading, Link, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "Posts - Carlos Menezes",
};

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
});

export default function Page() {
  const posts = getSortedPostsMetadata();

  return (
    <Flex direction="column" gap="3">
      <Text size="3">
        Collections of thoughts on various topics. View{" "}
        <Link href="/tags">all tags</Link> for a more refined search.
      </Text>
      {posts.length ? (
        posts.map(({ id, frontmatter: { date, title, tags } }, i) => (
          <Flex key={i} gap="5" align="center" width="100%">
            <Text size="2">{format(date, "LLL dd, y")}</Text>
            <Text size="3" style={{ flexGrow: 1 }}>
              <Link href={`post/${id}`}>{title}</Link>
            </Text>
            <Text size="2" className={ibmPlexMono.className}>
              {tags?.map((t) => `#${t}`).join(" ")}
            </Text>
          </Flex>
        ))
      ) : (
        <Text size="3">No posts yet.</Text>
      )}
    </Flex>
  );
}
