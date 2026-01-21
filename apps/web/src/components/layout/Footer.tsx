'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wine, Instagram, Facebook, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FooterProps {
  locale: string;
}

const footerLinks = {
  coleccion: [
    { label: 'Vinos Tintos', href: '/wines?type=RED' },
    { label: 'Vinos Blancos', href: '/wines?type=WHITE' },
    { label: 'Rosados', href: '/wines?type=ROSE' },
    { label: 'Espumantes', href: '/wines?type=SPARKLING' },
    { label: 'Ediciones Limitadas', href: '/wines?collection=limited' },
  ],
  empresa: [
    { label: 'Nuestra Historia', href: '/about' },
    { label: 'Proceso de Elaboración', href: '/about#process' },
    { label: 'Regiones Vitivinícolas', href: '/regions' },
    { label: 'Sostenibilidad', href: '/sustainability' },
    { label: 'Trabaja con Nosotros', href: '/careers' },
  ],
  soporte: [
    { label: 'Centro de Ayuda', href: '/help' },
    { label: 'Envíos y Entregas', href: '/shipping' },
    { label: 'Devoluciones', href: '/returns' },
    { label: 'Preguntas Frecuentes', href: '/faq' },
    { label: 'Contacto', href: '/contact' },
  ],
  legal: [
    { label: 'Términos y Condiciones', href: '/terms' },
    { label: 'Política de Privacidad', href: '/privacy' },
    { label: 'Política de Cookies', href: '/cookies' },
    { label: 'Aviso Legal', href: '/legal' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/vintedge', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/vintedge', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/vintedge', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/vintedge', label: 'LinkedIn' },
];

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-[#0A0A0A]">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="text-center lg:text-left">
              <h3 className="font-playfair text-2xl text-white md:text-3xl">
                Únete a Nuestra <span className="italic text-[#D4AF37]">Comunidad</span>
              </h3>
              <p className="mt-2 font-cormorant text-lg text-white/60">
                Recibe ofertas exclusivas, novedades y consejos de maridaje.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-[#D4AF37]"
              />
              <Button className="shrink-0 bg-[#D4AF37] px-6 text-[#0A0A0A] hover:bg-[#E5C349]">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href={`/${locale}`} className="inline-flex items-center gap-3">
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
              <span className="font-playfair text-2xl font-light tracking-wide text-white">
                Vintedge
              </span>
            </Link>

            <p className="mt-6 max-w-xs font-cormorant text-lg leading-relaxed text-white/60">
              Transformamos momentos en memorias a través de vinos únicos, 
              personalizados con pasión y entregados en todo el mundo.
            </p>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <a
                href="mailto:hello@vintedge.vip"
                className="flex items-center gap-3 font-cormorant text-white/60 transition-colors hover:text-[#D4AF37]"
              >
                <Mail className="h-4 w-4" />
                hello@vintedge.vip
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 font-cormorant text-white/60 transition-colors hover:text-[#D4AF37]"
              >
                <Phone className="h-4 w-4" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-3 font-cormorant text-white/60">
                <MapPin className="h-4 w-4 shrink-0" />
                Mendoza, Argentina
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="mb-6 font-cormorant text-sm font-medium uppercase tracking-wider text-[#D4AF37]">
              Colección
            </h4>
            <ul className="space-y-3">
              {footerLinks.coleccion.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="font-cormorant text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-cormorant text-sm font-medium uppercase tracking-wider text-[#D4AF37]">
              Empresa
            </h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="font-cormorant text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-cormorant text-sm font-medium uppercase tracking-wider text-[#D4AF37]">
              Soporte
            </h4>
            <ul className="space-y-3">
              {footerLinks.soporte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="font-cormorant text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-cormorant text-sm font-medium uppercase tracking-wider text-[#D4AF37]">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="font-cormorant text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <p className="font-cormorant text-sm text-white/40">
            © {new Date().getFullYear()} Vintedge. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6">
            {/* Payment Methods */}
            <div className="flex items-center gap-3 text-white/40">
              <svg className="h-8 w-auto" viewBox="0 0 38 24" fill="currentColor">
                <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z" opacity=".07"/>
                <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff"/>
                <path d="M15 19c3.9 0 7-3.1 7-7s-3.1-7-7-7-7 3.1-7 7 3.1 7 7 7Z" fill="#EB001B"/>
                <path d="M23 19c3.9 0 7-3.1 7-7s-3.1-7-7-7-7 3.1-7 7 3.1 7 7 7Z" fill="#F79E1B"/>
                <path d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7Z" fill="#FF5F00"/>
              </svg>
              <svg className="h-8 w-auto" viewBox="0 0 38 24" fill="currentColor">
                <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z"/>
                <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
                <path fill="#006FCF" d="M8.971 10.268l.774 1.876H8.203l.768-1.876Zm16.075.078h-2.977v.827h2.929v1.239h-2.923v.922h2.977v.739l2.077-2.245-2.077-2.34-.006.858Zm-14.063-2.34h3.995l.887 1.935L16.687 8h4.015v6.009l-2.538-3.022-2.467 3.022H8.456l-.468-1.119H5.871l-.468 1.119H2.691L5.684 8h2.928l.334.768v5.241h1.938l2.449-3.018 2.449 3.018h3.903v-4.995h2.725l2.201 2.526V8h2.796v6.009l2.158-2.464L30.053 8h2.788v6.009h-1.998v-3.725l-2.531 3.019h-.024l-2.531-3.019v3.725h-4.022l-.468-1.119h-2.146l-.468 1.119H16.1v-.725L13.9 14.009h-.022L11.68 13.284v.725H8.984Z"/>
              </svg>
              <svg className="h-8 w-auto" viewBox="0 0 38 24" fill="currentColor">
                <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z"/>
                <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
                <path fill="#142688" d="M13.3 8H9.7l-2.4 5.2L4.7 8H1.1l4 8h2.8l4-8h1.4Zm2.3 8h2.8V8h-2.8v8Zm8.8-5.1c-.9-.3-1.4-.6-1.4-1 0-.4.4-.7 1.1-.7.6 0 1.4.2 2 .6l.9-2.2c-.8-.4-1.7-.6-2.8-.6-2.3 0-3.9 1.2-3.9 3 0 1.5 1.1 2.3 2.7 2.9 1.1.4 1.4.7 1.4 1.1 0 .5-.4.8-1.3.8-.8 0-1.8-.3-2.6-.8l-.9 2.2c.9.6 2.2.9 3.4.9 2.5 0 4.1-1.2 4.1-3.1.1-1.6-1-2.4-2.7-3.1Zm8.3 5.1h-3.1l-3.1-8h3l1.7 5 1.7-5h2.9l-3.1 8Z"/>
              </svg>
            </div>

            {/* Age Restriction Badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="text-xs font-medium text-white/60">+18</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
