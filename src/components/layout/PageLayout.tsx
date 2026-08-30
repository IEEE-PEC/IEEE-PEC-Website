import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-[#00629B]/20 selection:text-[#002855]">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
