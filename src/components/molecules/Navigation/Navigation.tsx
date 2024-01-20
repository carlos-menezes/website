import { navigationLinks } from "@/constants/links";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Link } from "@radix-ui/themes";

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
        <Text size="3">Carlos Menezes</Text>
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
