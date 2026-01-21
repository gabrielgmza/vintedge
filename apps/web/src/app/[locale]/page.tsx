'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Wine, Palette, Package, Truck, Star, ChevronDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  params: { locale: string };
}

// ============================================================================
// HERO SECTION - Full screen cinematic
// ============================================================================
function HeroSection({ locale }: { locale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]"
    >
      {/* Background Video/Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0A0A] z-10" />
        <Image
          src="/images/hero-vineyard.jpg"
          alt="Vineyard at sunset"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Floating wine bottle */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-[10%] top-1/2 -translate-y-1/2 z-20 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/images/bottle-hero.png"
            alt="Premium wine bottle"
            width={280}
            height={700}
            className="drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm tracking-[0.2em] text-[#D4AF37]">
            <Wine className="h-4 w-4" />
            PERSONALIZACIÓN PREMIUM
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-playfair text-5xl font-light leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          Tu Vino,
          <br />
          <span className="italic text-[#D4AF37]">Tu Historia</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 max-w-xl font-cormorant text-xl leading-relaxed text-white/70 md:text-2xl"
        >
          Crea vinos únicos con etiquetas personalizadas. Desde la cepa hasta tu mesa, 
          una experiencia exclusiva diseñada por ti.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <Link href={`/${locale}/wines`}>
            <Button
              size="lg"
              className="group bg-[#D4AF37] px-8 py-6 text-base font-medium tracking-wide text-[#0A0A0A] transition-all hover:bg-[#E5C349] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]"
            >
              Comenzar a Crear
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="group border-white/20 bg-transparent px-8 py-6 text-base font-medium tracking-wide text-white hover:border-white/40 hover:bg-white/5"
          >
            <Play className="mr-2 h-5 w-5" />
            Ver Proceso
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs tracking-[0.3em]">DESCUBRE</span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF7F2] to-transparent z-30" />
    </section>
  );
}

// ============================================================================
// INTRO STATEMENT - Editorial quote style
// ============================================================================
function IntroStatement() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#FAF7F2] py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative Line */}
          <div className="mx-auto mb-8 h-px w-24 bg-[#D4AF37]" />
          
          <blockquote className="font-playfair text-3xl font-light leading-relaxed text-[#1A1A1A] md:text-4xl lg:text-5xl">
            "Cada botella cuenta una historia.
            <br />
            <span className="italic text-[#722F37]">La tuya merece ser extraordinaria.</span>"
          </blockquote>
          
          <div className="mx-auto mt-8 h-px w-24 bg-[#D4AF37]" />
          
          <p className="mt-12 font-cormorant text-lg text-[#666] md:text-xl">
            En Vintedge, transformamos momentos en memorias. Cada vino que creamos
            es una obra de arte única, elaborada con pasión y personalizada con propósito.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// PROCESS SECTION - Horizontal scroll cards
// ============================================================================
function ProcessSection({ locale }: { locale: string }) {
  const steps = [
    {
      number: '01',
      title: 'Selecciona',
      description: 'Elige entre nuestra colección de vinos premium de las mejores regiones del mundo.',
      icon: Wine,
      image: '/images/process-select.jpg',
    },
    {
      number: '02',
      title: 'Personaliza',
      description: 'Diseña tu etiqueta única con nuestro editor intuitivo. Sube tu logo, elige tipografías y colores.',
      icon: Palette,
      image: '/images/process-customize.jpg',
    },
    {
      number: '03',
      title: 'Empaque Premium',
      description: 'Selecciona el empaque perfecto: cajas de madera, estuches de lujo o presentaciones corporativas.',
      icon: Package,
      image: '/images/process-package.jpg',
    },
    {
      number: '04',
      title: 'Envío Global',
      description: 'Recibe tu creación en cualquier parte del mundo con nuestro servicio de envío premium.',
      icon: Truck,
      image: '/images/process-delivery.jpg',
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section ref={containerRef} className="bg-[#0A0A0A] py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-block font-cormorant text-sm tracking-[0.3em] text-[#D4AF37]"
          >
            EL PROCESO
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-4xl font-light text-white md:text-5xl lg:text-6xl"
          >
            Cuatro Pasos Hacia
            <br />
            <span className="italic text-[#D4AF37]">la Perfección</span>
          </motion.h2>
        </div>

        {/* Process Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] p-8 transition-all duration-500 hover:bg-[#222]">
                {/* Step Number */}
                <span className="absolute -right-4 -top-4 font-playfair text-[120px] font-bold leading-none text-white/5">
                  {step.number}
                </span>
                
                {/* Icon */}
                <div className="relative mb-6 inline-flex rounded-xl bg-[#D4AF37]/10 p-4">
                  <step.icon className="h-8 w-8 text-[#D4AF37]" />
                </div>
                
                {/* Content */}
                <h3 className="mb-3 font-playfair text-2xl text-white">
                  {step.title}
                </h3>
                <p className="font-cormorant text-lg leading-relaxed text-white/60">
                  {step.description}
                </p>

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href={`/${locale}/wines`}>
            <Button
              size="lg"
              className="group bg-transparent border-2 border-[#D4AF37] px-10 py-6 text-base font-medium tracking-wide text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#0A0A0A]"
            >
              Explorar Colección
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURED WINES - Editorial grid
// ============================================================================
function FeaturedWines({ locale }: { locale: string }) {
  const wines = [
    {
      id: 1,
      name: 'Reserva Privada',
      type: 'Tinto',
      region: 'Rioja, España',
      price: 89,
      image: '/images/wines/reserva-privada.jpg',
    },
    {
      id: 2,
      name: 'Blanc de Blancs',
      type: 'Blanco',
      region: 'Napa Valley, USA',
      price: 72,
      image: '/images/wines/blanc-blancs.jpg',
    },
    {
      id: 3,
      name: 'Gran Selección',
      type: 'Tinto',
      region: 'Mendoza, Argentina',
      price: 125,
      image: '/images/wines/gran-seleccion.jpg',
    },
  ];

  return (
    <section className="bg-[#FAF7F2] py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-4 inline-block font-cormorant text-sm tracking-[0.3em] text-[#722F37]"
            >
              COLECCIÓN DESTACADA
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-playfair text-4xl font-light text-[#1A1A1A] md:text-5xl"
            >
              Vinos de <span className="italic text-[#722F37]">Excepción</span>
            </motion.h2>
          </div>
          <Link href={`/${locale}/wines`}>
            <Button
              variant="outline"
              className="group border-[#722F37] text-[#722F37] hover:bg-[#722F37] hover:text-white"
            >
              Ver Todos
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Wine Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {wines.map((wine, index) => (
            <motion.div
              key={wine.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link href={`/${locale}/wines/${wine.id}`}>
                <div className="group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-2xl bg-[#1A1A1A]">
                    <Image
                      src={wine.image}
                      alt={wine.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    {/* Quick Action */}
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <Button className="w-full bg-white/90 text-[#1A1A1A] backdrop-blur-sm hover:bg-white">
                        Personalizar
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="mb-1 block font-cormorant text-sm uppercase tracking-wider text-[#722F37]">
                        {wine.type}
                      </span>
                      <h3 className="font-playfair text-xl text-[#1A1A1A] transition-colors group-hover:text-[#722F37]">
                        {wine.name}
                      </h3>
                      <p className="mt-1 font-cormorant text-sm text-[#666]">
                        {wine.region}
                      </p>
                    </div>
                    <span className="font-playfair text-xl text-[#1A1A1A]">
                      ${wine.price}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS - Elegant carousel
// ============================================================================
function Testimonials() {
  const testimonials = [
    {
      quote: 'El vino personalizado fue el regalo perfecto para nuestra boda. Cada invitado se llevó una botella única.',
      author: 'María García',
      role: 'Boda en Barcelona',
      rating: 5,
    },
    {
      quote: 'Usamos Vintedge para nuestros regalos corporativos. La calidad del vino y la presentación son impecables.',
      author: 'Carlos Mendoza',
      role: 'Director de Marketing, TechCorp',
      rating: 5,
    },
    {
      quote: 'Sorprendí a mi padre en su 60 cumpleaños con un Reserva personalizado. Fue un momento inolvidable.',
      author: 'Ana Martínez',
      role: 'Cliente desde 2023',
      rating: 5,
    },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#722F37] py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Stars */}
        <div className="mb-8 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
          ))}
        </div>

        {/* Quote */}
        <motion.blockquote
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="font-playfair text-2xl font-light leading-relaxed text-white md:text-3xl lg:text-4xl"
        >
          "{testimonials[active].quote}"
        </motion.blockquote>

        {/* Author */}
        <motion.div
          key={`author-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <p className="font-cormorant text-lg text-white/90">
            {testimonials[active].author}
          </p>
          <p className="font-cormorant text-sm text-white/60">
            {testimonials[active].role}
          </p>
        </motion.div>

        {/* Dots */}
        <div className="mt-12 flex justify-center gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION - Final conversion
// ============================================================================
function CTASection({ locale }: { locale: string }) {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-6 inline-block font-cormorant text-sm tracking-[0.3em] text-[#D4AF37]">
            COMIENZA TU EXPERIENCIA
          </span>
          
          <h2 className="font-playfair text-4xl font-light text-white md:text-5xl lg:text-6xl">
            ¿Listo para Crear
            <br />
            <span className="italic text-[#D4AF37]">Algo Extraordinario?</span>
          </h2>
          
          <p className="mx-auto mt-8 max-w-2xl font-cormorant text-xl leading-relaxed text-white/60">
            Únete a miles de clientes que han transformado momentos ordinarios 
            en memorias extraordinarias con vinos personalizados de Vintedge.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={`/${locale}/wines`}>
              <Button
                size="lg"
                className="group bg-[#D4AF37] px-10 py-6 text-base font-medium tracking-wide text-[#0A0A0A] transition-all hover:bg-[#E5C349] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]"
              >
                Explorar Vinos
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-transparent px-10 py-6 text-base font-medium tracking-wide text-white hover:border-white/40 hover:bg-white/5"
              >
                Contactar
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/40">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-cormorant text-sm">Pago Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span className="font-cormorant text-sm">Envío Global</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span className="font-cormorant text-sm">+5,000 Clientes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function LandingPage({ params }: LandingPageProps) {
  const { locale } = params;

  return (
    <main className="overflow-hidden">
      <HeroSection locale={locale} />
      <IntroStatement />
      <ProcessSection locale={locale} />
      <FeaturedWines locale={locale} />
      <Testimonials />
      <CTASection locale={locale} />
    </main>
  );
}
