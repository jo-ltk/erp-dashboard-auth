import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

/*
 * One family everywhere — body copy, headings, IDs and numbers all render in
 * Poppins, so the product reads with a single voice. Weight carries hierarchy:
 * 400 body, 500 rows/controls, 600 labels & headings, 700 display.
 */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ERP.net — Enterprise Resource Dashboard",
  description:
    "Modern enterprise resource dashboard for accounts, departments and roles.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}


