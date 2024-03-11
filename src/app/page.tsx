import { getSortedPostsMetadata } from "@/lib/posts";
import { Flex, Link, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "Home - Carlos Menezes",
};

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
});

export default function Page() {
  const posts = getSortedPostsMetadata().slice(0, 10);

  return (
    <Flex direction="column" gap="6">
      <Flex direction="column" gap="2">
        <Text size="3">
          Hello. My name is Carlos. Born and raised in Porto Santo, Portugal.
        </Text>
        <Text size="3">
          My habit of tinkering with anything and everything as a kid has led to
          me become a software engineer at a later age. At the moment, I am
          working as a software engineer at Yacooba Labs. If you would like to
          know more about me, download my{" "}
          <Text style={{ fontStyle: "italic" }}>
            <Link href="/cv.pdf">curriculum vitae</Link>
          </Text>
          .
        </Text>
      </Flex>

      <Flex direction="column" gap="2">
        <Text size="3">
          This site is my gateway to exploring and writing about topics that
          cross my mind.
        </Text>
        <Text size="3">
          These topics may range from more technical ones, like diving into the
          why and how of a project I have built, to more personal ones, like a
          game or movie review. Each post is tagged appropriately, so you may{" "}
          <Link href="/tags">filter posts at your discretion</Link>.
        </Text>
      </Flex>
      <Flex direction="column" gap="2">
        <Text size="3" className={ibmPlexMono.className} weight="bold">
          SELECT * FROM POSTS ORDER BY DATE DESC LIMIT 10;
        </Text>
        {posts.map(({ id, frontmatter: { date, title, tags } }, i) => (
          <Flex key={i} gap="5" align="center" width="100%">
            <Text size="2">{format(date, "LLL dd, y")}</Text>
            <Text size="3" style={{ flexGrow: 1 }}>
              <Link href={`post/${id}`}>{title}</Link>
            </Text>
            <Text size="2" className={ibmPlexMono.className}>
              {tags?.map((t) => `#${t}`).join(" ")}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
