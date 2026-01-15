import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  if (!title) {
    return new ImageResponse(<>Visit with &quot;?title=Your+Title&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#111111",
        color: "#fff",
        fontFamily: "sans-serif",
        padding: 64,
      }}
    >
      <span
        style={{
          fontSize: 48,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "-.015em",
          maxWidth: 800,
          textAlign: "center",
          lineHeight: 1.1,
          display: "block",
        }}
      >
        {title}
      </span>
      <span
        style={{
          textAlign: "center",
          opacity: 0.7,
          marginTop: 40,
          display: "block",
        }}
      >
        carlos-menezes.com
      </span>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
