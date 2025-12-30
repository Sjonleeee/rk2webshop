import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./_client-layout/ClientLayout";

export const metadata: Metadata = {
  title: "R/K2© Webshop",
  description: "R/K2© Webshop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-antikor antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
