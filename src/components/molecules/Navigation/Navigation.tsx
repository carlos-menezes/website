import { navigationLinks } from "@/constants/links";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Link } from "@radix-ui/themes";
import { IBM_Plex_Mono } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["500", "600"],
  subsets: ["latin"],
});

const Navigation = () => {
  return (
    <Flex
      justify="between"
      align="center"
      py="4"
      id="top"
      px={{ initial: "6", md: "0" }}
    >
      <Box>
        <Text
          size="4"
          className={ibmPlexMono.className}
          style={{ fontWeight: 600, userSelect: "all" }}
        >
          ˈkɑːləʊz
        </Text>
      </Box>
      <Box>
        <Flex gap="3" align="center">
          {navigationLinks.map(({ href, title }, i) => (
            <Flex gap="3" key={i}>
              <Text size="2">
                <Link href={href}>{title.toLowerCase()}</Link>
              </Text>
              {i !== navigationLinks.length - 1 && <Text size="2">/</Text>}
            </Flex>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

export default Navigation;
