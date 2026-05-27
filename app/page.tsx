"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Classic Double Cheeseburger", description: "Generously stacked double cheeseburger with two beef patties, American cheese, and fresh veggies.", price: 249, category: "Burgers" },
  { id: 2, img: "/product-2.jpg", name: "Classic Pepperoni Pizza", description: "Generously topped classic pepperoni pizza with glistening mozzarella and a crispy crust.", price: 60, category: "Pizza" },
  { id: 3, img: "/product-3.jpg", name: "McDonald's Golden Fries", description: "Iconic golden, crispy McDonald's fries, overflowing from their classic red carton.", price: 70, category: "Fries" },
  { id: 4, img: "/product-4.jpg", name: "Crispy Golden Tenders", description: "Succulent golden fried chicken tenders with a rich dipping sauce.", price: 90, category: "Chicken Tenders" },
];

const categoryCards = [
  { label: "Burgers", desc: "Juicy, Stacked, Unforgettable", img: "/product-1.jpg", btn: "Browse Burgers" },
  { label: "Pizza", desc: "Crispy, Saucy, Legendary", img: "/product-2.jpg", btn: "Browse Pizza" },
  { label: "Fries", desc: "Golden, Crispy, Addictive", img: "/product-3.jpg", btn: "Browse Fries" },
  { label: "Chicken Tenders", desc: "Crunchy, Tender, Irresistible", img: "/product-4.jpg", btn: "Browse Chicken Tenders" },
];

const testimonials = [
  { quote: "Every bite of the Double Cheeseburger is an event. I drive 20 minutes just for this fix.", name: "Rohan M.", location: "Mumbai" },
  { quote: "The fries alone are worth the trip. Golden perfection every single time.", name: "Priya K.", location: "Bengaluru" },
  { quote: "Macdonald is the one place where comfort food feels like a celebration.", name: "Arjun S.", location: "Delhi" },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleQuickAdd = (p: typeof products[0]) => {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (_) {}
    setSubscribed(true);
    setEmail("");
  };

  const navLinks = [
    { label: "Menu", action: () => router.push("/shop") },
    { label: "Seasonal", action: () => router.push("/shop") },
    { label: "Our Story", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Gifts", action: () => router.push("/shop") },
  ];

  return (
    <div style={{ fontFamily: "'Raleway', sans-serif", backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Raleway:wght@400;500;600;700&display=swap');
        :root { --bg:#12100A; --surface:#C28751; --primary:#FFC72C; --accent:#D7231F; --text:#F5F0E8; --muted:#A87B52; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: var(--primary); color: var(--bg); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--surface); border-radius: 3px; }
        .carousel-track { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; padding-bottom: 12px; }
        .carousel-track::-webkit-scrollbar { display: none; }
        .carousel-card { scroll-snap-align: start; flex-shrink: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity:0; } to { transform: scale(1); opacity:1; } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .halo-ring { animation: rotate 18s linear infinite; transform-origin: center; }
        .nav-link { position: relative; color: var(--text); text-decoration: none; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; transition: color 0.2s ease; background: none; border: none; cursor: pointer; font-family: 'Raleway', sans-serif; }
        .nav-link::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 0; height: 2px; background: var(--primary); transition: width 0.25s ease; }
        .nav-link:hover { color: var(--primary); }
        .nav-link:hover::after { width: 100%; }
        .focus-ring:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; border-radius: 4px; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: scrolled ? "rgba(18,16,10,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(194,135,81,0.2)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background-color 0.2s ease, border-bottom 0.2s ease",
        padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "72px",
      }}>
        <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)" }}>
          <img src="/logo.png" alt="Macdonald logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} className="focus-ring" />
        </div>
        <div style={{ display: "flex", gap: "40px", alignItems: "center" }} className="desktop-nav">
          {navLinks.map((l) => (
            <button key={l.label} onClick={l.action} className="nav-link focus-ring">{l.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/checkout")} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "8px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
          <button onClick={() => setMobileNavOpen(true)} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }} id="hamburger-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE NAV OVERLAY */}
      {mobileNavOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          backgroundColor: "#12100A",
          animation: "scaleIn 0.3s ease-out",
          display: "flex", flexDirection: "column", padding: "32px",
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setMobileNavOpen(false)} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {navLinks.map((l) => (
              <button key={l.label} onClick={() => { l.action(); setMobileNavOpen(false); }} style={{
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--text)",
                padding: "16px 0", borderBottom: "1px solid rgba(194,135,81,0.15)",
              }}>{l.label}</button>
            ))}
          </div>
          <div style={{ marginTop: "auto", fontSize: "0.875rem", color: "var(--muted)" }}>Macdonald — Best Junk Foods</div>
        </div>
      )}

      {/* HERO SECTION */}
      <section style={{
        minHeight: "100vh", display: "grid", gridTemplateColumns: "40fr 60fr",
        alignItems: "stretch", overflow: "hidden", position: "relative",
      }}>
        {/* Left text column */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "120px 56px 96px 80px", gap: "28px", position: "relative", zIndex: 2,
          background: "linear-gradient(135deg, #12100A 0%, #1a160e 100%)",
        }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--primary)", fontFamily: "'Raleway', sans-serif" }}>
            Macdonald Originals
          </span>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(3rem, 5vw, 5rem)", lineHeight: 1.04, letterSpacing: "-0.03em",
            color: "var(--text)",
          }}>
            Built for<br />
            <span style={{ color: "var(--primary)" }}>Serious</span><br />
            Cravings
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "360px", fontWeight: 400 }}>
            Double-stacked. Flame-kissed. Unreasonably delicious. The kind of food that makes you close your eyes on the first bite.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => router.push("/shop")}
              className="focus-ring"
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                padding: "0 48px", height: "56px", borderRadius: "12px", border: "none", cursor: "pointer",
                background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: "1rem",
                fontFamily: "'Raleway', sans-serif", letterSpacing: "0.04em",
                boxShadow: "0 12px 40px -10px rgba(215,35,31,0.55)",
                transition: "transform 0.15s ease",
              }}
            >
              Indulge Now
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", fontSize: "0.8rem", color: "var(--muted)", fontWeight: 500 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "var(--primary)" }}>★★★★★</span> 4.9 · 10,000+ happy customers weekly
            </span>
            <span>🇮🇳 Made in India</span>
            <span>Free delivery above ₹299</span>
          </div>
        </div>

        {/* Right full-bleed image */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(180deg, #1a140a 0%, #2a1f0f 50%, #FFC72C22 100%)",
        }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 40px 80px 0" }}>
            <img
              src="/product-1.jpg"
              alt="Classic Double Cheeseburger - Macdonald's signature stack"
              style={{
                width: "90%", maxWidth: "580px", height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0px 24px 80px rgba(255,199,44,0.25)) drop-shadow(0 48px 100px rgba(0,0,0,0.6))",
                animation: "fadeUp 0.9s ease-out forwards",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          {/* Ambient glow */}
          <div style={{
            position: "absolute", bottom: "-80px", left: "50%", transform: "translateX(-50%)",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,199,44,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        </div>
      </section>

      {/* BOLD FLAVORS GRID */}
      <section id="flavors" style={{ backgroundColor: "#1C160D", padding: "96px 80px" }}>
        <div className="reveal" style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "56px" }}>
            <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--muted)", fontFamily: "'Raleway', sans-serif" }}>
              What We Do Best
            </span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2.4rem, 4vw, 3.6rem)", lineHeight: 1.06, letterSpacing: "-0.025em",
              color: "var(--text)", marginTop: "12px",
            }}>
              Bold Flavors,<br />Real Crave
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "32px", marginBottom: "56px" }}>
            {categoryCards.map((c, i) => (
              <div
                key={c.label}
                className="reveal"
                style={{
                  borderRadius: "16px",
                  background: "var(--bg)",
                  border: "1px solid rgba(194,135,81,0.18)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  transitionDelay: `${i * 80}ms`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(255,199,44,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px -8px rgba(0,0,0,0.4)";
                }}
              >
                <div style={{ overflow: "hidden", aspectRatio: "1/1", background: "#1e1810" }}>
                  <img
                    src={c.img}
                    alt={`${c.label} - Macdonald`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <h3 style={{
                    fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 600,
                    fontSize: "1.25rem", color: "var(--text)", textAlign: "center", lineHeight: 1.2,
                  }}>
                    <span style={{ color: "var(--accent)" }}>{c.label.charAt(0)}</span>{c.label.slice(1)}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--muted)", textAlign: "center", marginTop: "6px", lineHeight: 1.5, fontWeight: 400 }}>{c.desc}</p>
                  <button
                    onClick={() => router.push("/shop")}
                    className="focus-ring"
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    style={{
                      marginTop: "16px", width: "100%", padding: "10px 0", borderRadius: "9999px",
                      border: "1px solid rgba(255,199,44,0.3)", background: "transparent",
                      color: "var(--primary)", fontFamily: "'Raleway', sans-serif", fontWeight: 600,
                      fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
                      transition: "transform 0.15s ease",
                    }}
                  >{c.btn}</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => router.push("/shop")}
              className="focus-ring"
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                padding: "14px 48px", borderRadius: "12px", border: "2px solid var(--primary)",
                background: "transparent", color: "var(--primary)", fontFamily: "'Raleway', sans-serif",
                fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.06em", cursor: "pointer",
                textTransform: "uppercase", transition: "transform 0.15s ease",
              }}
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* FLAVOR PROFILE HALO — VISUAL FINGERPRINT */}
      <section style={{ backgroundColor: "var(--bg)", padding: "96px 80px", overflow: "hidden" }}>
        <div className="reveal" style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--muted)" }}>
              What Makes Us Different
            </span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.1, color: "var(--text)", marginTop: "12px",
            }}>
              Flavor Profile Halo
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--muted)", marginTop: "12px", lineHeight: 1.7, maxWidth: "500px", margin: "12px auto 0" }}>
              Every ingredient, every layer — crafted for maximum craving.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "48px", justifyItems: "center" }}>
            {[
              { img: "/product-1.jpg", alt: "Classic Double Cheeseburger halo", text: "DOUBLE PATTY • CHEESE • FRESH LETTUCE • SPECIAL SAUCE •", label: "UMAMI RICHNESS" },
              { img: "/product-2.jpg", alt: "Classic Pepperoni Pizza halo", text: "PEPPERONI • MOZZARELLA • CRISPY CRUST • TOMATO SAUCE •", label: "BOLD HEAT" },
              { img: "/product-3.jpg", alt: "McDonald's Golden Fries halo", text: "GOLDEN CRUST • SEA SALT • POTATO PERFECTION • CRISPY •", label: "SALTY CRUNCH" },
              { img: "/product-4.jpg", alt: "Crispy Golden Tenders halo", text: "CRUNCHY COAT • TENDER MEAT • DIPPING SAUCE • SPICY •", label: "SPICY KICK" },
            ].map((item, i) => (
              <div key={i} className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", transitionDelay: `${i * 100}ms` }}>
                <div style={{ position: "relative", width: "180px", height: "180px" }}>
                  {/* Circular image */}
                  <div style={{
                    position: "absolute", inset: "16px", borderRadius: "50%", overflow: "hidden",
                    border: "2px solid rgba(255,199,44,0.4)",
                    boxShadow: "0 0 0 1px rgba(194,135,81,0.3), 0 8px 32px rgba(0,0,0,0.5)",
                  }}>
                    <img
                      src={item.img}
                      alt={item.alt}
                      style={{
                        width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%",
                        transition: "transform 0.5s ease",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  {/* SVG textPath halo ring */}
                  <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: "absolute", inset: 0 }}>
                    <defs>
                      <path id={`haloCircle${i}`} d="M 90,90 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
                    </defs>
                    <g className="halo-ring">
                      <text fill="var(--accent)" style={{ fontSize: "9px", fontFamily: "'Raleway', sans-serif", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        <textPath href={`#haloCircle${i}`} startOffset="0%">{item.text}</textPath>
                      </text>
                    </g>
                  </svg>
                </div>
                <span style={{
                  fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700,
                  color: "var(--primary)", fontFamily: "'Raleway', sans-serif", textAlign: "center",
                }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR CRAFT EDITORIAL SPLIT */}
      <section id="about" style={{ backgroundColor: "#1C160D", padding: "96px 80px" }}>
        <div className="reveal" style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "55fr 45fr", gap: "64px", alignItems: "center" }}>
          <div style={{ overflow: "hidden", borderRadius: "16px", boxShadow: "0 32px 80px -16px rgba(0,0,0,0.6)" }}>
            <img
              src="/product-1.jpg"
              alt="Handcrafted Macdonald burger being assembled with fresh ingredients"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--muted)" }}>
              Our Craft
            </span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.08, letterSpacing: "-0.02em",
              color: "var(--text)",
            }}>
              Handcrafted<br />Perfection
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", fontWeight: 400 }}>
              Every burger at Macdonald starts with hand-selected beef, fresh-cut vegetables sourced daily, and a sauce recipe that took 18 months to perfect. We don't cut corners — we stack them.
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", fontWeight: 400 }}>
              From flame-kissed patties to perfectly balanced cheese pulls, each element is chosen for its contribution to the total experience of indulgence.
            </p>
            <button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="focus-ring"
              style={{
                alignSelf: "flex-start", padding: "14px 32px", borderRadius: "12px",
                border: "1.5px solid var(--accent)", background: "transparent",
                color: "var(--accent)", fontFamily: "'Raleway', sans-serif", fontWeight: 700,
                fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.02)";
                const arrow = e.currentTarget.querySelector(".arrow") as HTMLElement;
                if (arrow) arrow.style.transform = "translateX(4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                const arrow = e.currentTarget.querySelector(".arrow") as HTMLElement;
                if (arrow) arrow.style.transform = "translateX(0)";
              }}
            >
              Learn More
              <span className="arrow" style={{ transition: "transform 0.2s ease", display: "inline-block", fontSize: "1.1rem" }}>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED CAROUSEL */}
      <section style={{ backgroundColor: "var(--bg)", padding: "96px 0 96px 80px" }}>
        <div className="reveal" style={{ maxWidth: "1280px" }}>
          <div style={{ paddingRight: "80px", marginBottom: "48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--muted)" }}>
                From Our Kitchen
              </span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 700,
                fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.08, color: "var(--text)", marginTop: "8px",
              }}>
                To Yours
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              className="focus-ring"
              style={{
                padding: "10px 28px", borderRadius: "9999px", border: "1.5px solid rgba(255,199,44,0.4)",
                background: "transparent", color: "var(--primary)", fontFamily: "'Raleway', sans-serif",
                fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Shop Now
            </button>
          </div>

          <div className="carousel-track" ref={carouselRef}>
            {products.map((p, i) => (
              <div
                key={p.id}
                className="carousel-card"
                style={{
                  width: "300px", borderRadius: "16px",
                  background: "linear-gradient(145deg, #1e1810 0%, #1a150c 100%)",
                  border: "1px solid rgba(194,135,81,0.2)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(255,199,44,0.18)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{ overflow: "hidden", aspectRatio: "1/1", background: "#12100A", cursor: "pointer" }}
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <h3
                    style={{
                      fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 600,
                      fontSize: "1.2rem", color: "var(--text)", lineHeight: 1.2, cursor: "pointer",
                    }}
                    onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                  >{p.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "6px", lineHeight: 1.5, height: "40px", overflow: "hidden" }}>{p.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", fontFamily: "'Raleway', sans-serif" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuickAdd(p)}
                    className="focus-ring"
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    style={{
                      marginTop: "14px", width: "100%", height: "44px", borderRadius: "10px",
                      border: "none",
                      background: addedId === p.id ? "rgba(255,199,44,0.12)" : "rgba(255,199,44,0.1)",
                      color: addedId === p.id ? "var(--primary)" : "var(--text)",
                      fontFamily: "'Raleway', sans-serif", fontWeight: 600, fontSize: "0.85rem",
                      cursor: "pointer", transition: "transform 0.15s ease, background 0.2s ease",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {addedId === p.id ? "✓ Added!" : "Quick Add"}
                  </button>
                </div>
              </div>
            ))}
            {/* Overflow hint */}
            <div style={{ width: "40px", flexShrink: 0 }} />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section style={{ backgroundColor: "#1C160D", padding: "96px 80px" }}>
        <div className="reveal" style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--muted)" }}>
            What Our Fans Say
          </span>
          <div style={{ position: "relative", marginTop: "32px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--accent)" style={{ opacity: 0.35, position: "absolute", top: "-8px", left: "0" }}>
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <div key={testimonialIdx} style={{ animation: "fadeUp 0.6s ease-out forwards", opacity: 0, padding: "0 56px" }}>
              <p style={{
                fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "clamp(1.4rem, 2.8vw, 2rem)",
                lineHeight: 1.4, color: "var(--text)", fontWeight: 400,
              }}>
                "{testimonials[testimonialIdx].quote}"
              </p>
              <p style={{ marginTop: "24px", fontSize: "0.9rem", fontWeight: 600, color: "var(--accent)", fontFamily: "'Raleway', sans-serif", letterSpacing: "0.08em" }}>
                — {testimonials[testimonialIdx].name}, {testimonials[testimonialIdx].location}
              </p>
            </div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--accent)" style={{ opacity: 0.35, position: "absolute", bottom: "-8px", right: "0", transform: "rotate(180deg)" }}>
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "32px" }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className="focus-ring"
                style={{
                  width: i === testimonialIdx ? "24px" : "8px", height: "8px",
                  borderRadius: "9999px", border: "none", cursor: "pointer",
                  background: i === testimonialIdx ? "var(--primary)" : "rgba(194,135,81,0.4)",
                  transition: "width 0.3s ease, background 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="contact" style={{ backgroundColor: "var(--bg)", padding: "96px 80px" }}>
        <div className="reveal" style={{
          maxWidth: "680px", margin: "0 auto", textAlign: "center",
          padding: "64px 56px", borderRadius: "24px",
          background: "linear-gradient(135deg, #1e1810 0%, #261e12 100%)",
          border: "1px solid rgba(194,135,81,0.25)",
          boxShadow: "0 32px 80px -16px rgba(0,0,0,0.5)",
        }}>
          <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--muted)" }}>
            Stay in the Loop
          </span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, color: "var(--text)", marginTop: "12px",
          }}>
            Craving Updates?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--muted)", marginTop: "12px", lineHeight: 1.7 }}>
            New drops, secret menu items, and limited offers — delivered straight to your inbox.
          </p>
          {subscribed ? (
            <div style={{
              marginTop: "32px", padding: "16px 32px", borderRadius: "12px",
              background: "rgba(255,199,44,0.1)", border: "1px solid rgba(255,199,44,0.3)",
              color: "var(--primary)", fontWeight: 600, fontSize: "1rem",
            }}>
              🎉 Thanks for subscribing! Watch your inbox.
            </div>
          ) : (
            <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="focus-ring"
                style={{
                  flex: 1, height: "52px", borderRadius: "10px",
                  border: "1px solid rgba(194,135,81,0.3)",
                  background: "rgba(0,0,0,0.3)", color: "var(--text)",
                  fontSize: "0.9rem", fontFamily: "'Raleway', sans-serif",
                  padding: "0 18px", outline: "none",
                }}
                onKeyDown={e => e.key === "Enter" && handleSubscribe()}
              />
              <button
                onClick={handleSubscribe}
                className="focus-ring"
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  padding: "0 28px", height: "52px", borderRadius: "10px", border: "none",
                  background: "var(--accent)", color: "#fff", fontFamily: "'Raleway', sans-serif",
                  fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", whiteSpace: "nowrap",
                  boxShadow: "0 8px 24px -8px rgba(215,35,31,0.5)", transition: "transform 0.15s ease",
                }}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#0E0B07", borderTop: "1px solid rgba(194,135,81,0.15)", padding: "80px 80px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "64px", marginBottom: "64px" }}>
            {/* Col1: Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", alignSelf: "flex-start" }}>
                <img src="/logo.png" alt="Macdonald logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85, cursor: "pointer" }} onClick={() => router.push("/")} />
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, fontWeight: 400 }}>
                Unleash Your Craving — best junk foods made with real ingredients and zero apologies.
              </p>
              <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="focus-ring" style={{ color: "var(--muted)", transition: "color 0.2s ease" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="focus-ring" style={{ color: "var(--muted)", transition: "color 0.2s ease" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="focus-ring" style={{ color: "var(--muted)", transition: "color 0.2s ease" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col2: Shop */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--text)", fontFamily: "'Raleway', sans-serif" }}>Shop</h4>
              {["Burgers", "Pizza", "Fries", "Chicken Tenders", "Gift Cards"].map(l => (
                <button key={l} onClick={() => router.push("/shop")} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.9rem", color: "var(--muted)", fontFamily: "'Raleway', sans-serif", padding: 0, transition: "color 0.2s ease" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>{l}</button>
              ))}
            </div>

            {/* Col3: Learn */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--text)", fontFamily: "'Raleway', sans-serif" }}>Learn</h4>
              {[
                { label: "Our Story", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "Ingredients", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "FAQ", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "Press", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "About Us", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
              ].map(l => (
                <button key={l.label} onClick={l.action} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.9rem", color: "var(--muted)", fontFamily: "'Raleway', sans-serif", padding: 0, transition: "color 0.2s ease" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>{l.label}</button>
              ))}
            </div>

            {/* Col4: Newsletter */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 600, fontSize: "1.2rem", color: "var(--text)" }}>Stay in the loop</h4>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>Weekly specials and secret drops — only for subscribers.</p>
              <input
                type="email"
                placeholder="Enter your email"
                className="focus-ring"
                style={{
                  height: "48px", borderRadius: "8px", border: "1px solid rgba(194,135,81,0.3)",
                  background: "rgba(0,0,0,0.3)", color: "var(--text)", fontSize: "0.85rem",
                  fontFamily: "'Raleway', sans-serif", padding: "0 14px", outline: "none",
                }}
              />
              <button
                onClick={handleSubscribe}
                className="focus-ring"
                style={{
                  height: "48px", borderRadius: "8px", border: "none",
                  background: "var(--accent)", color: "#fff", fontFamily: "'Raleway', sans-serif",
                  fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", transition: "transform 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid rgba(194,135,81,0.15)", paddingTop: "32px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", fontSize: "0.78rem", color: "var(--muted)", fontFamily: "'Raleway', sans-serif" }}>
              <span>© 2026 Macdonald. All rights reserved.</span>
              <button onClick={() => document.getElementById("privacy")?.scrollIntoView({ behavior: "smooth" })} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.78rem", fontFamily: "'Raleway', sans-serif", padding: 0 }}>Privacy Policy</button>
              <button onClick={() => document.getElementById("terms")?.scrollIntoView({ behavior: "smooth" })} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.78rem", fontFamily: "'Raleway', sans-serif", padding: 0 }}>Terms of Service</button>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {["VISA", "MC", "AMEX", "UPI"].map(p => (
                <div key={p} style={{
                  padding: "4px 10px", borderRadius: "4px", background: "rgba(255,255,255,0.06)",
                  fontSize: "0.62rem", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em",
                  fontFamily: "'Raleway', sans-serif",
                }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 900px) {
          section:first-of-type > div, section[style*="grid-template-columns: 40fr 60fr"] {
            grid-template-columns: 1fr !important;
          }
          #hamburger-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
        }
        @media (max-width: 768px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
          footer { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
    </div>
  );
}