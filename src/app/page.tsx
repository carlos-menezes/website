import { getAllPostsFrontmatter } from "../lib/posts";

export default async function Home() {
  const posts = getAllPostsFrontmatter();

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <a href="/" className="font-mono">
          [/]
        </a>
      </div>
      <div className="space-y-4">
        <p className="font-semibold">Carlos Menezes</p>
        <p>
          Software engineer based out of{" "}
          <a
            href="https://en.wikipedia.org/wiki/Portugal"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portugal <span className="font-mono">[↗]</span>
          </a>
          .
        </p>
        <p>
          Working at{" "}
          <a
            href="https://www.bentley.com"
            className="font-mono"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bentley Systems <span className="font-mono">[↗]</span>
          </a>
          , building next-generation software for infrastructure like bridges,
          roads, buildings, and utility networks.
        </p>
        <p>
          Contact me at{" "}
          <a href="mailto:carlos.dm.menezes@gmail.com">
            carlos.dm.menezes@gmail.com
          </a>
          .<br />
          My CV is available for download{" "}
          <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">
            here <span className="font-mono">[↗]</span>
          </a>
          .
        </p>
        <div className="space-x-2">
          <a
            href="https://github.com/carlos-menezes"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <span className="font-mono">[↗]</span>
          </a>
          <span>✦</span>
          <a
            href="https://www.linkedin.com/in/cmenezes1998/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn <span className="font-mono">[↗]</span>
          </a>
        </div>
      </div>
      <div>
        {new Array(1).fill("✦").map((value, idx) => (
          <span
            key={`symbol-${
              // biome-ignore lint/suspicious/noArrayIndexKey: no other viable alternative
              idx
            }`}
          >
            {value}
          </span>
        ))}
      </div>
      <ul className="space-y-2 w-full">
        {posts.map((post, index) => (
          <li key={post.id} className="flex items-center gap-2">
            <span className="text-white/60 whitespace-nowrap shrink-0 font-mono">
              {(posts.length - index - 1).toString().padStart(2, "0")}.
            </span>
            <a
              href={`/posts/${post.id}`}
              className="truncate min-w-0 border-none no-underline"
            >
              <span className="text-white">{post.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
