"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], removeItem, clearCart } = (useCart() ?? {}) as any;

  const subtotal: number = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [payData, setPayData] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
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

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email is required.";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) e.phone = "Enter a valid 10-digit phone number.";
    if (!address.trim()) e.address = "Address is required.";
    if (!city.trim()) e.city = "City is required.";
    if (!state.trim()) e.state = "State is required.";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) e.pin = "Enter a valid 6-digit PIN code.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePayNow() {
    if (!validate()) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i: any) => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch {
      setPaying(false);
    }
  }

  async function payNow() {
    if (typeof (window as any).PaymentRequest !== "undefined") {
      try {
        const req = new (window as any).PaymentRequest(
          [
            {
              supportedMethods: "https://tez.google.com/pay",
              data: {
                pa: payData.upiId,
                tr: payData.orderId,
                am: String(payData.amount),
                cu: "INR",
              },
            },
          ],
          {
            total: {
              label: "Total",
              amount: { currency: "INR", value: String(payData.amount) },
            },
          }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete("success");
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function confirmOrder() {
    setConfirming(true);
    try {
      await fetch("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i: any) => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "Macdonald",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      setPaid(true);
      if (clearCart) clearCart();
    } catch {
      setConfirming(false);
    }
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: errors[field] ? "1.5px solid #D7231F" : "1.5px solid rgba(168,123,82,0.35)",
    background: "rgba(194,135,81,0.10)",
    color: "var(--text)",
    fontSize: "15px",
    fontFamily: "'Raleway', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontWeight: 600,
    color: "var(--muted)",
    marginBottom: "6px",
    fontFamily: "'Raleway', sans-serif",
  };

  const errorStyle: React.CSSProperties = {
    color: "#D7231F",
    fontSize: "12px",
    marginTop: "4px",
    fontFamily: "'Raleway', sans-serif",
  };

  if (items.length === 0 && !paid) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Raleway:wght@400;500;600;700&display=swap');
          :root { --bg:#12100A; --surface:#C28751; --primary:#FFC72C; --accent:#D7231F; --text:#F5F0E8; --muted:#A87B52; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: var(--bg); color: var(--text); }
        `}</style>
        <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", padding: "48px 24px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,199,44,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", fontStyle: "italic", color: "var(--text)", marginBottom: "12px" }}>Your cart is empty</h2>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "16px", color: "var(--muted)", lineHeight: 1.6 }}>Looks like you haven't added anything yet. Time to indulge.</p>
          </div>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{ padding: "16px 48px", borderRadius: "12px", background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: "16px", fontFamily: "'Raleway', sans-serif", border: "none", cursor: "pointer", transition: "transform 0.15s ease", letterSpacing: "0.04em" }}
          >
            Start Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Raleway:wght@400;500;600;700&display=swap');
        :root { --bg:#12100A; --surface:#C28751; --primary:#FFC72C; --accent:#D7231F; --text:#F5F0E8; --muted:#A87B52; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); }
        input::placeholder { color: var(--muted); opacity: 0.6; }
        input:focus { border-color: var(--primary) !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--surface); border-radius: 3px; }
        @media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr !important; } .checkout-summary { order: -1; } }
        @media (max-width: 480px) { .checkout-hero-title { font-size: 2rem !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        {/* Navbar */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(18,16,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(168,123,82,0.18)", padding: "0 32px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)" }}>
              <img src="/logo.png" alt="Macdonald logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
            </div>
            <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
              <span
                onClick={() => router.push("/")}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--muted)", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >Home</span>
              <span
                onClick={() => router.push("/shop")}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--muted)", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >Shop</span>
            </div>
          </div>
        </nav>

        {/* Page Header */}
        <div className="reveal" style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 32px 0" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", marginBottom: "12px" }}>Secure Checkout</p>
          <h1
            className="checkout-hero-title"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "8px" }}
          >
            Almost There — <span style={{ color: "var(--primary)" }}>One Last Step</span>
          </h1>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "15px", color: "var(--muted)", lineHeight: 1.6 }}>Fill in your details and pay securely via UPI.</p>
        </div>

        {/* Progress bar */}
        <div style={{ maxWidth: "1280px", margin: "24px auto 0", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0", fontFamily: "'Raleway', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>
            {["Cart", "Delivery", "Payment"].map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: i <= 1 ? "var(--primary)" : "rgba(168,123,82,0.2)",
                  color: i <= 1 ? "#12100A" : "var(--muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 700
                }}>{i + 1}</div>
                <span style={{ marginLeft: "8px", color: i <= 1 ? "var(--text)" : "var(--muted)", textTransform: "uppercase" }}>{step}</span>
                {i < 2 && <div style={{ width: "40px", height: "1px", background: i < 1 ? "var(--primary)" : "rgba(168,123,82,0.3)", margin: "0 12px" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div
          className="checkout-grid reveal"
          style={{ maxWidth: "1280px", margin: "40px auto 0", padding: "0 32px 96px", display: "grid", gridTemplateColumns: "1fr 420px", gap: "32px", alignItems: "start" }}
        >
          {/* ── LEFT: FORM ── */}
          <div style={{ background: "rgba(194,135,81,0.07)", borderRadius: "20px", padding: "40px", border: "1px solid rgba(168,123,82,0.18)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.6rem", fontWeight: 700, color: "var(--text)", marginBottom: "32px" }}>Delivery Details</h2>

            {/* Name */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: "" })); }}
                placeholder="Rahul Sharma"
                style={inputStyle("name")}
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            {/* Email + Phone row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: "" })); }}
                  placeholder="rahul@example.com"
                  style={inputStyle("email")}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); if (errors.phone) setErrors(prev => ({ ...prev, phone: "" })); }}
                  placeholder="9876543210"
                  style={inputStyle("phone")}
                />
                {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Street Address</label>
              <input
                type="text"
                value={address}
                onChange={e => { setAddress(e.target.value); if (errors.address) setErrors(prev => ({ ...prev, address: "" })); }}
                placeholder="Flat / House No., Street, Colony"
                style={inputStyle("address")}
              />
              {errors.address && <p style={errorStyle}>{errors.address}</p>}
            </div>

            {/* City + State row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => { setCity(e.target.value); if (errors.city) setErrors(prev => ({ ...prev, city: "" })); }}
                  placeholder="Mumbai"
                  style={inputStyle("city")}
                />
                {errors.city && <p style={errorStyle}>{errors.city}</p>}
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input
                  type="text"
                  value={state}
                  onChange={e => { setState(e.target.value); if (errors.state) setErrors(prev => ({ ...prev, state: "" })); }}
                  placeholder="Maharashtra"
                  style={inputStyle("state")}
                />
                {errors.state && <p style={errorStyle}>{errors.state}</p>}
              </div>
            </div>

            {/* PIN */}
            <div style={{ marginBottom: "32px" }}>
              <label style={labelStyle}>PIN Code</label>
              <input
                type="text"
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); if (errors.pin) setErrors(prev => ({ ...prev, pin: "" })); }}
                placeholder="400001"
                style={inputStyle("pin")}
              />
              {errors.pin && <p style={errorStyle}>{errors.pin}</p>}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(168,123,82,0.2)", marginBottom: "32px" }} />

            {/* Payment method indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,199,44,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--text)" }}>UPI Payment</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "var(--muted)" }}>Google Pay · PhonePe · Paytm · Any UPI app</p>
              </div>
              <div style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: "999px", background: "rgba(255,199,44,0.15)", fontFamily: "'Raleway', sans-serif", fontSize: "11px", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.06em" }}>SECURE</div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={paying}
              onMouseEnter={e => !paying && (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => !paying && (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => !paying && (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "12px",
                background: paying ? "rgba(215,35,31,0.5)" : "var(--accent)",
                color: "#fff",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "0.04em",
                border: "none",
                cursor: paying ? "not-allowed" : "pointer",
                transition: "transform 0.15s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: paying ? "none" : "0 10px 30px -8px rgba(215,35,31,0.45)"
              }}
            >
              {paying ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Preparing Payment…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Proceed to Pay — ₹{total.toLocaleString("en-IN")}
                </>
              )}
            </button>

            <button
              onClick={() => router.push("/shop")}
              style={{ width: "100%", marginTop: "12px", padding: "12px", background: "transparent", border: "1px solid rgba(168,123,82,0.3)", borderRadius: "12px", color: "var(--muted)", fontFamily: "'Raleway', sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--muted)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(168,123,82,0.3)"; e.currentTarget.style.color = "var(--muted)"; }}
            >
              ← Continue Shopping
            </button>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div className="checkout-summary" style={{ position: "sticky", top: "88px" }}>
            <div style={{ background: "rgba(194,135,81,0.07)", borderRadius: "20px", padding: "32px", border: "1px solid rgba(168,123,82,0.18)" }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "24px" }}>
                Order Summary
                <span style={{ fontSize: "14px", fontFamily: "'Raleway', sans-serif", fontStyle: "normal", fontWeight: 600, color: "var(--muted)", marginLeft: "8px" }}>({items.length} item{items.length !== 1 ? "s" : ""})</span>
              </h2>

              {/* Items list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                {items.map((item: any) => (
                  <div key={item.id} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <div style={{ flexShrink: 0, width: "64px", height: "64px", borderRadius: "10px", overflow: "hidden", background: "rgba(194,135,81,0.15)", border: "1px solid rgba(168,123,82,0.2)" }}>
                      <img
                        src={item.image || item.img}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--text)", lineHeight: 1.3, marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "var(--muted)" }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--primary)" }}>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => removeItem && removeItem(item.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "var(--muted)", display: "flex" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(168,123,82,0.2)", marginBottom: "20px" }} />

              {/* Pricing breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", color: "var(--muted)" }}>Subtotal</span>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", color: "var(--muted)" }}>Delivery</span>
                  {shipping === 0 ? (
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", fontWeight: 700, color: "#4CAF50" }}>FREE</span>
                  ) : (
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>₹{shipping}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,199,44,0.08)", border: "1px solid rgba(255,199,44,0.2)" }}>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "var(--muted)" }}>
                      Add <span style={{ color: "var(--primary)", fontWeight: 700 }}>₹{(500 - subtotal).toLocaleString("en-IN")}</span> more for free delivery
                    </p>
                    <div style={{ marginTop: "6px", height: "4px", borderRadius: "999px", background: "rgba(168,123,82,0.2)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min((subtotal / 500) * 100, 100)}%`, background: "var(--primary)", borderRadius: "999px", transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Total */}
              <div style={{ height: "1px", background: "rgba(168,123,82,0.2)", marginBottom: "20px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.1rem", color: "var(--text)", fontWeight: 700 }}>Total</span>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.5rem", color: "var(--primary)", fontWeight: 700, letterSpacing: "-0.02em" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "100% Secure UPI Payment" },
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, text: "Fast delivery within 30–45 mins" },
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, text: "Trusted by 10,000+ customers weekly" },
                ].map((badge, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--primary)" }}>{badge.icon}</span>
                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "var(--muted)" }}>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── UPI PAYMENT OVERLAY ── */}
        {payData && !paid && (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          >
            <div style={{ background: "#1A1710", borderRadius: "20px", padding: "32px", maxWidth: "420px", width: "100%", border: "1px solid rgba(168,123,82,0.25)", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)" }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)" }}>
                  <img src="/logo.png" alt="Macdonald" style={{ height: "32px", objectFit: "contain" }} />
                </div>
                <button
                  onClick={() => { setPayData(null); setPaying(false); setPaymentLaunched(false); }}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(168,123,82,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(215,35,31,0.2)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(168,123,82,0.15)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Amount */}
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", marginBottom: "6px" }}>Amount to Pay</p>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "2.8rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>₹{payData.amount?.toLocaleString("en-IN")}</p>
              </div>

              {/* Mobile vs Desktop */}
              {isMobile ? (
                <div style={{ marginBottom: "24px" }}>
                  {!paymentLaunched ? (
                    <>
                      <button
                        onClick={payNow}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                        onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                        onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                        style={{ width: "100%", height: "56px", borderRadius: "12px", background: "var(--accent)", color: "#fff", fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "16px", border: "none", cursor: "pointer", transition: "transform 0.15s ease", marginBottom: "8px", boxShadow: "0 10px 30px -8px rgba(215,35,31,0.45)" }}
                      >
                        Pay ₹{payData.amount?.toLocaleString("en-IN")} Now
                      </button>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "var(--muted)", textAlign: "center" }}>Opens Google Pay · PhonePe · Paytm</p>
                    </>
                  ) : (
                    <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)", textAlign: "center" }}>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", fontWeight: 600, color: "#4CAF50", lineHeight: 1.5 }}>Payment app opened — confirm below once done</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div style={{ padding: "12px", borderRadius: "12px", background: "#fff" }}>
                    {payData.qrBase64 ? (
                      <img src={`data:image/png;base64,${payData.qrBase64}`} width={180} height={180} alt="UPI QR Code" style={{ display: "block" }} />
                    ) : (
                      <div style={{ width: "180px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", borderRadius: "8px" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/>
                          <line x1="14" y1="14" x2="14" y2="14"/><line x1="18" y1="14" x2="22" y2="14"/><line x1="14" y1="18" x2="14" y2="22"/><line x1="18" y1="18" x2="22" y2="22"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "13px", color: "var(--muted)", textAlign: "center" }}>Scan with any UPI app — Google Pay, PhonePe, Paytm</p>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(168,123,82,0.2)", marginBottom: "20px" }} />

              {/* Confirm section */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ ...labelStyle, marginBottom: "8px" }}>UPI Transaction ID (optional)</label>
                <input
                  type="text"
                  value={upiTxnId}
                  onChange={e => setUpiTxnId(e.target.value)}
                  placeholder="e.g. 123456789012"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid rgba(168,123,82,0.25)", background: "rgba(194,135,81,0.08)", color: "var(--text)", fontSize: "14px", fontFamily: "'Raleway', sans-serif", outline: "none" }}
                />
              </div>

              <button
                onClick={confirmOrder}
                disabled={confirming}
                onMouseEnter={e => !confirming && (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => !confirming && (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => !confirming && (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  width: "100%", height: "52px", borderRadius: "12px",
                  background: confirming ? "rgba(255,199,44,0.5)" : "var(--primary)",
                  color: "#12100A", fontFamily: "'Raleway', sans-serif",
                  fontWeight: 700, fontSize: "15px", border: "none",
                  cursor: confirming ? "not-allowed" : "pointer",
                  transition: "transform 0.15s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}
              >
                {confirming ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Confirming…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    I've Paid — Confirm Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── SUCCESS OVERLAY ── */}
        {paid && payData && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div style={{ background: "#1A1710", borderRadius: "24px", padding: "48px 40px", maxWidth: "440px", width: "100%", border: "1px solid rgba(76,175,80,0.3)", textAlign: "center", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7)" }}>
              {/* Success icon */}
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(76,175,80,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "2rem", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>Order Confirmed!</h2>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", color: "var(--muted)", marginBottom: "24px", lineHeight: 1.6 }}>
                Thank you, {name || "there"}! Your delicious food is on its way.
              </p>

              <div style={{ padding: "16px 20px", borderRadius: "12px", background: "rgba(255,199,44,0.08)", border: "1px solid rgba(255,199,44,0.2)", marginBottom: "24px" }}>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", marginBottom: "4px" }}>Order ID</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.08em" }}>#{payData.orderId?.slice(-8)?.toUpperCase()}</p>
              </div>

              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", color: "var(--muted)", marginBottom: "32px", lineHeight: 1.6 }}>
                We'll deliver to <span style={{ color: "var(--text)", fontWeight: 600 }}>{city || "your location"}</span> within 30–45 minutes.
              </p>

              <button
                onClick={() => router.push("/")}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{ width: "100%", height: "52px", borderRadius: "12px", background: "var(--accent)", color: "#fff", fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer", transition: "transform 0.15s ease", boxShadow: "0 10px 30px -8px rgba(215,35,31,0.45)" }}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ background: "rgba(18,16,10,0.98)", borderTop: "1px solid rgba(168,123,82,0.18)", padding: "48px 32px 32px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between", marginBottom: "40px" }}>
              <div>
                <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", display: "inline-block", marginBottom: "12px" }}>
                  <img src="/logo.png" alt="Macdonald" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
                </div>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "13px", color: "var(--muted)", maxWidth: "200px", lineHeight: 1.6 }}>Unleash Your Craving</p>
              </div>
              <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--text)", marginBottom: "14px" }}>Navigate</p>
                  {[["Home", () => router.push("/")], ["Shop", () => router.push("/shop")], ["Checkout", () => router.push("/checkout")]].map(([label, action]) => (
                    <p key={label as string} onClick={action as any} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "14px", color: "var(--muted)", marginBottom: "10px", cursor: "pointer", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                    >{label as string}</p>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(168,123,82,0.15)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "var(--muted)" }}>© 2026 Macdonald. All rights reserved.</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "var(--muted)" }}>Made with ❤️ in India</p>
            </div>
          </div>
        </footer>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </>
  );
}