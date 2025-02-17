import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chat Educativo - Unidad Educativa Fiscal Eloy Alfaro",
  description: "Plataforma de comunicación para la comunidad educativa",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R-removebg-preview-AjSoB6P5fWC8jC4xjI9kmnF4dRjFjw.png",
        href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R-removebg-preview-AjSoB6P5fWC8jC4xjI9kmnF4dRjFjw.png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-background flex flex-col">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  )
}

