import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            color: "#ff2d55",
            fontSize: 24,
            fontFamily: "monospace",
          }}
        >
          harshpahurkar.dev
        </div>
        <div
          style={{
            color: "#eaeaef",
            fontSize: 64,
            fontWeight: 700,
            marginTop: 16,
          }}
        >
          Harsh Pahurkar
        </div>
        <div
          style={{
            color: "#6b7280",
            fontSize: 32,
            marginTop: 8,
          }}
        >
          Backend & Full-Stack Engineer
        </div>
      </div>
    ),
    { ...size }
  );
}
