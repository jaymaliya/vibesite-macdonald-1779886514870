"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();

  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [badgePulse, setBadgePulse] = React.useState(false);
  const prevTotal = React.useRef(totalItems);

  React.useEffect(() => {
    if (prevTotal.current !== totalItems) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 400);
      prevTotal.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function scrollToSection(id: string) {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function navPush(path: string) {
    setMobileOpen(false);
    router.push(path);
  }

  const navLinks = [
    { label: "Shop", action: () => navPush("/shop") },
    { label: "Seasonal", action: () => scrollToSection("seasonal") },
    { label: "Our Story", action: () => scrollToSection("about") },
    { label: "Gifts", action: () => scrollToSection("gifts") },
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "#12100A",
          borderBottom: scrolled ? "1px solid #C2875130" : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 24px 0 rgba(255,199,44,0.08)"
            : "none",
          transition:
            "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="/logo.png"
              alt="Macdonald logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <NavLink key={link.label} onClick={link.action}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side: Cart + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
            {/* Cart Button */}
            <button
              onClick={() => router.push("/checkout")}
              aria-label={`Cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F5F0E8",
                transition:
                  "transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                (e.currentTarget as HTMLButtonElement).style.background = "#FFC72C18";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #FFC72C";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {/* Cart SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F5F0E8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>

              {/* Badge */}
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#D7231F",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    color: "#ffffff",
                    lineHeight: 1,
                    border: "1.5px solid #12100A",
                    transform: badgePulse ? "scale(1.3)" : "scale(1)",
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  aria-hidden="true"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger (mobile only) */}
            <button
              className="flex md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "12px",
                color: "#F5F0E8",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#FFC72C18";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #FFC72C";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {mobileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F5F0E8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F5F0E8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Overlay Menu */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            backgroundColor: "#12100A",
            display: "flex",
            flexDirection: "column",
            paddingTop: "88px",
            paddingLeft: "32px",
            paddingRight: "32px",
            paddingBottom: "48px",
          }}
          className="md:hidden"
        >
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flex: 1,
            }}
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "2rem",
                  fontWeight: 500,
                  color: "#F5F0E8",
                  letterSpacing: "-0.02em",
                  padding: "12px 0",
                  borderBottom: "1px solid #C2875122",
                  transition:
                    "color 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#FFC72C";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateX(8px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#F5F0E8";
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
          </nav>

          {/* Mobile cart CTA */}
          <button
            onClick={() => navPush("/checkout")}
            style={{
              marginTop: "32px",
              backgroundColor: "#FFC72C",
              color: "#12100A",
              border: "none",
              borderRadius: "12px",
              padding: "16px 32px",
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition:
                "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #FFC72C";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
            aria-label={`View cart with ${totalItems} items`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#12100A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            View Cart
            {totalItems > 0 && (
              <span
                style={{
                  backgroundColor: "#D7231F",
                  color: "#fff",
                  borderRadius: "9999px",
                  padding: "2px 8px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}

function NavLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => {
        (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #FFC72C";
        (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLButtonElement).style.outline = "none";
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Raleway', sans-serif",
        fontWeight: hovered ? 600 : 500,
        fontSize: "0.95rem",
        color: hovered ? "#FFC72C" : "#F5F0E8",
        padding: "8px 16px",
        borderRadius: "9999px",
        letterSpacing: "0.01em",
        backgroundColor: hovered ? "#FFC72C14" : "transparent",
        transition:
          "color 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.25s cubic-bezier(0.4,0,0.2,1), font-weight 0.1s",
      }}
    >
      {children}
    </button>
  );
}