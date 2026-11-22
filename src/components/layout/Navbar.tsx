"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  UserRound,
  ChevronDown,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
];

// Profile photo, or the first letter of the name when there is no photo
function UserAvatar({ image, name }: { image?: string | null; name?: string }) {
  return (
    <Avatar className="size-8">
      {image && <AvatarImage src={image} alt={name ?? "Profile"} />}
      <AvatarFallback className="bg-[#f6e9ec] font-medium text-[#8c2338]">
        {name?.charAt(0).toUpperCase() || <UserRound size={16} />}
      </AvatarFallback>
    </Avatar>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const isLoggedIn = Boolean(user);

  const role = user?.role ?? "customer";

  const dashboardLabel =
    role === "admin"
      ? "Admin Panel"
      : role === "vendor"
        ? "Vendor Hub"
        : "My Bookings";

  const navigationLinks = [
    ...links,
    ...(isLoggedIn
      ? [
          {
            label: dashboardLabel,
            href: "/dashboard",
          },
        ]
      : []),
  ];

  // Check active navigation link
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message ?? "Failed to log out.");
        return;
      }

      setMenuOpen(false);

      toast.success("Logged out successfully!");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      toast.error("Something went wrong while logging out.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfda] bg-[#fcfaf9]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
        {/* ======================================
            LOGO
        ====================================== */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8c2338] text-white">
            <Heart size={19} fill="currentColor" />
          </span>

          <span className="flex flex-col">
            <span className="font-serif text-2xl font-bold leading-tight text-[#2b2023]">
              WedPlan
            </span>

            <span className="text-[10px] tracking-[0.12em] text-[#806c71]">
              WEDDING MARKETPLACE
            </span>
          </span>
        </Link>

        {/* ======================================
            DESKTOP NAVIGATION
        ====================================== */}
        <div className="hidden items-center gap-3 md:flex">
          {navigationLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2 text-sm transition-colors hover:bg-[#f6e9ec] hover:text-[#8c2338] ${
                  active
                    ? "bg-[#f6e9ec] font-semibold text-[#8c2338]"
                    : "text-[#756169]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ======================================
            DESKTOP AUTH SECTION
        ====================================== */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="flex items-center gap-3">
              <div className="h-9 w-24 animate-pulse rounded-xl bg-[#f0e5e8]" />

              <div className="h-9 w-28 animate-pulse rounded-xl bg-[#f0e5e8]" />
            </div>
          ) : isLoggedIn ? (
            /* Profile Dropdown (ShadCN DropdownMenu) */
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex max-w-56 items-center gap-2 rounded-xl border border-[#eadfda] bg-white py-1.5 pl-1.5 pr-3 text-sm text-[#30252a] outline-none transition-colors hover:bg-[#f6e9ec] focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <UserAvatar image={user?.image} name={user?.name} />

                <span className="truncate font-medium">
                  {user?.name || "My Account"}
                </span>

                <ChevronDown size={15} className="shrink-0 text-[#806c71]" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-60 rounded-xl p-2"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 pb-2 pt-1">
                    <p className="truncate text-sm font-semibold text-[#2b2023]">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs font-normal text-[#806c71]">
                      {user?.email}
                    </p>
                    <p className="mt-1 text-xs font-normal capitalize text-[#8c2338]">
                      {role} Account
                    </p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  render={<Link href="/dashboard" />}
                  className="gap-2 rounded-lg px-3 py-2.5"
                >
                  <LayoutDashboard className="text-[#8c2338]" />
                  Dashboard
                </DropdownMenuItem>

                {role !== "admin" && (
                  <DropdownMenuItem
                    render={<Link href="/dashboard/profile" />}
                    className="gap-2 rounded-lg px-3 py-2.5"
                  >
                    <Settings className="text-[#8c2338]" />
                    Profile Settings
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="gap-2 rounded-lg px-3 py-2.5 font-medium"
                >
                  <LogOut />
                  {loggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "ghost",
                  size: "lg",
                  className: "h-10 rounded-xl px-4 text-[#756169]",
                })}
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "h-10 rounded-xl px-5",
                })}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* ======================================
            MOBILE MENU BUTTON
        ====================================== */}
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-[#8c2338] md:hidden"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </nav>

      {/* ======================================
          MOBILE NAVIGATION
      ====================================== */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#eadfda] bg-white px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {/* Navigation Links */}
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm transition-colors hover:bg-[#f6e9ec] ${
                  isActive(link.href)
                    ? "bg-[#f6e9ec] font-semibold text-[#8c2338]"
                    : "text-[#756169]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Authentication Loading */}
            {isPending ? (
              <div className="h-12 animate-pulse rounded-lg bg-[#f0e5e8]" />
            ) : isLoggedIn ? (
              <>
                {/* User Information */}
                <div className="mt-2 flex items-center gap-3 rounded-xl bg-[#fcfaf9] px-4 py-3">
                  <UserAvatar image={user?.image} name={user?.name} />

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#2b2023]">
                      {user?.name}
                    </p>
                    <p className="mt-0.5 text-xs capitalize text-[#806c71]">
                      {role} Account
                    </p>
                  </div>
                </div>

                {/* Profile Settings */}
                {role !== "admin" && (
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-[#756169] hover:bg-[#f6e9ec]"
                  >
                    <Settings size={17} />
                    Profile Settings
                  </Link>
                )}

                {/* Logout */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="h-11 justify-start gap-2 rounded-lg px-4 text-[#8c2338] hover:bg-[#f6e9ec]"
                >
                  <LogOut />
                  {loggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm text-[#756169] hover:bg-[#f6e9ec]"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className={buttonVariants({
                    size: "lg",
                    className: "h-11 rounded-lg",
                  })}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
