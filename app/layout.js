import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Final_Year_Project",
  description: "Final Year Project by Aditi Singh",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="bg-muted/50 py-10 md:py-12">
              <div className="container mx-auto px-4 flex flex-col items-center text-gray-400">

                {/* Top Row: Author & Contact (Larger Font) */}
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-8 text-lg mb-4">

                  {/* Made By */}
                  <p>
                    Made by - <strong className="font-bold text-gray-200">ADITI SINGH</strong>
                  </p>

                  {/* Separator (Optional for a large look) */}
                  <span className="hidden sm:inline-block text-gray-600">|</span>

                  {/* Contact Link */}
                  <p>
                    Contact:
                    <a
                      href="mailto:aditiisinghh04@gmail.com"
                      className="hover:text-white transition-colors ml-1 underline underline-offset-4"
                    >
                      aditiisinghh04@gmail.com
                    </a>
                  </p>
                </div>

                {/* Bottom Row: Copyright (Standard/Slightly Smaller Font) */}
                <p className="mt-4 text-base text-gray-500">
                  &copy; {new Date().getFullYear()} Prep-Infinity. All rights reserved.
                </p>

              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
