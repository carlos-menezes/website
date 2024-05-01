import {
  Frontmatter,
  getPostMarkdown,
  getSortedPostsMetadata,
} from "@/lib/posts";
import { Flex, Heading, Link, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkToc from "remark-toc";
import { Metadata } from "next";
import rehypeSlug from "rehype-slug";

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

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const post = getPostMarkdown(params.id);
  const data = post.data;

  return {
    title: `${data.title} - Carlos Menezes`,
    description: data.description,
    openGraph: {
      images: [
        {
          url: `https://www.carlos-menezes.com/api/og?title=${data.title}&subtitle=${data.description}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function Page({ params }: PageParams) {
  const { id } = params;
  const markdown = getPostMarkdown(id);
  const data = markdown.data as Frontmatter;
  const syntaxTheme = vs;

  const components: Components = {
    h1: (props) => (
      <Heading
        id={props.id}
        ref={undefined}
        color={undefined}
        size="6"
        as="h1"
        my="2"
      >
        {props.children}
      </Heading>
    ),
    h2: (props) => (
      <Heading
        id={props.id}
        ref={undefined}
        color={undefined}
        size="5"
        as="h2"
        my="2"
      >
        {props.children}
      </Heading>
    ),
    h3: (props) => (
      <Heading
        id={props.id}
        ref={undefined}
        color={undefined}
        size="4"
        as="h3"
        my="2"
      >
        {props.children}
      </Heading>
    ),

    p: (props) => (
      <Text size="3" style={{ textAlign: "justify" }}>
        {props.children}
      </Text>
    ),
    code(props) {
      const { children, className, node, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <SyntaxHighlighter
          {...rest}
          PreTag="div"
          language={match[1]}
          style={{ ...syntaxTheme }}
          ref={undefined}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          {...rest}
          className={className}
          style={{
            fontSize: 13,
            background: "#eee",
            padding: 4,
            fontFamily: "monospace",
          }}
        >
          {children}
        </code>
      );
    },
    li: (props) => (
      <li>
        <Text size="3">{props.children}</Text>
      </li>
    ),
    img: (props) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={props.alt!}
        style={{
          width: "100%",
          margin: "16px 0 0 0",
        }}
        {...props}
      />
    ),
    em: (props) => (
      <Text size="1" style={{ fontStyle: "italic" }}>
        {props.children}
      </Text>
    ),
    a: (props) => (
      <Link {...props} color="blue" ref={undefined}>
        {props.children}
      </Link>
    ),
  };

  return (
    <Flex direction="column" gap="4">
      <Flex direction="column">
        <Text size="2">{format(data.date, "LLL dd, y")}</Text>
        <Heading as="h1" size="6" weight="bold">
          {data.title}
        </Heading>
      </Flex>
      <Flex direction="column" gap="1">
        <Markdown
          rehypePlugins={[rehypeRaw, rehypeSlug]}
          remarkPlugins={[remarkToc]}
          components={components}
        >
          {markdown.content}
        </Markdown>
      </Flex>
      {data.tags && (
        <Text size="2">
          Tags:{" "}
          {data.tags.map((tag, i) => (
            <>
              <Link key={tag} href={`/tags#${tag}`}>
                <Text size="2">{tag}</Text>
              </Link>
              {data.tags && i !== data.tags.length - 1 && (
                <Text size="2">,</Text>
              )}{" "}
            </>
          ))}
        </Text>
      )}
    </Flex>
  );
}
