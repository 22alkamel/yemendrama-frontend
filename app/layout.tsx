import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yemen Drama",
  description: "أفضل موقع لمشاهدة الدراما اليمنية والمسلسلات بجودة عالية",

  openGraph: {
    title: "Yemen Drama",
    description:
      "أفضل موقع لمشاهدة الدراما اليمنية والمسلسلات بجودة عالية",
    url: "https://yemendrama.com",
    siteName: "Yemen Drama",
    images: [
      {
        url: "https://yemendrama.com/og.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Yemen Drama",
    description:
      "أفضل موقع لمشاهدة الدراما اليمنية والمسلسلات بجودة عالية",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
         <AuthProvider>{children}</AuthProvider>
        {/* {children} */}
      </body>
    </html>
  );
}
