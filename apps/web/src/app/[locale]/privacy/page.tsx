'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Eye, Lock, Database, Globe, Mail } from 'lucide-react';

interface PrivacyPageProps {
  params: { locale: string };
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = params;
  const lastUpdated = '15 de enero de 2026';

  const highlights = [
    {
      icon: Shield,
      title: 'Protección de Datos',
      description: 'Sus datos están protegidos con encriptación de nivel bancario.',
    },
    {
      icon: Eye,
      title: 'Transparencia',
      description: 'Explicamos claramente cómo usamos su información.',
    },
    {
      icon: Lock,
      title: 'Su Control',
      description: 'Puede acceder, modificar o eliminar sus datos en cualquier momento.',
    },
  ];

  const sections = [
    {
      title: '1. Información que Recopilamos',
      content: `Recopilamos diferentes tipos de información para proporcionarle nuestros servicios:

**Información que usted nos proporciona:**
• Datos de cuenta: nombre, dirección de correo electrónico, número de teléfono
• Datos de envío: dirección postal completa
• Datos de pago: procesados de forma segura por Stripe (no almacenamos datos de tarjetas)
• Contenido de personalización: imágenes, textos y diseños que sube para sus etiquetas
• Comunicaciones: mensajes que nos envía por email o formularios de contacto

**Información recopilada automáticamente:**
• Datos técnicos: dirección IP, tipo de navegador, sistema operativo
• Datos de uso: páginas visitadas, tiempo en el sitio, enlaces clicados
• Cookies y tecnologías similares (ver nuestra Política de Cookies)`,
    },
    {
      title: '2. Cómo Utilizamos su Información',
      content: `Utilizamos su información personal para los siguientes propósitos:

**Provisión de servicios:**
• Procesar y enviar sus pedidos
• Personalizar productos según sus especificaciones
• Gestionar su cuenta de usuario
• Proporcionar soporte al cliente

**Mejora de la experiencia:**
• Personalizar contenido y recomendaciones
• Analizar el uso del sitio para mejorarlo
• Desarrollar nuevos productos y características

**Comunicaciones:**
• Enviar confirmaciones de pedidos y actualizaciones de envío
• Notificar cambios en nuestros servicios o políticas
• Enviar ofertas y promociones (solo si ha dado su consentimiento)

**Cumplimiento legal:**
• Cumplir con obligaciones legales y fiscales
• Prevenir fraude y actividades ilegales
• Verificar edad para la venta de alcohol`,
    },
    {
      title: '3. Base Legal para el Procesamiento',
      content: `Procesamos sus datos personales basándonos en las siguientes bases legales:

• **Ejecución de contrato:** Cuando el procesamiento es necesario para cumplir con nuestro contrato con usted (procesar pedidos, envíos, etc.)

• **Consentimiento:** Para envío de comunicaciones de marketing y uso de ciertas cookies

• **Interés legítimo:** Para mejorar nuestros servicios, prevenir fraude y mantener la seguridad

• **Obligación legal:** Para cumplir con requisitos legales como verificación de edad y obligaciones fiscales`,
    },
    {
      title: '4. Compartición de Datos',
      content: `Compartimos su información solo cuando es necesario:

**Proveedores de servicios:**
• Stripe: procesamiento de pagos
• Servicios de envío: empresas de logística y courier
• Firebase/Google Cloud: alojamiento y autenticación
• Proveedores de email: envío de comunicaciones transaccionales

**Socios comerciales:**
• Bodegas asociadas: solo información necesaria para producir su pedido personalizado

**Requerimientos legales:**
• Autoridades gubernamentales cuando la ley lo requiera
• Para proteger nuestros derechos legales

**No vendemos sus datos personales a terceros para fines de marketing.**`,
    },
    {
      title: '5. Transferencias Internacionales',
      content: `Como empresa global, sus datos pueden ser procesados en diferentes países:

• Nuestros servidores principales están ubicados en Estados Unidos (Google Cloud)
• Algunos proveedores de servicios pueden operar en otras jurisdicciones

Para proteger sus datos durante transferencias internacionales, utilizamos:
• Cláusulas contractuales estándar aprobadas por la Comisión Europea
• Certificaciones de Privacy Shield donde aplique
• Otras salvaguardas apropiadas según la legislación aplicable`,
    },
    {
      title: '6. Retención de Datos',
      content: `Conservamos sus datos durante el tiempo necesario para cumplir con los propósitos descritos:

• **Datos de cuenta:** Mientras mantenga una cuenta activa con nosotros
• **Datos de pedidos:** 7 años para cumplir con obligaciones fiscales y legales
• **Comunicaciones de soporte:** 3 años desde la última interacción
• **Datos de marketing:** Hasta que retire su consentimiento
• **Logs técnicos:** 1 año

Una vez cumplido el período de retención, sus datos serán eliminados o anonimizados de forma segura.`,
    },
    {
      title: '7. Sus Derechos',
      content: `Usted tiene los siguientes derechos sobre sus datos personales:

• **Acceso:** Solicitar una copia de los datos que tenemos sobre usted
• **Rectificación:** Corregir datos inexactos o incompletos
• **Eliminación:** Solicitar la eliminación de sus datos ("derecho al olvido")
• **Portabilidad:** Recibir sus datos en un formato estructurado y transferible
• **Oposición:** Oponerse al procesamiento de sus datos para ciertos fines
• **Limitación:** Solicitar la restricción del procesamiento de sus datos
• **Retirar consentimiento:** Retirar su consentimiento en cualquier momento

Para ejercer cualquiera de estos derechos, contáctenos en privacy@vintedge.vip

Responderemos a su solicitud dentro de los 30 días siguientes. En casos complejos, podemos extender este plazo otros 60 días, notificándole debidamente.`,
    },
    {
      title: '8. Seguridad de Datos',
      content: `Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos:

**Medidas técnicas:**
• Encriptación SSL/TLS para todas las comunicaciones
• Encriptación AES-256 para datos sensibles almacenados
• Firewalls y sistemas de detección de intrusiones
• Copias de seguridad regulares con encriptación

**Medidas organizativas:**
• Acceso restringido a datos personales (principio de necesidad de conocer)
• Capacitación regular en seguridad para nuestro personal
• Políticas de contraseñas seguras
• Auditorías de seguridad periódicas

A pesar de estas medidas, ningún sistema es 100% seguro. Si sospecha de cualquier acceso no autorizado, contáctenos inmediatamente.`,
    },
    {
      title: '9. Menores de Edad',
      content: `Nuestros servicios están dirigidos exclusivamente a mayores de 18 años (o la edad legal para consumir alcohol en su jurisdicción).

No recopilamos intencionalmente información de menores de edad. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos inmediatamente.

Si usted es padre o tutor y cree que su hijo nos ha proporcionado información, contáctenos para que podamos tomar las medidas necesarias.`,
    },
    {
      title: '10. Cambios a esta Política',
      content: `Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas o por razones legales.

• Publicaremos cualquier cambio en esta página
• Actualizaremos la fecha de "última actualización"
• Para cambios significativos, le notificaremos por email o mediante un aviso destacado en el sitio

Le recomendamos revisar esta política regularmente para estar informado sobre cómo protegemos su información.`,
    },
    {
      title: '11. Contacto',
      content: `Si tiene preguntas o inquietudes sobre esta Política de Privacidad o el tratamiento de sus datos, puede contactarnos:

**Responsable de Privacidad**
Email: privacy@vintedge.vip
Dirección: Mendoza, Argentina

**Para ejercer sus derechos:**
Email: privacy@vintedge.vip
Asunto: "Solicitud de Derechos de Privacidad"

**Para quejas:**
Si no está satisfecho con nuestra respuesta, tiene derecho a presentar una queja ante la autoridad de protección de datos de su país.`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <section className="bg-[#0A0A0A] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-3xl font-light text-white md:text-4xl lg:text-5xl"
          >
            Política de <span className="italic text-[#D4AF37]">Privacidad</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 font-cormorant text-lg text-white/60"
          >
            Última actualización: {lastUpdated}
          </motion.p>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-b border-[#e5e5e5] bg-white py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#722F37]/10">
                  <item.icon className="h-7 w-7 text-[#722F37]" />
                </div>
                <h3 className="mb-2 font-playfair text-lg text-[#1A1A1A]">{item.title}</h3>
                <p className="font-cormorant text-base text-[#666]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 rounded-xl bg-white p-8 shadow-soft"
          >
            <p className="font-cormorant text-lg leading-relaxed text-[#444]">
              En Vintedge, nos tomamos muy en serio la privacidad de nuestros usuarios. 
              Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos 
              y protegemos su información personal cuando utiliza nuestro sitio web y servicios.
            </p>
          </motion.div>

          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12 rounded-xl bg-[#722F37]/5 p-8"
          >
            <h2 className="mb-4 font-playfair text-lg text-[#722F37]">Índice</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {sections.map((section) => (
                <a
                  key={section.title}
                  href={`#section-${section.title.split('.')[0].trim()}`}
                  className="font-cormorant text-base text-[#444] hover:text-[#722F37]"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                id={`section-${section.title.split('.')[0].trim()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="scroll-mt-24 rounded-xl bg-white p-8 shadow-soft"
              >
                <h2 className="mb-4 font-playfair text-xl text-[#722F37]">{section.title}</h2>
                <div className="prose prose-lg max-w-none font-cormorant text-[#444]">
                  <div className="whitespace-pre-line leading-relaxed">{section.content}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="font-cormorant text-base text-[#666]">
              Consulte también nuestros{' '}
              <Link href={`/${locale}/terms`} className="text-[#722F37] underline hover:no-underline">
                Términos y Condiciones
              </Link>{' '}
              y{' '}
              <Link href={`/${locale}/cookies`} className="text-[#722F37] underline hover:no-underline">
                Política de Cookies
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
