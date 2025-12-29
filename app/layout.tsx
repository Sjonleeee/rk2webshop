import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import ClientLayout from "./_client-layout/ClientLayout";

export const metadata: Metadata = {
  title: "R/K2© Webshop",
  description: "R/K2© Webshop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-antikor antialiased">
        <ClientLayout>
          <ConditionalNavbar />
          <main>{children}</main>
          <ConditionalFooter />
        </ClientLayout>
      </body>
    </html>
  );
}
