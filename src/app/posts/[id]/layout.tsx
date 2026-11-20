import Link from "next/link";
import type { ReactNode } from "react";

export default function PostLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-8">
      <div className="h-8.75 w-8.75 flex items-center">
        <Link href="/" className="hover:underline text-muted-foreground">
          ←
        </Link>
      </div>
      {children}
    </div>
  );
}
