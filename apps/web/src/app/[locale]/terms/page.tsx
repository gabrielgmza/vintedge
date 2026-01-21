'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface TermsPageProps {
  params: { locale: string };
}

export default function TermsPage({ params }: TermsPageProps) {
  const { locale } = params;
  const lastUpdated = '15 de enero de 2026';

  const sections = [
    {
      title: '1. Aceptación de los Términos',
      content: `Al acceder y utilizar el sitio web vintedge.vip ("el Sitio") y los servicios ofrecidos por Vintedge ("nosotros", "nuestro" o "la Empresa"), usted acepta estar legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.

Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el Sitio. Su uso continuado del Sitio después de dichos cambios constituye su aceptación de los nuevos términos.`,
    },
    {
      title: '2. Requisitos de Edad',
      content: `Nuestros productos contienen alcohol. Al utilizar nuestros servicios y realizar compras, usted confirma que:

• Tiene al menos 18 años de edad (o la edad legal para consumir alcohol en su jurisdicción, si es mayor).
• Es legalmente responsable de cumplir con las leyes de su país o región respecto al consumo y compra de alcohol.
• Proporcionará información precisa sobre su edad cuando se le solicite.

Nos reservamos el derecho de solicitar verificación de edad en cualquier momento y de cancelar pedidos si sospechamos que el comprador no cumple con los requisitos de edad.`,
    },
    {
      title: '3. Productos y Personalización',
      content: `Vintedge ofrece vinos personalizados con etiquetas y empaques diseñados por el cliente. Al utilizar nuestro servicio de personalización:

• Usted garantiza que tiene los derechos sobre cualquier imagen, logo o contenido que suba para personalización.
• No está permitido incluir contenido ofensivo, difamatorio, obsceno, ilegal o que infrinja derechos de terceros.
• Nos reservamos el derecho de rechazar diseños que consideremos inapropiados.
• Los colores y acabados finales pueden variar ligeramente de la vista previa digital debido a diferencias en materiales y procesos de impresión.

Los vinos son seleccionados de bodegas asociadas y están sujetos a disponibilidad. En caso de que un vino específico no esté disponible, nos comunicaremos con usted para ofrecer alternativas equivalentes.`,
    },
    {
      title: '4. Precios y Pagos',
      content: `Todos los precios están expresados en dólares estadounidenses (USD) e incluyen impuestos aplicables, excepto donde se indique lo contrario. Los costos de envío se calculan y muestran antes de completar la compra.

Aceptamos las siguientes formas de pago:
• Tarjetas de crédito y débito (Visa, Mastercard, American Express)
• Otros métodos según disponibilidad regional

Los pagos son procesados de forma segura a través de Stripe. No almacenamos información de tarjetas de crédito en nuestros servidores.

Nos reservamos el derecho de modificar precios sin previo aviso. Sin embargo, los precios aplicables a su pedido serán los vigentes en el momento de la confirmación de compra.`,
    },
    {
      title: '5. Envíos y Entregas',
      content: `Realizamos envíos a los países listados en nuestra página de envíos. Los tiempos de entrega son estimados y pueden variar según:

• Su ubicación geográfica
• Disponibilidad del producto
• Procesos aduaneros
• Condiciones climáticas o eventos extraordinarios

Los plazos típicos son:
• Producción y personalización: 5-7 días hábiles
• Envío estándar: 7-14 días hábiles adicionales
• Envío express: 3-5 días hábiles adicionales (donde esté disponible)

El cliente es responsable de proporcionar una dirección de entrega correcta y completa. No nos hacemos responsables por retrasos o pérdidas causadas por información incorrecta.`,
    },
    {
      title: '6. Política de Devoluciones',
      content: `Debido a la naturaleza personalizada de nuestros productos, las devoluciones son limitadas:

Aceptamos devoluciones cuando:
• El producto llegó dañado durante el envío
• El producto tiene defectos de fabricación
• El producto no corresponde a lo ordenado (error nuestro)

No aceptamos devoluciones cuando:
• El cliente cambió de opinión después del pedido
• Los errores en el diseño fueron aprobados por el cliente
• El producto fue almacenado incorrectamente por el cliente

Para iniciar una devolución, contacte a nuestro servicio al cliente dentro de los 7 días siguientes a la recepción del producto con fotografías del daño o defecto.`,
    },
    {
      title: '7. Propiedad Intelectual',
      content: `Todo el contenido del Sitio, incluyendo pero no limitado a textos, gráficos, logos, imágenes, videos, software y código, es propiedad de Vintedge o de nuestros licenciantes y está protegido por leyes de propiedad intelectual.

Usted no puede:
• Copiar, modificar o distribuir nuestro contenido sin autorización escrita
• Usar nuestra marca, logo o nombre comercial sin permiso
• Realizar ingeniería inversa de nuestro software o sistemas

Al subir contenido para personalización, usted nos otorga una licencia limitada para usar dicho contenido únicamente con el propósito de crear su producto personalizado.`,
    },
    {
      title: '8. Limitación de Responsabilidad',
      content: `En la máxima medida permitida por la ley:

• No garantizamos que el Sitio estará disponible de forma ininterrumpida o libre de errores.
• No somos responsables por daños indirectos, incidentales o consecuentes derivados del uso de nuestros servicios.
• Nuestra responsabilidad total no excederá el monto pagado por el pedido específico en cuestión.

El consumo de alcohol conlleva riesgos para la salud. Recomendamos consumir de manera responsable y nunca conducir bajo los efectos del alcohol.`,
    },
    {
      title: '9. Jurisdicción y Ley Aplicable',
      content: `Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Cualquier disputa será resuelta ante los tribunales competentes de la Ciudad de Mendoza, Argentina, renunciando expresamente a cualquier otro fuero que pudiera corresponder.

Para usuarios en otras jurisdicciones, nos comprometemos a cumplir con las leyes locales aplicables en materia de comercio electrónico, protección al consumidor y venta de alcohol.`,
    },
    {
      title: '10. Contacto',
      content: `Para cualquier consulta relacionada con estos Términos y Condiciones, puede contactarnos a través de:

Email: legal@vintedge.vip
Dirección: Mendoza, Argentina

Responderemos a su consulta en un plazo máximo de 5 días hábiles.`,
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
            Términos y <span className="italic text-[#D4AF37]">Condiciones</span>
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

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 rounded-xl bg-white p-8 shadow-soft"
          >
            <p className="font-cormorant text-lg leading-relaxed text-[#444]">
              Bienvenido a Vintedge. Estos Términos y Condiciones regulan el uso de nuestro 
              sitio web y la compra de nuestros productos. Le recomendamos leerlos 
              detenidamente antes de utilizar nuestros servicios.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="rounded-xl bg-white p-8 shadow-soft"
              >
                <h2 className="mb-4 font-playfair text-xl text-[#722F37]">{section.title}</h2>
                <div className="font-cormorant text-base leading-relaxed text-[#444] whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="font-cormorant text-base text-[#666]">
              Consulte también nuestra{' '}
              <Link href={`/${locale}/privacy`} className="text-[#722F37] underline hover:no-underline">
                Política de Privacidad
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
