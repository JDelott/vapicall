import "./globals.css";
import { Inter } from "next/font/google";
// import Header from "@/components/layout/Header";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VAPI Call - AI-Powered Phone Calls",
  description: "Make intelligent phone calls with our AI assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex min-h-full flex-col bg-dark-900 text-gray-100`}>
        {/* <Header /> */}
        <main className="flex-grow">{children}</main>
       
      </body>
    </html>
  );
}
