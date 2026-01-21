# 🍷 Vintedge Web - Frontend Redesign

**Premium Wine Customization Platform - Luxury Editorial Design**

## ✨ Características del Nuevo Diseño

- 🎨 **Diseño Luxury Editorial** - Inspiración Dom Pérignon, Opus One
- 🖤 **Paleta Premium** - Burgundy, Champagne Gold, Black, Cream
- ✍️ **Tipografía Elegante** - Playfair Display + Cormorant Garamond
- 🎬 **Animaciones Suaves** - Framer Motion con parallax y reveals
- 🌍 **Multi-idioma** - ES, EN, PT, HI, JA
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Optimizado** - Next.js 14 con standalone output

## 📂 Estructura de Archivos

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raíz con fuentes
│   │   ├── globals.css             # Estilos globales premium
│   │   └── [locale]/
│   │       ├── page.tsx            # Landing page rediseñada
│   │       ├── about/page.tsx      # Página About
│   │       ├── contact/page.tsx    # Página Contact
│   │       ├── terms/page.tsx      # Términos y Condiciones
│   │       └── privacy/page.tsx    # Política de Privacidad
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx          # Botones premium
│   │   │   └── input.tsx           # Inputs estilizados
│   │   └── layout/
│   │       ├── Header.tsx          # Header con navegación
│   │       └── Footer.tsx          # Footer completo
│   ├── lib/
│   │   ├── utils.ts                # Utilidades y helpers
│   │   └── firebase.ts             # Configuración Firebase
│   ├── stores/
│   │   ├── auth-store.ts           # Estado de autenticación
│   │   └── cart-store.ts           # Estado del carrito
│   ├── messages/
│   │   ├── es.json                 # Traducciones español
│   │   └── en.json                 # Traducciones inglés
│   ├── i18n.ts                     # Configuración i18n
│   └── middleware.ts               # Middleware de routing
├── tailwind.config.ts              # Configuración Tailwind premium
├── next.config.js                  # Config Next.js optimizada
├── tsconfig.json                   # TypeScript config
├── postcss.config.js               # PostCSS config
├── Dockerfile                      # Docker para Cloud Run
└── package.json                    # Dependencias actualizadas
```

## 🚀 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/gabrielgmza/vintedge.git
cd vintedge/apps/web

# Instalar dependencias
pnpm install

# Crear archivo de variables de entorno
cp .env.example .env.local

# Editar .env.local con tus valores:
# NEXT_PUBLIC_API_URL=https://vintedge-api-xxx.run.app
# NEXT_PUBLIC_FIREBASE_API_KEY=xxx
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx

# Ejecutar en desarrollo
pnpm dev
```

## 🔧 Variables de Entorno

Crea un archivo `.env.local`:

```env
# API Backend
NEXT_PUBLIC_API_URL=https://vintedge-api-278599265960.us-central1.run.app

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gen-lang-client-0787178779.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gen-lang-client-0787178779
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gen-lang-client-0787178779.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

## 📦 Deploy a Google Cloud Run

### Desde Google Cloud Shell:

```bash
# 1. Ir al directorio del frontend
cd ~/vintedge/apps/web

# 2. Configurar proyecto
gcloud config set project gen-lang-client-0787178779

# 3. Build y deploy
gcloud builds submit --config=cloudbuild.yaml .

# O manualmente:
gcloud run deploy vintedge-web \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_API_URL=https://vintedge-api-278599265960.us-central1.run.app" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_PROJECT_ID=gen-lang-client-0787178779"
```

## 🎨 Sistema de Diseño

### Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Burgundy | `#722F37` | Primary brand, CTAs |
| Champagne Gold | `#D4AF37` | Accents, highlights |
| Black | `#0A0A0A` | Backgrounds, text |
| Cream | `#FAF7F2` | Light backgrounds |

### Tipografía

- **Display**: Playfair Display (serif, elegant)
- **Body**: Cormorant Garamond (readable, refined)

### Componentes Principales

- `Button` - Variantes: default, gold, outline, ghost
- `Input` - Variantes: default, dark
- `Header` - Navegación con scroll effects
- `Footer` - Links, newsletter, social

## 📱 Páginas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/[locale]` | Landing page principal |
| `/[locale]/wines` | Catálogo de vinos |
| `/[locale]/wines/[id]` | Detalle de vino |
| `/[locale]/customize` | Editor de etiquetas |
| `/[locale]/about` | Sobre nosotros |
| `/[locale]/contact` | Contacto |
| `/[locale]/terms` | Términos y condiciones |
| `/[locale]/privacy` | Política de privacidad |
| `/[locale]/auth/signin` | Iniciar sesión |
| `/[locale]/auth/signup` | Registro |
| `/[locale]/checkout` | Checkout |
| `/[locale]/account` | Mi cuenta |

## 🖼️ Imágenes Necesarias

Crear en `/public/images/`:

```
images/
├── hero-wine-cellar.jpg      # Hero background (1920x1080)
├── wine-pouring.jpg          # Philosophy section
├── wine-barrels.jpg          # CTA background
├── wines/
│   ├── cabernet.jpg          # Product images
│   ├── chardonnay.jpg
│   └── rose.jpg
├── testimonials/
│   ├── sarah.jpg             # Testimonial avatars
│   ├── james.jpg
│   └── maria.jpg
└── payments/
    ├── visa.svg              # Payment icons
    ├── mastercard.svg
    ├── amex.svg
    └── stripe.svg
```

## 📝 Changelog

### v2.0.0 (2024)
- ✅ Rediseño completo de landing page
- ✅ Nuevo sistema de diseño luxury
- ✅ Animaciones con Framer Motion
- ✅ Páginas legales (About, Contact, Terms, Privacy)
- ✅ Header y Footer premium
- ✅ Componentes UI mejorados
- ✅ Optimización de rendimiento

---

**Vintedge** - Crafting Unique Wine Experiences 🍷
