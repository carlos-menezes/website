import { getAllTags, getSortedPostsByTag } from "@/lib/posts";
import { Flex, Heading, Text, Link } from "@radix-ui/themes";
import { format } from "date-fns";

export default function Page() {
  const tags = getAllTags();

  return (
    <Flex direction="column" gap="4">
      <Flex direction="column">
        <Heading size="4" as="h1">
          Tags
        </Heading>
        <Text size="3">
          Posts organized by their tag(s). All tags:{" "}
          {tags.map((tag, i) => (
            <>
              <Link key={tag} href={`#${tag}`}>
                <Text size="3">{tag}</Text>
              </Link>
              {i !== tags.length - 1 && <Text size="3">,</Text>}{" "}
            </>
          ))}
        </Text>
      </Flex>
      <Flex direction="column" gap="4">
        {tags.map((tag) => {
          const posts = getSortedPostsByTag(tag);
          return (
            <Flex direction="column" key={`${tag}-posts`} gap="1">
              <Text size="4" weight="bold" id={tag}>
                {tag}
              </Text>
              {posts.map(({ id, frontmatter: { date, title } }, i) => (
                <Flex direction="column" key={i}>
                  <Text size="2">{format(date, "LLL dd, y")}</Text>
                  <Heading size="3" weight="bold">
                    <Link href={`post/${id}`}>{title}</Link>
                  </Heading>
                </Flex>
              ))}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}
