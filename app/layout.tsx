import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Toaster } from "react-hot-toast"
import { CursorGlow } from "@/components/CursorGlow"

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "JobAI-Your AI-Powered Career Platform",
  description:
    "Resume optimization, interview coaching, and intelligent job matching — everything you need to land your dream role, powered by AI.",
  keywords: ["AI resume builder", "job search AI", "interview prep", "cover letter generator", "ATS optimizer"],
  authors: [{ name: "JobAI" }],
  openGraph: {
    title: "JobAI — Your AI-Powered Career Platform",
    description: "Land your dream role faster with AI-powered resume tools, interview coaching, and job matching.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistMono.variable} antialiased`}
        style={{
          background: "#080808",
          color: "#fff",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <CursorGlow />
        <Navbar />
        {children}
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#141414",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
            },
            success: {
              iconTheme: { primary: "#00E5BE", secondary: "#141414" },
            },
            error: {
              iconTheme: { primary: "#FF7C5C", secondary: "#141414" },
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}