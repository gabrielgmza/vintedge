'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Award, Globe, Heart, Leaf, Users, Wine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutPageProps {
  params: { locale: string };
}

// ============================================================================
// HERO SECTION
// ============================================================================
function AboutHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[500px] overflow-hidden bg-[#0A0A0A]">
      {/* Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#0A0A0A] z-10" />
        <Image
          src="/images/about-hero.jpg"
          alt="Viñedo al atardecer"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 font-cormorant text-sm tracking-[0.3em] text-[#D4AF37]"
        >
          NUESTRA HISTORIA
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-playfair text-4xl font-light text-white md:text-6xl lg:text-7xl"
        >
          Pasión por el
          <br />
          <span className="italic text-[#D4AF37]">Arte del Vino</span>
        </motion.h1>
      </motion.div>
    </section>
  );
}

// ============================================================================
// STORY SECTION
// ============================================================================
function StorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#FAF7F2] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/images/about-founder.jpg"
                alt="Fundador de Vintedge"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 rounded-xl bg-[#722F37] p-6 text-white shadow-luxury">
              <span className="block font-playfair text-4xl font-light">2020</span>
              <span className="font-cormorant text-sm tracking-wider text-white/80">Fundación</span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <span className="mb-4 font-cormorant text-sm tracking-[0.2em] text-[#722F37]">
              DESDE MENDOZA AL MUNDO
            </span>
            
            <h2 className="mb-8 font-playfair text-3xl font-light text-[#1A1A1A] md:text-4xl">
              Una Visión que Nació
              <br />
              <span className="italic text-[#722F37]">entre Viñedos</span>
            </h2>

            <div className="space-y-6 font-cormorant text-lg leading-relaxed text-[#444]">
              <p>
                Vintedge nació de una simple pero poderosa idea: que cada botella de vino 
                debería contar una historia única. Fundada en el corazón de Mendoza, Argentina, 
                nuestra misión es democratizar el acceso a vinos personalizados de alta calidad.
              </p>
              <p>
                Lo que comenzó como un proyecto familiar se ha convertido en una plataforma 
                global que conecta a amantes del vino de todo el mundo con los mejores 
                productores y enólogos de las regiones más prestigiosas.
              </p>
              <p>
                Hoy, cada botella que sale de nuestras bodegas lleva consigo no solo un 
                vino excepcional, sino una historia personal, un momento celebrado, 
                un recuerdo para toda la vida.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="h-px flex-1 bg-[#D4AF37]/30" />
              <Wine className="h-6 w-6 text-[#D4AF37]" />
              <div className="h-px flex-1 bg-[#D4AF37]/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VALUES SECTION
// ============================================================================
function ValuesSection() {
  const values = [
    {
      icon: Heart,
      title: 'Pasión',
      description: 'Cada botella refleja nuestro amor por el vino y el compromiso con la excelencia.',
    },
    {
      icon: Award,
      title: 'Calidad',
      description: 'Trabajamos solo con los mejores viñedos y enólogos de cada región.',
    },
    {
      icon: Users,
      title: 'Personalización',
      description: 'Tu historia es única, y tu vino también debería serlo.',
    },
    {
      icon: Leaf,
      title: 'Sostenibilidad',
      description: 'Prácticas responsables que respetan la tierra y las futuras generaciones.',
    },
    {
      icon: Globe,
      title: 'Alcance Global',
      description: 'Llevamos experiencias únicas a clientes en más de 50 países.',
    },
    {
      icon: Wine,
      title: 'Tradición',
      description: 'Honramos las técnicas ancestrales mientras innovamos para el futuro.',
    },
  ];

  return (
    <section className="bg-[#0A0A0A] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-block font-cormorant text-sm tracking-[0.3em] text-[#D4AF37]"
          >
            NUESTROS VALORES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-3xl font-light text-white md:text-4xl lg:text-5xl"
          >
            Lo que Nos <span className="italic text-[#D4AF37]">Define</span>
          </motion.h2>
        </div>

        {/* Values Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:border-[#D4AF37]/30 hover:bg-white/10"
            >
              <div className="mb-6 inline-flex rounded-xl bg-[#D4AF37]/10 p-4">
                <value.icon className="h-7 w-7 text-[#D4AF37]" />
              </div>
              <h3 className="mb-3 font-playfair text-xl text-white">{value.title}</h3>
              <p className="font-cormorant text-lg leading-relaxed text-white/60">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS SECTION
// ============================================================================
function StatsSection() {
  const stats = [
    { value: '50+', label: 'Países Alcanzados' },
    { value: '15K+', label: 'Clientes Satisfechos' },
    { value: '100+', label: 'Variedades de Vino' },
    { value: '50+', label: 'Bodegas Asociadas' },
  ];

  return (
    <section className="bg-[#722F37] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <span className="block font-playfair text-4xl font-light text-white md:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 block font-cormorant text-base text-white/70">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM SECTION
// ============================================================================
function TeamSection() {
  const team = [
    {
      name: 'Gabriel Cabra',
      role: 'Fundador & CEO',
      image: '/images/team/gabriel.jpg',
    },
    {
      name: 'María Fernández',
      role: 'Directora Enológica',
      image: '/images/team/maria.jpg',
    },
    {
      name: 'Carlos Mendoza',
      role: 'Director de Operaciones',
      image: '/images/team/carlos.jpg',
    },
  ];

  return (
    <section className="bg-[#FAF7F2] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-block font-cormorant text-sm tracking-[0.3em] text-[#722F37]"
          >
            NUESTRO EQUIPO
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-3xl font-light text-[#1A1A1A] md:text-4xl lg:text-5xl"
          >
            Las Personas Detrás de <span className="italic text-[#722F37]">Vintedge</span>
          </motion.h2>
        </div>

        {/* Team Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group text-center"
            >
              <div className="relative mx-auto mb-6 aspect-square w-64 overflow-hidden rounded-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-playfair text-xl text-[#1A1A1A]">{member.name}</h3>
              <p className="mt-1 font-cormorant text-base text-[#666]">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================
function CTASection({ locale }: { locale: string }) {
  return (
    <section className="bg-[#0A0A0A] py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl font-light text-white md:text-4xl lg:text-5xl">
            ¿Listo para Crear
            <br />
            <span className="italic text-[#D4AF37]">Tu Propio Vino?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-cormorant text-xl text-white/60">
            Únete a miles de clientes que han descubierto el placer de tener 
            un vino verdaderamente único.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={`/${locale}/wines`}>
              <Button
                size="lg"
                className="group bg-[#D4AF37] px-8 py-6 text-base text-[#0A0A0A] hover:bg-[#E5C349]"
              >
                Explorar Colección
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 px-8 py-6 text-base text-white hover:bg-white/5"
              >
                Contactarnos
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = params;

  return (
    <main>
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <StatsSection />
      <TeamSection />
      <CTASection locale={locale} />
    </main>
  );
}
