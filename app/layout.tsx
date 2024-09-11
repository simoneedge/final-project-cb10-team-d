import Header from "@/src/components/Header";
import "./globals.css";
import { ReactNode } from "react";
import Footer from "@/src/components/Footer";


interface LayoutProps {
  children: ReactNode;  
}

export default function RootLayout({ children }: LayoutProps) { 
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
