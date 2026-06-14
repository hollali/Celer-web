import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/components/providers";
import ThemeProvider from "@/components/theme-provider";
import "./globals.css";

const plusJakartaSans = localFont({
  src: [
    { path: "../assets/fonts/PlusJakartaSans-ExtraLight.ttf", weight: "200" },
    { path: "../assets/fonts/PlusJakartaSans-Light.ttf", weight: "300" },
    { path: "../assets/fonts/PlusJakartaSans-Regular.ttf", weight: "400" },
    { path: "../assets/fonts/PlusJakartaSans-Medium.ttf", weight: "500" },
    { path: "../assets/fonts/PlusJakartaSans-SemiBold.ttf", weight: "600" },
    { path: "../assets/fonts/PlusJakartaSans-Bold.ttf", weight: "700" },
    { path: "../assets/fonts/PlusJakartaSans-ExtraBold.ttf", weight: "800" },
  ],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Celer - Fast. Safe. Ghanaian.",
  description: "Celer ride-hailing application for Ghana",
  icons: { icon: "/celer-favicon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('celer-theme');
                  var resolved = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : null;
                  if (!resolved) resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  if (resolved === 'dark') document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
