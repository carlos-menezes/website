import { Box, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Carlos Menezes",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4">
      <Box>
        <Heading as="h1" size="4" mb="2">
          Home
        </Heading>
        <Flex direction="column" gap="1">
          <Text size="2">
            Hello. My name is Carlos. Born and raised in Porto Santo, Portugal.
          </Text>
          <Text size="2">
            My habit of tinkering with anything and everything as a kid has led
            to me become a software engineer at a later age. At the moment, I am
            working as a software engineer at Yacooba Labs.
          </Text>
          <Text size="2">
            {" "}
            If you would like to know more about me, download my{" "}
            <Text style={{ fontStyle: "italic" }}>
              <Link href="/cv.pdf">curriculum vitae</Link>
            </Text>
            .
          </Text>
        </Flex>
      </Box>
      <Box>
        <Heading as="h2" size="3" mb="2">
          What&apos;s this website about?
        </Heading>
        <Flex direction="column" gap="1">
          <Text size="2">
            Similar to numerous personal websites, my intention is to write
            about various topics that crosses my mind.
          </Text>
          <Text size="2">
            These topics may range from more technical ones, like diving into
            the why and how of a project I have built, to more personal ones,
            like a game or movie review. Each post is tagged appropriately, so
            you may <Link href="/tags">filter posts at your discretion</Link>.
          </Text>
          <Text size="2">
            Basically, this site is where I write about things I have learned,
            things I want to learn, things I find interesting and mistakes I
            have made.
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
