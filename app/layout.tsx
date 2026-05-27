import type { Metadata } from "next";
import CartProvider from "../components/CartContext";
import Toast from "../components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macdonald",
  description: "Premium D2C Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.png" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;0,500;0,600;0,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Raleway:wght@400;500;600;700&display=swap" />
      </head>
      <body>
        <CartProvider>
          <Toast />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
