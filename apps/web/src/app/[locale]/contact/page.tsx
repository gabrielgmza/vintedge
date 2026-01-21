'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Send, MessageSquare, Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContactPageProps {
  params: { locale: string };
}

// ============================================================================
// CONTACT FORM
// ============================================================================
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const subjects = [
    { value: 'general', label: 'Consulta General' },
    { value: 'corporate', label: 'Pedidos Corporativos' },
    { value: 'wedding', label: 'Bodas y Eventos' },
    { value: 'support', label: 'Soporte al Cliente' },
    { value: 'partnership', label: 'Alianzas Comerciales' },
  ];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Send className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mb-3 font-playfair text-2xl text-[#1A1A1A]">¡Mensaje Enviado!</h3>
        <p className="max-w-md font-cormorant text-lg text-[#666]">
          Gracias por contactarnos. Nuestro equipo te responderá en las próximas 24-48 horas.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          className="mt-8 bg-[#722F37] hover:bg-[#5a252c]"
        >
          Enviar otro mensaje
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Email */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-cormorant text-sm font-medium text-[#1A1A1A]">
            Nombre Completo *
          </label>
          <Input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tu nombre"
            className="border-[#ddd] bg-white focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
          />
        </div>
        <div>
          <label className="mb-2 block font-cormorant text-sm font-medium text-[#1A1A1A]">
            Correo Electrónico *
          </label>
          <Input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="tu@email.com"
            className="border-[#ddd] bg-white focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
          />
        </div>
      </div>

      {/* Phone & Subject */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-cormorant text-sm font-medium text-[#1A1A1A]">
            Teléfono (opcional)
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (234) 567-8900"
            className="border-[#ddd] bg-white focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
          />
        </div>
        <div>
          <label className="mb-2 block font-cormorant text-sm font-medium text-[#1A1A1A]">
            Asunto *
          </label>
          <select
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full rounded-md border border-[#ddd] bg-white px-4 py-2.5 font-cormorant text-base text-[#1A1A1A] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
          >
            {subjects.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 block font-cormorant text-sm font-medium text-[#1A1A1A]">
          Mensaje *
        </label>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Cuéntanos cómo podemos ayudarte..."
          className="w-full rounded-md border border-[#ddd] bg-white px-4 py-3 font-cormorant text-base text-[#1A1A1A] placeholder:text-[#999] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#722F37] py-6 text-base hover:bg-[#5a252c] disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </>
        ) : (
          <>
            Enviar Mensaje
            <Send className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}

// ============================================================================
// CONTACT INFO CARDS
// ============================================================================
function ContactInfo() {
  const info = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@vintedge.vip',
      link: 'mailto:hello@vintedge.vip',
    },
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+1 (234) 567-890',
      link: 'tel:+1234567890',
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      content: 'Mendoza, Argentina',
      link: null,
    },
    {
      icon: Clock,
      title: 'Horario',
      content: 'Lun - Vie: 9am - 6pm',
      link: null,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {info.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-[#e5e5e5] bg-white p-6"
        >
          <div className="mb-4 inline-flex rounded-lg bg-[#722F37]/10 p-3">
            <item.icon className="h-5 w-5 text-[#722F37]" />
          </div>
          <h3 className="mb-1 font-cormorant text-sm font-medium uppercase tracking-wider text-[#999]">
            {item.title}
          </h3>
          {item.link ? (
            <a
              href={item.link}
              className="font-cormorant text-lg text-[#1A1A1A] transition-colors hover:text-[#722F37]"
            >
              {item.content}
            </a>
          ) : (
            <p className="font-cormorant text-lg text-[#1A1A1A]">{item.content}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// INQUIRY TYPES
// ============================================================================
function InquiryTypes() {
  const types = [
    {
      icon: MessageSquare,
      title: 'Consultas Generales',
      description: 'Preguntas sobre productos, servicios o cómo funciona Vintedge.',
    },
    {
      icon: Building,
      title: 'Pedidos Corporativos',
      description: 'Vinos personalizados para empresas, eventos corporativos o regalos.',
    },
    {
      icon: Users,
      title: 'Bodas y Eventos',
      description: 'Diseños especiales para bodas, aniversarios y celebraciones.',
    },
  ];

  return (
    <div className="mt-12 border-t border-[#e5e5e5] pt-12">
      <h3 className="mb-6 font-playfair text-xl text-[#1A1A1A]">¿Cómo podemos ayudarte?</h3>
      <div className="grid gap-4">
        {types.map((type, index) => (
          <motion.div
            key={type.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-start gap-4 rounded-lg bg-[#FAF7F2] p-4"
          >
            <div className="shrink-0 rounded-lg bg-[#D4AF37]/10 p-2">
              <type.icon className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-cormorant text-base font-semibold text-[#1A1A1A]">
                {type.title}
              </h4>
              <p className="mt-1 font-cormorant text-sm text-[#666]">{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ContactPage({ params }: ContactPageProps) {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <section className="bg-[#0A0A0A] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block font-cormorant text-sm tracking-[0.3em] text-[#D4AF37]"
          >
            CONTACTO
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-4xl font-light text-white md:text-5xl lg:text-6xl"
          >
            Hablemos de
            <br />
            <span className="italic text-[#D4AF37]">Tu Proyecto</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl font-cormorant text-xl text-white/60"
          >
            Estamos aquí para ayudarte a crear la experiencia de vino perfecta. 
            Contáctanos y responderemos en menos de 24 horas.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left - Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white p-8 shadow-soft md:p-10"
            >
              <h2 className="mb-2 font-playfair text-2xl text-[#1A1A1A]">Envíanos un Mensaje</h2>
              <p className="mb-8 font-cormorant text-base text-[#666]">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible.
              </p>
              <ContactForm />
            </motion.div>

            {/* Right - Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="mb-6 font-playfair text-2xl text-[#1A1A1A]">Información de Contacto</h2>
              <ContactInfo />
              <InquiryTypes />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-[#e5e5e5]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214920.06361660778!2d-69.04227583203126!3d-32.88945770000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091ed2dd83f7%3A0xf41c7ab7e3522557!2sMendoza%2C%20Argentina!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de Vintedge"
        />
      </section>
    </main>
  );
}
