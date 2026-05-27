"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  const quickLinks = [
    { label: "Home", action: () => router.push("/") },
    { label: "Shop", action: () => router.push("/shop") },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#12100A",
        borderTop: "1px solid #C2875130",
        paddingTop: "96px",
        paddingBottom: "48px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "48px",
            marginBottom: "64px",
          }}
        >
          {/* Brand Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img
              src="/logo.png"
              alt="Macdonald logo"
              style={{ height: "32px", objectFit: "contain", opacity: 0.85, alignSelf: "flex-start" }}
            />
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "#A87B52",
                maxWidth: "280px",
              }}
            >
              Unapologetically indulgent. Generously stacked. Made for those who know exactly what they want — and aren't shy about it.
            </p>
            {/* Social Icons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              <SocialButton
                label="Instagram"
                href="https://instagram.com"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </SocialButton>
              <SocialButton
                label="Twitter / X"
                href="https://twitter.com"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </SocialButton>
              <SocialButton
                label="WhatsApp"
                href="https://wa.me/"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </SocialButton>
            </div>
          </div>

          {/* Quick Links Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.125rem",
                fontWeight: 500,
                color: "#F5F0E8",
                marginBottom: "8px",
                letterSpacing: "-0.01em",
              }}
            >
              Quick Links
            </h3>
            {quickLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.9rem",
                  color: "#A87B52",
                  padding: "0",
                  letterSpacing: "0.01em",
                  width: "fit-content",
                  transition:
                    "color 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#FFC72C";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#A87B52";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateX(0)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #FFC72C";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                {link.label}
              </button>
            ))}
            <a
              href="mailto:maliyajay77@gmail.com"
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.9rem",
                color: "#A87B52",
                textDecoration: "none",
                letterSpacing: "0.01em",
                width: "fit-content",
                transition:
                  "color 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#FFC72C";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#A87B52";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #FFC72C";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              Contact Us
            </a>
          </div>

          {/* Newsletter Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.125rem",
                fontWeight: 500,
                color: "#F5F0E8",
                marginBottom: "8px",
                letterSpacing: "-0.01em",
              }}
            >
              Stay in the Loop
            </h3>
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.875rem",
                color: "#A87B52",
                lineHeight: 1.6,
                marginBottom: "8px",
              }}
            >
              New drops, secret specials, and deals for the truly hungry — straight to your inbox.
            </p>

            {status === "success" ? (
              <div
                style={{
                  backgroundColor: "#FFC72C18",
                  border: "1px solid #FFC72C40",
                  borderRadius: "12px",
                  padding: "16px",
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.9rem",
                  color: "#FFC72C",
                  fontWeight: 600,
                }}
              >
                Thanks! We'll be in touch.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
                noValidate
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === "loading"}
                  style={{
                    backgroundColor: "#1E1A12",
                    border: "1px solid #C2875140",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "0.9rem",
                    color: "#F5F0E8",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    transition:
                      "border-color 0.25s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor = "#FFC72C";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor = "#C2875140";
                  }}
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    backgroundColor: status === "loading" ? "#A87B52" : "#FFC72C",
                    color: "#12100A",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 24px",
                    fontFamily: "'Raleway', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    letterSpacing: "0.02em",
                    transition:
                      "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.25s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                    }
                  }}
                  onMouseUp={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                    }
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #FFC72C";
                    (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = "none";
                  }}
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>

                {status === "error" && (
                  <p
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "0.8rem",
                      color: "#D7231F",
                    }}
                  >
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "#C2875128",
            marginBottom: "32px",
          }}
          role="separator"
        />

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.8rem",
              color: "#A87B52",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Macdonald. All rights reserved.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.8rem",
                color: "#A87B52",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFC72C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Made in India
            </span>

            <span
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.8rem",
                color: "#A87B52",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFC72C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 5v3h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Free delivery above ₹499
            </span>

            <span
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.8rem",
                color: "#A87B52",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFC72C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              UPI &amp; Cards Accepted
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "9999px",
        backgroundColor: "#1E1A12",
        border: "1px solid #C2875130",
        color: "#A87B52",
        textDecoration: "none",
        flexShrink: 0,
        transition:
          "color 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = "#FFC72C";
        el.style.backgroundColor = "#FFC72C18";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = "#A87B52";
        el.style.backgroundColor = "#1E1A12";
        el.style.transform = "translateY(0)";
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #FFC72C";
        (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.outline = "none";
      }}
    >
      {children}
    </a>
  );
}