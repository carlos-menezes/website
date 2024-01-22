import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title")?.slice(0, 100);
    const subtitle = searchParams.get("subtitle");

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            background: "white",
            padding: "50px 200px",
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: "bold",
              color: "black",
              textAlign: "center",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: "lighter",
              color: "black",
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {}
}
