import "./globals.css";
import { Inter } from "next/font/google";
// import Header from "@/components/layout/Header";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VAYA Call - AI-Powered Phone Calls",
  description: "Make intelligent phone calls with our AI assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} flex min-h-full flex-col bg-dark-900 text-gray-100`}>
        {/* <Header /> */}
        <main className="flex-grow">{children}</main>
       
      </body>
    </html>
  );
}
