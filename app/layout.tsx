import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ניהול חיפוש עבודה",
  description: "מעקב אחר מועמדויות, שלבי גיוס וניתוח בדיעבד",
};

// Runs before hydration to set the theme class and avoid a flash of the wrong mode.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen antialiased">
        <Sidebar />
        {/* Reserve space on the right for the floating icon rail (RTL). */}
        <main className="min-w-0 pr-16 sm:pr-20">{children}</main>
      </body>
    </html>
  );
}
