"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Classic Double Cheeseburger", description: "Generously stacked double cheeseburger with two beef patties, American cheese, and fresh veggies.", price: 249, category: "Burgers" },
  { id: 2, img: "/product-2.jpg", name: "Classic Pepperoni Pizza", description: "Generously topped classic pepperoni pizza with glistening mozzarella and a crispy crust.", price: 60, category: "Pizza" },
  { id: 3, img: "/product-3.jpg", name: "McDonald's Golden Fries", description: "Iconic golden, crispy McDonald's fries, overflowing from their classic red carton.", price: 70, category: "Fries" },
  { id: 4, img: "/product-4.jpg", name: "Crispy Golden Tenders", description: "Succulent golden fried chicken tenders with a rich dipping sauce.", price: 90, category: "Chicken Tenders" },
];

const reviews = [
  { name: "Rohan M.", location: "Mumbai", date: "Jan 2025", rating: 5, text: "Absolutely unreal. The double cheeseburger hit every single note — juicy patties, melty cheese, fresh crunch. Worth every rupee." },
  { name: "Priya K.", location: "Bengaluru", date: "Feb 2025", rating: 5, text: "I ordered this on a whim and now it's my weekly ritual. The special sauce is what makes it transcendent." },
  { name: "Arjun S.", location: "Delhi", date: "Mar 2025", rating: 5, text: "Premium taste, incredible value. The layering is so precise — every bite has the perfect ratio of everything." },
  { name: "Sneha R.", location: "Pune", date: "Mar 2025", rating: 4, text: "Genuinely one of the best burgers I've had outside of a sit-down restaurant. Fresh ingredients, fast delivery." },
];

const proteinOptions = [
  { label: "Beef Patty", color: "#8B4513" },
  { label: "Chicken Patty", color: "#F5DEB3" },
  { label: "Veggie Patty", color: "#5A7A3A" },
];

const addOns = [
  { label: "Extra Cheese Slice", price: 20 },
  { label: "Crispy Bacon Strips", price: 35 },
  { label: "Jalapeño Rings", price: 15 },
  { label: "Truffle Mayo", price: 25 },
];

function StarRating({ count }: { count: number }) {
  return (
    <span style={{ color: "var(--primary)", fontSize: "1rem", letterSpacing: "1px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < count ? "var(--primary)" : "none"} stroke="var(--primary)" strokeWidth="1.5" style={{ display: "inline", marginRight: "1px" }}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

function FlavorHalo({ productName }: { productName: string }) {
  const radius = 90;
  const cx = 110;
  const cy = 110;
  const circumference = 2 * Math.PI * radius;
  const labelText = "★ FRESH DAILY · HANDCRAFTED · REAL INGREDIENTS · BOLD FLAVORS · ";

  return (
    <div style={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>
      <svg width="220" height="220" style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
        <defs>
          <path
            id="halo-circle"
            d={`M ${cx},${cy - radius} A ${radius},${radius} 0 1,1 ${cx - 0.01},${cy - radius}`}
          />
        </defs>
        <text style={{ fontFamily: "'Raleway', sans-serif", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }} fill="var(--accent)">
          <textPath href="#halo-circle" startOffset="0%">
            {labelText}
          </textPath>
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          width: "190px",
          height: "190px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid var(--primary)",
          boxShadow: "0 8px 32px -8px rgba(215,35,31,0.35)",
        }}
      >
        <div style={{ width: "100%", height: "100%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.5rem", color: "var(--text)", opacity: 0.6, textAlign: "center", padding: "0 16px", lineHeight: 1.2 }}>
            {productName.split(" ")[0]}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;
  const displayImg = paramImg ?? "/product-1.jpg";

  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };

  const [quantity, setQuantity] = useState(1);
  const [selectedProtein, setSelectedProtein] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const currentProduct = products.find((p) => p.name === paramName) || products[0];
  const displayName = paramName || currentProduct.name;
  const displayPrice = paramPrice || currentProduct.price;
  const displayDesc = currentProduct.description;

  const addOnTotal = selectedAddOns.reduce((sum, idx) => sum + addOns[idx].price, 0);
  const finalPrice = displayPrice * quantity + addOnTotal;

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

  const handleAddToCart = () => {
    addItem({
      id: String(currentProduct.id),
      name: displayName,
      price: displayPrice,
      quantity,
      image: displayImg,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({
      id: String(currentProduct.id),
      name: displayName,
      price: displayPrice,
      quantity,
      image: displayImg,
    });
    router.push("/checkout");
  };

  const toggleAddOn = (idx: number) => {
    setSelectedAddOns((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const relatedProducts = products.filter((p) => p.name !== displayName).slice(0, 3);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      {/* Inject fonts */}
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
        body { background: var(--bg); }
        .halo-rotate { animation: haloSpin 18s linear infinite; transform-origin: 110px 110px; }
        @keyframes haloSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .add-btn-bounce { animation: btnBounce 0.3s cubic-bezier(0.4,0,0.2,1); }
        @keyframes btnBounce { 0%{transform:scale(1)} 50%{transform:scale(1.05)} 100%{transform:scale(1)} }
      `}</style>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(18,16,10,0.93)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", maxWidth: "80vw", maxHeight: "90vh" }}>
            <img
              src={displayImg}
              alt={displayName}
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                borderRadius: "16px",
                objectFit: "contain",
                boxShadow: "0 40px 100px -20px rgba(215,35,31,0.4)",
              }}
            />
            <button
              onClick={() => setLightboxOpen(false)}
              style={{
                position: "absolute",
                top: "-16px",
                right: "-16px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--accent)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Slim Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(18,16,10,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(194,135,81,0.2)",
          padding: "0 40px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <img
          src="/logo.png"
          alt="Macdonald"
          style={{ height: "36px", objectFit: "contain", cursor: "pointer" }}
          onClick={() => router.push("/")}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <button
            onClick={() => router.push("/shop")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted)",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.875rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Menu
          </button>
          <button
            onClick={() => router.push("/checkout")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Cart
          </button>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "16px 40px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.8rem",
          color: "var(--muted)",
          fontFamily: "'Raleway', sans-serif",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          Home
        </button>
        <span>›</span>
        <button
          onClick={() => router.push("/shop")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          Menu
        </button>
        <span>›</span>
        <span style={{ color: "var(--text)", fontWeight: 500 }}>{displayName}</span>
      </div>

      {/* Main Product Section */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "32px 20px 96px" : "48px 40px 96px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "55fr 45fr",
          gap: isMobile ? "40px" : "64px",
          alignItems: "start",
        }}
      >
        {/* Left — Sticky Image */}
        <div style={{ position: isMobile ? "static" : "sticky", top: "80px" }}>
          {/* Main image */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "20px",
              background: "linear-gradient(180deg, #1E1A11 0%, #2A2215 100%)",
              border: "1px solid rgba(194,135,81,0.25)",
              cursor: "zoom-in",
              boxShadow: "0 32px 80px -20px rgba(215,35,31,0.25)",
            }}
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={displayImg}
              alt={displayName}
              style={{
                width: "100%",
                aspectRatio: "3/4",
                objectFit: "cover",
                transition: "transform 0.6s ease",
                display: "block",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
          </div>

          {/* Click to zoom hint */}
          <div
            style={{
              marginTop: "12px",
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--muted)",
              fontFamily: "'Raleway', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            Click image to zoom
          </div>

          {/* Flavor Profile Halo */}
          <div
            className="reveal"
            style={{
              marginTop: "40px",
              background: "rgba(194,135,81,0.08)",
              borderRadius: "20px",
              border: "1px solid rgba(194,135,81,0.2)",
              padding: "32px 24px",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {/* Rotating SVG halo */}
            <div style={{ position: "relative", width: "220px", height: "220px", flexShrink: 0 }}>
              <svg
                width="220"
                height="220"
                className="halo-rotate"
                style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
              >
                <defs>
                  <path
                    id="halo-textpath"
                    d="M 110,20 A 90,90 0 1,1 109.99,20"
                  />
                </defs>
                <text
                  style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                  fill="var(--accent)"
                >
                  <textPath href="#halo-textpath" startOffset="0%">
                    ★ FRESH DAILY · HANDCRAFTED · BOLD FLAVORS · REAL CRAVINGS · MADE WITH LOVE ·
                  </textPath>
                </text>
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  width: "190px",
                  height: "190px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid var(--primary)",
                  boxShadow: "0 8px 32px -8px rgba(255,199,44,0.3)",
                }}
              >
                <img
                  src={displayImg}
                  alt={`${displayName} flavor profile`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(1.1)",
                  }}
                />
              </div>
            </div>

            {/* Flavor details */}
            <div style={{ flex: 1, minWidth: "160px" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                  color: "var(--accent)",
                  marginBottom: "8px",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                Flavor Profile
              </span>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                  color: "var(--text)",
                  marginBottom: "12px",
                  lineHeight: 1.2,
                }}
              >
                {displayName}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { icon: "🌶", label: "Spicy Kick", color: "#D7231F" },
                  { icon: "🧀", label: "Umami Richness", color: "#FFC72C" },
                  { icon: "🥬", label: "Fresh Crunch", color: "#5A7A3A" },
                ].map((f) => (
                  <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: f.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        fontFamily: "'Raleway', sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Product Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Category + name */}
          <div>
            <span
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 700,
                color: "var(--accent)",
                fontFamily: "'Raleway', sans-serif",
                marginBottom: "12px",
                display: "block",
              }}
            >
              {currentProduct.category}
            </span>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                marginBottom: "16px",
              }}
            >
              {displayName}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <StarRating count={5} />
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                4.9 · 2,847 reviews
              </span>
            </div>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--muted)",
                fontFamily: "'Raleway', sans-serif",
                maxWidth: "480px",
              }}
            >
              {displayDesc}
            </p>
          </div>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              padding: "20px 24px",
              background: "rgba(255,199,44,0.06)",
              borderRadius: "16px",
              border: "1px solid rgba(255,199,44,0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "2.8rem",
                fontWeight: 500,
                color: "var(--primary)",
                lineHeight: 1,
              }}
            >
              ₹{finalPrice.toLocaleString("en-IN")}
            </span>
            {addOnTotal > 0 && (
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                (₹{displayPrice} + ₹{addOnTotal} add-ons)
              </span>
            )}
          </div>

          {/* Trust signals */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              fontSize: "0.8rem",
              color: "var(--muted)",
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            {[
              { icon: "M5 13l4 4L19 7", label: "Free delivery above ₹299" },
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Fresh daily guarantee" },
              { icon: "M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z", label: "10,000+ happy customers" },
            ].map((t) => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d={t.icon} />
                </svg>
                {t.label}
              </div>
            ))}
          </div>

          {/* Protein Choice */}
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                fontFamily: "'Raleway', sans-serif",
                color: "var(--text)",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Protein Choice
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {proteinOptions.map((opt, idx) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedProtein(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 18px",
                    borderRadius: "9999px",
                    border: selectedProtein === idx ? "2px solid var(--accent)" : "1px solid rgba(194,135,81,0.3)",
                    background: selectedProtein === idx ? "var(--accent)" : "rgba(194,135,81,0.1)",
                    color: selectedProtein === idx ? "#fff" : "var(--text)",
                    cursor: "pointer",
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    transition: "all 150ms ease",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: opt.color,
                      border: "1px solid rgba(255,255,255,0.3)",
                      flexShrink: 0,
                    }}
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                fontFamily: "'Raleway', sans-serif",
                color: "var(--text)",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Add-ons
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {addOns.map((addon, idx) => {
                const checked = selectedAddOns.includes(idx);
                return (
                  <button
                    key={addon.label}
                    onClick={() => toggleAddOn(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: checked ? "rgba(215,35,31,0.1)" : "rgba(194,135,81,0.06)",
                      border: checked ? "1px solid rgba(215,35,31,0.4)" : "1px solid rgba(194,135,81,0.2)",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    {/* Custom checkbox */}
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        border: checked ? "2px solid var(--accent)" : "2px solid rgba(194,135,81,0.5)",
                        background: checked ? "var(--accent)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 150ms ease",
                      }}
                    >
                      {checked && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "0.875rem",
                        fontFamily: "'Raleway', sans-serif",
                        color: "var(--text)",
                        fontWeight: 500,
                      }}
                    >
                      {addon.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontFamily: "'Raleway', sans-serif",
                        color: "var(--accent)",
                        fontWeight: 600,
                      }}
                    >
                      +₹{addon.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                fontFamily: "'Raleway', sans-serif",
                color: "var(--text)",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Quantity
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  width: "44px",
                  height: "48px",
                  background: "rgba(194,135,81,0.15)",
                  border: "1px solid rgba(194,135,81,0.3)",
                  borderRadius: "12px 0 0 12px",
                  cursor: "pointer",
                  color: "var(--text)",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(215,35,31,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(194,135,81,0.15)")}
              >
                −
              </button>
              <div
                style={{
                  width: "60px",
                  height: "48px",
                  background: "rgba(194,135,81,0.08)",
                  border: "1px solid rgba(194,135,81,0.3)",
                  borderLeft: "none",
                  borderRight: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.2rem",
                  color: "var(--text)",
                  fontWeight: 500,
                }}
              >
                {quantity}
              </div>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  width: "44px",
                  height: "48px",
                  background: "rgba(194,135,81,0.15)",
                  border: "1px solid rgba(194,135,81,0.3)",
                  borderRadius: "0 12px 12px 0",
                  cursor: "pointer",
                  color: "var(--text)",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,199,44,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(194,135,81,0.15)")}
              >
                +
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleAddToCart}
              className={added ? "add-btn-bounce" : ""}
              style={{
                width: "100%",
                height: "56px",
                background: added ? "rgba(215,35,31,0.85)" : "var(--accent)",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                color: "#fff",
                fontFamily: "'Raleway', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                transition: "transform 0.15s ease, background 0.2s ease",
                boxShadow: "0 10px 30px -10px rgba(215,35,31,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => { if (!added) e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              {added ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added to Cart!
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              style={{
                width: "100%",
                height: "56px",
                background: "transparent",
                border: "2px solid var(--primary)",
                borderRadius: "12px",
                cursor: "pointer",
                color: "var(--primary)",
                fontFamily: "'Raleway', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                transition: "transform 0.15s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.background = "rgba(255,199,44,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "transparent";
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Buy Now — ₹{finalPrice.toLocaleString("en-IN")}
            </button>

            <button
              onClick={() => router.push("/shop")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "underline",
                padding: "4px 0",
                textAlign: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              ← Back to Shop
            </button>
          </div>

          {/* Delivery Info */}
          <div
            style={{
              padding: "20px",
              background: "rgba(255,199,44,0.04)",
              borderRadius: "16px",
              border: "1px solid rgba(255,199,44,0.12)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {[
              { d: "M5 13l4 4L19 7", text: "Free delivery on orders above ₹299" },
              { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", text: "Prepared fresh within 30 minutes" },
              { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", text: "10,000+ satisfied customers weekly" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(255,199,44,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                    <path d={item.d} />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--muted)",
                    fontFamily: "'Raleway', sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        className="reveal"
        style={{
          background: "rgba(194,135,81,0.06)",
          borderTop: "1px solid rgba(194,135,81,0.15)",
          borderBottom: "1px solid rgba(194,135,81,0.15)",
          padding: isMobile ? "64px 20px" : "96px 40px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <span
              style={{
                display: "block",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 700,
                color: "var(--accent)",
                fontFamily: "'Raleway', sans-serif",
                marginBottom: "12px",
              }}
            >
              Customer Reviews
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                  fontWeight: 500,
                  color: "var(--text)",
                  lineHeight: 1.1,
                }}
              >
                What Our Fans Say
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  background: "rgba(255,199,44,0.1)",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255,199,44,0.2)",
                }}
              >
                <StarRating count={5} />
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  4.9/5
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  (2,847)
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {reviews.map((r, i) => (
              <article
                key={r.name}
                className="reveal"
                style={{
                  background: "rgba(18,16,10,0.8)",
                  border: "1px solid rgba(194,135,81,0.2)",
                  borderRadius: "16px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  animationDelay: `${i * 80}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(255,199,44,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <StarRating count={r.rating} />
                <p
                  style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    color: "var(--text)",
                    opacity: 0.9,
                    flex: 1,
                  }}
                >
                  "{r.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "var(--text)",
                      }}
                    >
                      {r.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.75rem",
                        color: "var(--muted)",
                      }}
                    >
                      {r.location}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    {r.date}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* You Might Also Like */}
      <section
        className="reveal"
        style={{
          padding: isMobile ? "64px 20px" : "96px 40px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "'Raleway', sans-serif",
              marginBottom: "12px",
            }}
          >
            From Our Kitchen
          </span>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              fontWeight: 500,
              color: "var(--text)",
              lineHeight: 1.1,
            }}
          >
            You Might Also Like
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {relatedProducts.map((p, i) => (
            <article
              key={p.id}
              className="reveal"
              style={{
                background: "rgba(194,135,81,0.06)",
                border: "1px solid rgba(194,135,81,0.18)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                )
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(215,35,31,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ overflow: "hidden", aspectRatio: "4/3" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "20px" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    fontWeight: 700,
                    color: "var(--accent)",
                    fontFamily: "'Raleway', sans-serif",
                    marginBottom: "6px",
                  }}
                >
                  {p.category}
                </span>
                <h3
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    color: "var(--text)",
                    marginBottom: "6px",
                    lineHeight: 1.2,
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                    fontFamily: "'Raleway', sans-serif",
                    lineHeight: 1.5,
                    marginBottom: "16px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "1.4rem",
                      fontWeight: 500,
                      color: "var(--primary)",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({
                        id: String(p.id),
                        name: p.name,
                        price: p.price,
                        quantity: 1,
                        image: p.img,
                      });
                    }}
                    style={{
                      padding: "8px 16px",
                      background: "var(--accent)",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      color: "#fff",
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <button
            onClick={() => router.push("/shop")}
            style={{
              padding: "16px 48px",
              background: "transparent",
              border: "2px solid rgba(255,199,44,0.4)",
              borderRadius: "12px",
              cursor: "pointer",
              color: "var(--primary)",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.03em",
              transition: "transform 0.15s ease, border-color 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.background = "rgba(255,199,44,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "rgba(255,199,44,0.4)";
              e.currentTarget.style.background = "transparent";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            View Full Menu →
          </button>
        </div>
      </section>

      {/* Mobile Sticky Bottom Bar */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 20px",
            background: "rgba(18,16,10,0.97)",
            borderTop: "1px solid rgba(194,135,81,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            zIndex: 50,
            backdropFilter: "blur(16px)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.5rem",
                fontWeight: 500,
                color: "var(--primary)",
                lineHeight: 1,
              }}
            >
              ₹{finalPrice.toLocaleString("en-IN")}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--muted)",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              incl. add-ons
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              maxWidth: "220px",
              height: "48px",
              background: added ? "rgba(215,35,31,0.85)" : "var(--accent)",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#fff",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.9375rem",
              fontWeight: 700,
              transition: "background 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}