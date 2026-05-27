"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Classic Double Cheeseburger", description: "Generously stacked double cheeseburger with two beef patties, American cheese, and fresh", price: 249, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Classic Pepperoni Pizza", description: "Generously topped classic pepperoni pizza with glistening mozzarella and a crispy crust.", price: 60, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "McDonald's Golden Fries", description: "Iconic golden, crispy McDonald's fries, overflowing from their classic red carton.", price: 70, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Crispy Golden Tenders", description: "Succulent golden fried chicken tenders with a rich dipping sauce.", price: 90, badge: "" }
];

const filters = ["All", "Burgers", "Pizza", "Fries", "Chicken Tenders"];

const haloItems = [
  { img: "/product-1.jpg", label: "DOUBLE SMASH · BEEF PATTIES · UMAMI RICHNESS · FRESH LETTUCE · ", alt: "Classic Double Cheeseburger halo", accent: "BURGERS" },
  { img: "/product-2.jpg", label: "PEPPERONI · MOZZARELLA · CRISPY CRUST · TOMATO SAUCE · ", alt: "Classic Pepperoni Pizza halo", accent: "PIZZA" },
  { img: "/product-3.jpg", label: "GOLDEN FRIES · CRISPY · SALTED · ICONIC CARTON · ", alt: "Golden Fries halo", accent: "FRIES" },
  { img: "/product-4.jpg", label: "CRISPY TENDER · FRIED GOLDEN · RICH SAUCE · SPICY KICK · ", alt: "Crispy Golden Tenders halo", accent: "TENDERS" },
];

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [addedId, setAddedId] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.cssText +=
        "opacity:0;transform:translateY(28px);transition:opacity 0.6s ease,transform 0.6s ease;";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const handleAddToCart = (p: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filteredProducts = activeFilter === "All"
    ? products
    : products.filter((p) => p.category === activeFilter);

  return (
    <main style={{ backgroundColor: "var(--bg)", minHeight: "100vh", fontFamily: "'Raleway', sans-serif", color: "var(--text)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Raleway:wght@400;500;600;700&display=swap');
        :root {
          --bg: #12100A;
          --surface: #C28751;
          --primary: #FFC72C;
          --accent: #D7231F;
          --text: #F5F0E8;
          --muted: #A87B52;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:focus-visible, a:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
        .filter-pill { transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease; }
        .view-details-overlay { transition: opacity 0.2s ease, transform 0.2s ease; }
      `}</style>

      {/* ── PAGE HEADER BANNER ── */}
      <section style={{ background: "linear-gradient(135deg, #1C160D 0%, #12100A 60%, #1A0F08 100%)", padding: isMobile ? "56px 24px 48px" : "80px 48px 64px", borderBottom: "1px solid rgba(194,135,81,0.18)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <span style={{ display: "block", fontSize: "0.688rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", marginBottom: "16px", fontFamily: "'Raleway', sans-serif" }}>
            Our Full Menu
          </span>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: isMobile ? "clamp(2.4rem,8vw,3.2rem)" : "clamp(3rem,5vw,4.2rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--text)", maxWidth: "640px", marginBottom: "24px" }}>
            Everything You <span style={{ color: "var(--primary)" }}>Crave,</span> All in One Place
          </h1>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "480px" }}>
            Burgers stacked high, pizza sliced right, fries done golden, tenders gone crispy. Pick your poison.
          </p>
          {/* Trust row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "24px", fontSize: "0.813rem", color: "var(--muted)", fontFamily: "'Raleway', sans-serif" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              4.8 · 10,000+ happy customers
            </span>
            <span>🇮🇳 Made fresh in India</span>
            <span>Free delivery above ₹499</span>
          </div>
        </div>
      </section>

      {/* ── FILTER PILLS ── */}
      <section className="reveal" style={{ backgroundColor: "#1A150D", borderBottom: "1px solid rgba(194,135,81,0.12)", position: "sticky", top: 0, zIndex: 30, padding: isMobile ? "0 16px" : "0 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", gap: "8px", overflowX: "auto", padding: "16px 0", scrollbarWidth: "none" }}>
          {filters.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="filter-pill"
                style={{
                  flexShrink: 0,
                  height: "36px",
                  padding: "0 20px",
                  borderRadius: "9999px",
                  border: isActive ? "none" : "1px solid rgba(194,135,81,0.35)",
                  background: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "#fff" : "var(--text)",
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.813rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = "var(--primary)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = "rgba(194,135,81,0.35)"; }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: isMobile ? "48px 16px 64px" : "64px 48px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: "32px" }}>
          {filteredProducts.map((p, idx) => {
            const isHovered = hoveredCard === p.id;
            const isAdded = addedId === p.id;
            return (
              <article
                key={p.id}
                className="reveal"
                style={{
                  borderRadius: "16px",
                  background: "#1C160D",
                  border: "1px solid rgba(194,135,81,0.15)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 20px 50px -12px rgba(215,35,31,0.35)" : "0 4px 24px -8px rgba(0,0,0,0.5)",
                  transitionDelay: `${idx * 60}ms`,
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              >
                {/* Image area */}
                <div style={{ position: "relative", overflow: "hidden", borderRadius: "12px 12px 0 0", background: "#231D12" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: "3/4",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  {/* Category badge */}
                  <span style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(18,16,10,0.8)", backdropFilter: "blur(6px)", color: "var(--primary)", fontSize: "0.688rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", padding: "4px 10px", borderRadius: "9999px", fontFamily: "'Raleway', sans-serif", border: "1px solid rgba(255,199,44,0.25)" }}>
                    {p.category}
                  </span>
                  {/* Hover overlay with View Details */}
                  <div
                    className="view-details-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(18,16,10,0.92) 0%, rgba(18,16,10,0.2) 60%, transparent 100%)",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      padding: "20px",
                      opacity: (isHovered || isMobile) ? 1 : 0,
                      transform: (isHovered || isMobile) ? "translateY(0)" : "translateY(8px)",
                    }}
                    onClick={(e) => { e.stopPropagation(); router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`); }}
                  >
                    {(isHovered || isMobile) && (
                      <button
                        style={{
                          width: "100%",
                          height: "48px",
                          background: "var(--accent)",
                          color: "#fff",
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          letterSpacing: "0.02em",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                        onClick={(e) => { e.stopPropagation(); router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`); }}
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "20px 20px 20px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.125rem", fontWeight: 500, color: "var(--text)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                    {p.name}
                  </h3>
                  <p style={{ fontSize: "0.813rem", lineHeight: 1.6, color: "var(--muted)", fontFamily: "'Raleway', sans-serif" }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "16px" }}>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "1.125rem", fontWeight: 700, color: "var(--accent)" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(p, e)}
                      style={{
                        height: "40px",
                        padding: "0 20px",
                        borderRadius: "8px",
                        border: isAdded ? "none" : "1px solid var(--primary)",
                        background: isAdded ? "var(--primary)" : "transparent",
                        color: isAdded ? "#12100A" : "var(--primary)",
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.813rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "background 0.15s ease, color 0.15s ease, transform 0.15s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    >
                      {isAdded ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: "center", padding: "96px 24px", color: "var(--muted)" }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", fontStyle: "italic" }}>No items in this category yet.</p>
          </div>
        )}
      </section>

      {/* ── FLAVOR PROFILE HALO SECTION ── */}
      <section className="reveal" style={{ backgroundColor: "#16110A", borderTop: "1px solid rgba(194,135,81,0.12)", borderBottom: "1px solid rgba(194,135,81,0.12)", padding: isMobile ? "64px 16px" : "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? "48px" : "64px" }}>
            <span style={{ display: "block", fontSize: "0.688rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", marginBottom: "16px", fontFamily: "'Raleway', sans-serif" }}>
              What Makes Us Different
            </span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: isMobile ? "clamp(2rem,7vw,2.8rem)" : "clamp(2.4rem,4vw,3.2rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--text)" }}>
              Flavour Profile Halos
            </h2>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "520px", margin: "16px auto 0" }}>
              Each item has a story. Every layer has a purpose. Here's the craft behind your craving.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? "32px" : "48px", alignItems: "start" }}>
            {haloItems.map((item, i) => {
              const r = 110;
              const cx = 130;
              const cy = 130;
              const circumference = 2 * Math.PI * r;
              const pathId = `textPath-${i}`;
              const circleId = `haloCircle-${i}`;
              return (
                <div
                  key={i}
                  className="reveal"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", transitionDelay: `${i * 80}ms` }}
                >
                  <div style={{ position: "relative", width: isMobile ? "140px" : "260px", height: isMobile ? "140px" : "260px", flexShrink: 0 }}>
                    {/* SVG text circle */}
                    <svg
                      width={isMobile ? "140" : "260"}
                      height={isMobile ? "140" : "260"}
                      viewBox="0 0 260 260"
                      style={{ position: "absolute", inset: 0, zIndex: 2 }}
                    >
                      <defs>
                        <path
                          id={circleId}
                          d={`M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,1 ${2 * r},0 a ${r},${r} 0 1,1 -${2 * r},0`}
                        />
                      </defs>
                      <text
                        style={{
                          fontSize: "9.5px",
                          fill: "var(--accent)",
                          fontFamily: "'Raleway', sans-serif",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        <textPath href={`#${circleId}`} startOffset="0%">
                          {item.label}{item.label}
                        </textPath>
                      </text>
                      {/* Outer stroke ring */}
                      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="rgba(240,237,232,0.18)" strokeWidth="1.5" />
                      {/* Small dot markers at cardinal points */}
                      {[0, 90, 180, 270].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        const dx = cx + (r + 4) * Math.cos(rad - Math.PI / 2);
                        const dy = cy + (r + 4) * Math.sin(rad - Math.PI / 2);
                        return <circle key={deg} cx={dx} cy={dy} r="3" fill="var(--primary)" opacity="0.7" />;
                      })}
                    </svg>

                    {/* Circular image */}
                    <div
                      style={{
                        position: "absolute",
                        inset: "18px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid rgba(240,237,232,0.2)",
                        zIndex: 1,
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                          transition: "transform 0.5s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    </div>
                  </div>

                  {/* Label below halo */}
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "block", fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1rem", fontWeight: 500, color: "var(--text)", letterSpacing: "-0.01em" }}>
                      {item.accent}
                    </span>
                    <span style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "var(--muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                      Fresh · Crafted · Bold
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CRAFT STRIP ── */}
      <section className="reveal" style={{ background: "#12100A", padding: isMobile ? "64px 16px" : "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "55fr 45fr", gap: isMobile ? "40px" : "64px", alignItems: "center" }}>
          {/* Image */}
          <div style={{ overflow: "hidden", borderRadius: "16px", boxShadow: "0 40px 80px -20px rgba(215,35,31,0.25)" }}>
            <img
              src="/product-1.jpg"
              alt="Handcrafted Macdonald burger being assembled with fresh ingredients"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{ fontSize: "0.688rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", fontFamily: "'Raleway', sans-serif" }}>
              Our Craft
            </span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: isMobile ? "clamp(2rem,7vw,2.8rem)" : "clamp(2.2rem,3.5vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--text)" }}>
              Handcrafted Perfection, Every Order
            </h2>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", maxWidth: "400px" }}>
              We don't do shortcuts. Fresh beef, real cheese, produce that hasn't seen a freezer — every item leaves our kitchen the way it should: aggressively good and impossible to share.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px" }}>
              {["Fresh Daily", "No Preservatives", "Made in India"].map((t) => (
                <span key={t} style={{ padding: "6px 14px", borderRadius: "9999px", border: "1px solid rgba(194,135,81,0.35)", fontSize: "0.813rem", fontFamily: "'Raleway', sans-serif", fontWeight: 600, color: "var(--muted)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section className="reveal" style={{ background: "linear-gradient(135deg, #1C120A 0%, #231508 100%)", borderTop: "1px solid rgba(255,199,44,0.12)", padding: isMobile ? "56px 24px" : "80px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: isMobile ? "clamp(1.8rem,7vw,2.4rem)" : "clamp(2rem,3.5vw,2.8rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "16px" }}>
            Your next craving is <span style={{ color: "var(--primary)" }}>one click away</span>
          </h2>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", marginBottom: "32px" }}>
            Trusted by 10,000+ hungry customers every week. Free delivery on orders above ₹499.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ height: "56px", padding: "0 48px", borderRadius: "12px", border: "none", background: "var(--accent)", color: "#fff", fontFamily: "'Raleway', sans-serif", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 30px -10px rgba(215,35,31,0.6)", letterSpacing: "0.01em" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            Back to Top
          </button>
        </div>
      </section>
    </main>
  );
}