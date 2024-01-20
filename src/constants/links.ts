export type Link = {
  href: string;
  title: string;
};

type Route = "about" | "posts";

const links: Record<Route, Link> = {
  about: {
    href: "/",
    title: "About",
  },
  posts: {
    href: "/posts",
    title: "Posts",
  },
};

export const navigationLinks = [links.about, links.posts];
export default links;
