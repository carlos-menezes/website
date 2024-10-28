import Footer from "@/components/molecules/Footer/Footer";
import Navigation from "@/components/molecules/Navigation/Navigation";
import { Box, Container, Flex, Separator, Theme } from "@radix-ui/themes";
import { Analytics } from "@vercel/analytics/next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-work-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={workSans.className} style={{ margin: 0 }}>
        <Theme>
          <Container size="2">
            <Flex direction="column" style={{ minHeight: "100vh" }}>
              <Navigation />
              <Separator style={{ width: "100%" }} />
              <Box
                py="4"
                px={{ initial: "6", md: "0" }}
                style={{ flexGrow: 1 }}
              >
                {children}
              </Box>
              <Separator style={{ width: "100%" }} />
              <Footer />
            </Flex>
          </Container>
        </Theme>
        <Analytics />
      </body>
    </html>
  );
}
