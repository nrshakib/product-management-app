import { Providers } from "@/utils/providers";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Product Management App",
  description: "Generated with Next.js 15",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
