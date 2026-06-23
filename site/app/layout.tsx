import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ToastProvider } from "@/components/toast";
import { getSiteConfigFromCms } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfigFromCms();
  return {
    title: {
      default: config.title,
      template: `%s · ${config.name}`,
    },
    description: config.description,
    metadataBase: new URL(config.url),
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.url,
      siteName: config.name,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfigFromCms();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ToastProvider>
          <SiteHeader config={config} />
          <main className="flex-1">{children}</main>
          <SiteFooter config={config} />
        </ToastProvider>
      </body>
    </html>
  );
}
