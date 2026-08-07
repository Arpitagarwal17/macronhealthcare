import { ImageResponse } from "next/og";
import { company } from "@/data/company";

export const alt = "Macron Health Care pharmaceutical company in India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#F7FBFF",
          color: "#102B46",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", width: "61%", flexDirection: "column" }}>
          <div
            style={{
              color: "#009688",
              fontSize: 24,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {`Since ${company.servingSince}`}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.08,
            }}
          >
            Pharmaceutical Company in India
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 28, color: "#526579" }}>
            {company.tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 390,
            height: 390,
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #D8E5EC",
            borderRadius: 28,
            background: "#FFFFFF",
          }}
        >
          <img
            src={`${company.websiteUrl}/logo.png`}
            width="330"
            height="134"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    ),
    size,
  );
}
