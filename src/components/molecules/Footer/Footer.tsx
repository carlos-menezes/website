import { Box, Flex, Link, Text } from "@radix-ui/themes";

const Footer = () => {
  return (
    <Flex
      justify="between"
      align="center"
      py="2"
      px={{ initial: "6", md: "0" }}
    >
      <Box>
        <Text size="1">
          &copy; {new Date().getFullYear()} carlos-menezes.com
        </Text>
      </Box>
      <Box>
        <Flex gap="3" align="center">
          <Text size="1">
            <Link href="#top">[top]</Link>
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Footer;
