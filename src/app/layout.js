import { Providers } from "@/utils/providers";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export const metadata = {
  title: "Product Management App",
  description: "Generated with Next.js 15",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <Toaster richColors position="top-right" />
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
