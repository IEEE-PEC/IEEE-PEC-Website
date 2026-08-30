"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Menu,
  Layers,
  Users,
  FolderGit2,
  Calendar,
  BookOpen,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Home", href: "/", icon: Sparkles },
  { name: "Chapters", href: "/chapters", icon: Layers },
  { name: "Team", href: "/team", icon: Users },
  { name: "Projects", href: "/project", icon: FolderGit2 },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Resources", href: "/resources", icon: BookOpen },
  { name: "Contact", href: "/contact", icon: Send },
];

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md border border-border/80 p-1 group-hover:scale-105 transition-transform duration-200">
              <img
                src="/images/logos/ieee-pec-logo.png"
                alt="IEEE PEC SB Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground group-hover:text-[#00629B] transition-colors leading-tight">
                IEEE PEC
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Student Branch
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? router.pathname === "/"
                  : router.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[#00629B]/10 text-[#00629B] font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Join IEEE CTA + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-[#00629B] to-[#0080CC] hover:from-[#004B7A] hover:to-[#00629B] text-white shadow-sm font-medium text-xs sm:text-sm rounded-xl px-4"
            >
              <Link href="/apply">
                Join IEEE
              </Link>
            </Button>

            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#002855] via-[#00629B] to-[#00A3E0] flex items-center justify-center text-white font-bold text-xs">
                      IEEE
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">IEEE PEC SB</h4>
                      <p className="text-xs text-muted-foreground">Punjab Engineering College</p>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-1">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === "/"
                          ? router.pathname === "/"
                          : router.pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? "bg-[#00629B] text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#00629B]"}`} />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-6 border-t border-border">
                  <Button asChild className="w-full bg-[#00629B] hover:bg-[#004B7A] text-white rounded-xl">
                    <Link href="/apply" onClick={() => setMobileMenuOpen(false)}>
                      Join IEEE Student Branch
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
