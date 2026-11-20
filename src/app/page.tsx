import { format } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAllPostsFrontmatter } from "../lib/posts";

export default async function Home() {
  const posts = getAllPostsFrontmatter();

  const links = [
    {
      label: "GitHub",
      href: "https://github.com/carlos-menezes",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/cmenezes1998/",
    },
    {
      label: "Email",
      href: "mailto:carlos.dm.menezes@gmail.com",
    },
  ];

  return (
    <div className="space-y-8">
      <Avatar size="lg">
        <AvatarImage src="/img/me.png" />
      </Avatar>
      <div>
        <p>
          I'm Carlos, a software engineer at{" "}
          <Link href="https://www.singlestore.com">SingleStore</Link> working on
          the Helios platform.
        </p>
        <p>
          I live in Madeira with my fiancée and our two cats, Tommy and Luna.
        </p>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div className="grid grid-cols-2" key={post.id}>
            <p className="shrink-0 truncate hover:underline">
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </p>
            <p className="text-end text-muted-foreground">
              {format(post.date, "MMMM dd, yyyy")}
            </p>
          </div>
        ))}
      </div>
      <div className="space-x-8 flex items-center justify-center">
        {links.map((link) => (
          <p key={link.href} className="text-muted-foreground hover:underline">
            <Link href={link.href}>{link.label}</Link>
          </p>
        ))}
      </div>
    </div>
  );
}
