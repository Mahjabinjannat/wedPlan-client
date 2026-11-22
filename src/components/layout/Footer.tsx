import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Create Account", href: "/sign-up" },
  { label: "Dashboard", href: "/dashboard" },
];

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#eadfda] bg-white">
      <div className="mx-auto max-w-7xl px-5 pt-12 pb-6 md:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand Section */}
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8c2338] text-white">
                <Heart size={19} fill="currentColor" />
              </span>

              <span className="font-serif text-2xl font-bold text-[#2b2023]">
                WedPlan
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-[#806c71]">
              Curating extraordinary wedding venues, photographers, florists,
              caterers, and bridal stylists so couples can plan unforgettable
              celebrations with confidence.
            </p>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-[#2b2023]">
              Navigation
            </h3>

            <ul className="flex flex-col gap-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#806c71] transition-colors hover:text-[#8c2338]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-[#2b2023]">
              Categories
            </h3>

            <ul className="flex flex-col gap-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="text-sm text-[#806c71] transition-colors hover:text-[#8c2338]"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-[#2b2023]">
              Contact & Connect
            </h3>

            <div className="flex flex-col gap-4 text-sm text-[#806c71]">
              {/* Email */}
              <a
                href="mailto:concierge@wedplan.com"
                className="flex items-center gap-3 transition-colors hover:text-[#8c2338]"
              >
                <Mail size={17} className="shrink-0 text-[#8c2338]" />
                <span>concierge@wedplan.com</span>
              </a>

              {/* Phone */}
              <Link
                href="tel:+14158904321"
                className="flex items-center gap-3 transition-colors hover:text-[#8c2338]"
              >
                <Phone size={17} className="shrink-0 text-[#8c2338]" />
                <span>+1 (415) 890-4321</span>
              </Link>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[#8c2338]" />
                <span>540 Union Square, San Francisco, CA</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-[#eadfda] px-3 py-2 text-xs font-medium text-[#806c71] transition-all hover:border-[#8c2338] hover:bg-[#f6e9ec] hover:text-[#8c2338]"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#eadfda] pt-6 text-xs text-[#806c71] md:flex-row md:items-center">
          <p>© 2026 WedPlan Wedding Planning Platform. All rights reserved.</p>

          <p>Crafted for couples & verified wedding artisans worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
