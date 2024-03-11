export type Link = {
  href: string;
  title: string;
};

type Route = "home" | "posts";

const links: Record<Route, Link> = {
  home: {
    href: "/",
    title: "Home",
  },
  posts: {
    href: "/posts",
    title: "Posts",
  },
};

export const navigationLinks = [links.home, links.posts];
export default links;
