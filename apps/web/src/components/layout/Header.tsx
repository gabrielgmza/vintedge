'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

const navLinks = [
  { href: '/wines', label: 'Colección' },
  { href: '/customize', label: 'Personalizar' },
  { href: '/about', label: 'Nosotros' },
  { href: '/contact', label: 'Contacto' },
];

const languages = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export function Header({ locale }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
          isScrolled || !isHomePage
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md py-4 shadow-lg'
            : 'bg-transparent py-6'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href={`/${locale}`} className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              {/* Logo Icon */}
              <div className="relative h-10 w-10">
                <svg viewBox="0 0 40 40" className="h-full w-full">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M20 8 L20 32 M14 14 Q20 20 14 26 M26 14 Q20 20 26 26"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* Logo Text */}
              <span className="font-playfair text-2xl font-light tracking-wide text-white">
                Vintedge
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname.includes(link.href);
              return (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="group relative px-5 py-2"
                >
                  <span
                    className={cn(
                      'font-cormorant text-sm tracking-wide transition-colors',
                      isActive ? 'text-[#D4AF37]' : 'text-white/80 group-hover:text-white'
                    )}
                  >
                    {link.label}
                  </span>
                  {/* Hover underline */}
                  <span
                    className={cn(
                      'absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-[#D4AF37] transition-all duration-300 group-hover:w-1/2',
                      isActive && 'w-1/2'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Globe className="h-4 w-4" />
              </Button>
              
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 min-w-[160px] overflow-hidden rounded-xl border border-white/10 bg-[#1A1A1A] p-2 shadow-2xl"
                  >
                    {languages.map((lang) => (
                      <Link
                        key={lang.code}
                        href={pathname.replace(`/${locale}`, `/${lang.code}`)}
                        onClick={() => setIsLangMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                          locale === lang.code
                            ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span className="font-cormorant text-sm">{lang.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-white/80 hover:bg-white/10 hover:text-white md:flex"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Account */}
            <Link href={user ? `/${locale}/account` : `/${locale}/auth/signin`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href={`/${locale}/checkout`}>
              <Button
                variant="ghost"
                size="sm"
                className="relative text-white/80 hover:bg-white/10 hover:text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-medium text-[#0A0A0A]">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-[#0A0A0A] p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute right-6 top-6 text-white/60 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="mb-12">
                <span className="font-playfair text-2xl text-white">Vintedge</span>
              </div>

              {/* Navigation */}
              <nav className="mb-12 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/${locale}${link.href}`}
                      className="block py-3 font-playfair text-2xl text-white/80 transition-colors hover:text-[#D4AF37]"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Languages */}
              <div className="border-t border-white/10 pt-8">
                <p className="mb-4 font-cormorant text-sm uppercase tracking-wider text-white/40">
                  Idioma
                </p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={pathname.replace(`/${locale}`, `/${lang.code}`)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm transition-colors',
                        locale === lang.code
                          ? 'bg-[#D4AF37] text-[#0A0A0A]'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      )}
                    >
                      {lang.flag} {lang.code.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="absolute bottom-8 left-8 right-8">
                <Link href={`/${locale}/wines`}>
                  <Button className="w-full bg-[#D4AF37] py-6 text-[#0A0A0A] hover:bg-[#E5C349]">
                    Explorar Vinos
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
