"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  Layers,
  Users,
  FolderGit2,
  Calendar,
  BookOpen,
  Send,
  Sparkles,
  Shield,
  LogOut,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { client } from "@/lib/supabase/supabase";
import { getAssetPath } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";

type Role = "pending" | "interviewer" | "admin";

const baseNavigation = [
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
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  // Load user auth state and profile role
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const {
          data: { session },
        } = await client.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            setUser(null);
            setUserRole(null);
            setFullName(null);
          }
          return;
        }

        if (isMounted) {
          setUser(session.user);
          const immediateName =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            null;
          setFullName(immediateName);
        }

        const { data: profile } = await client
          .from("profiles")
          .select("role, full_name")
          .eq("id", session.user.id)
          .single();

        if (isMounted && profile) {
          setUserRole(profile.role);
          if (profile.full_name) {
            setFullName(profile.full_name);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        if (isMounted) {
          setUser(null);
          setUserRole(null);
          setFullName(null);
        }
        return;
      }

      if (isMounted) {
        setUser(session.user);
        const immediateName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          null;
        setFullName(immediateName);
      }

      const { data: profile } = await client
        .from("profiles")
        .select("role, full_name")
        .eq("id", session.user.id)
        .single();

      if (isMounted && profile) {
        setUserRole(profile.role);
        if (profile.full_name) {
          setFullName(profile.full_name);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await client.auth.signOut();
    setUser(null);
    setUserRole(null);
    setFullName(null);
    window.location.href = "/";
  };

  // Build navigation items dynamically based on role
  const navigation = useMemo(() => {
    const items = [...baseNavigation];

    if (userRole === "interviewer" || userRole === "admin") {
      items.push({
        name: "Interview",
        href: "/interview",
        icon: UserCheck,
      });
    }

    if (userRole === "admin") {
      items.push({
        name: "Admin",
        href: "/interview-admin",
        icon: Shield,
      });
    }

    return items;
  }, [userRole]);

  // Initials for avatar fallback
  const initials = useMemo(() => {
    const name =
      fullName ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email ||
      "U";
    return name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, [fullName, user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md border border-border/80 p-1 group-hover:scale-105 transition-transform duration-200">
              <img
                src={getAssetPath("/images/logos/ieee-pec-logo.png")}
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

          {/* Right Actions: Join IEEE CTA + Member Login / Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-[#00629B] to-[#0080CC] hover:from-[#004B7A] hover:to-[#00629B] text-white shadow-sm font-medium text-xs sm:text-sm rounded-xl px-4"
            >
              <Link href="/apply">Join IEEE</Link>
            </Button>

            {!user ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex text-xs font-medium rounded-xl border-border hover:bg-accent"
              >
                <Link href="/interview-login">Member Login</Link>
              </Button>
            ) : (
              <Popover open={profileOpen} onOpenChange={setProfileOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="User profile menu"
                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                        alt={fullName || "User"}
                      />
                      <AvatarFallback className="bg-[#002855] text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={8} className="w-64 p-3 rounded-2xl shadow-xl">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                          alt={fullName || "User"}
                        />
                        <AvatarFallback className="bg-[#002855] text-white text-xs font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground truncate">
                          {fullName || "IEEE Member"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00629B]/10 text-[#00629B]">
                          {userRole ? userRole : "Member"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      {(userRole === "interviewer" || userRole === "admin") && (
                        <Link
                          href="/interview"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                        >
                          <UserCheck className="w-4 h-4 text-[#00629B]" />
                          <span>Interview Portal</span>
                        </Link>
                      )}

                      {userRole === "admin" && (
                        <Link
                          href="/interview-admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>Interview Admin</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

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

                <div className="pt-6 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                  {user ? (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground px-1 truncate">
                        Signed in as <span className="font-semibold text-foreground">{user.email}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full text-xs text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full text-xs rounded-xl border-border"
                    >
                      <Link href="/interview-login" onClick={() => setMobileMenuOpen(false)}>
                        Member Login
                      </Link>
                    </Button>
                  )}

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
