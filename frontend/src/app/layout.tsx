import type { Metadata } from "next";
import { instrumentSerif } from "../lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResuMatch",
  description: "Shape your resume to your dream job",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} antialiased bg-[#f4f4f4] text-[#111]`}>
        {children}
      </body>
    </html>
  );
}
