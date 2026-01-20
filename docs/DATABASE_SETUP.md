# Guía de Configuración de Base de Datos - Vintedge

## Prerrequisitos

1. Cloud SQL instancia `vintedge-db-prod` creada y ejecutándose
2. Base de datos `vintedge_main` creada
3. IP autorizada en Cloud SQL

## Paso 1: Obtener Credenciales de Cloud SQL

### En Google Cloud Console:

1. Menú (☰) → **SQL**
2. Click en `vintedge-db-prod`
3. Anota:
   - **IP Pública**: `34.xxx.xxx.xxx`
   - **Nombre de conexión**: `vintedge:us-central1:vintedge-db-prod`

## Paso 2: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Base de datos
DATABASE_HOST=34.xxx.xxx.xxx  # Tu IP de Cloud SQL
DATABASE_PORT=5432
DATABASE_NAME=vintedge_main
DATABASE_USER=postgres
DATABASE_PASSWORD=TU_CONTRASEÑA_SEGURA

# URL completa para Prisma
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@34.xxx.xxx.xxx:5432/vintedge_main?schema=public"

# Firebase
FIREBASE_PROJECT_ID=vintedge
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@vintedge.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe (usar keys de TEST primero)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# App
NODE_ENV=development
PORT=4000
API_PREFIX=api
CORS_ORIGINS=http://localhost:3000
```

## Paso 3: Instalar Dependencias (en tu computadora)

Necesitas Node.js 20+ y pnpm instalados:

### Instalar pnpm (si no lo tienes):
```bash
# En Windows (PowerShell como admin):
npm install -g pnpm

# En Mac/Linux:
npm install -g pnpm
```

### Instalar dependencias del proyecto:
```bash
cd vintedge
pnpm install
```

## Paso 4: Generar Cliente Prisma

```bash
cd packages/database
pnpm generate
```

## Paso 5: Ejecutar Migraciones

### Primera migración (crear todas las tablas):
```bash
pnpm migrate:dev --name init
```

Esto creará todas las tablas definidas en `schema.prisma`.

### Verificar migración:
```bash
pnpm migrate:status
```

## Paso 6: Cargar Datos Iniciales (Seed)

```bash
pnpm db:seed
```

Esto cargará:
- 8 vinos base para personalización
- 6 templates de etiquetas
- 7 reglas de precios
- Código promocional WELCOME10

## Paso 7: Verificar con Prisma Studio

```bash
pnpm studio
```

Abre `http://localhost:5555` en tu navegador para ver los datos.

---

## Troubleshooting

### Error: "Connection refused"
- Verifica que tu IP esté autorizada en Cloud SQL
- Verifica que la instancia esté ejecutándose

### Error: "Authentication failed"
- Verifica la contraseña en DATABASE_URL
- Asegúrate de que el usuario `postgres` existe

### Error: "Database does not exist"
- Crea la base de datos `vintedge_main` en Cloud SQL:
  1. Cloud Console → SQL → vintedge-db-prod
  2. Bases de datos → Crear base de datos → `vintedge_main`

### Error: "Permission denied"
- Verifica los roles de la cuenta de servicio en IAM

---

## Producción

Para producción, Cloud Run se conecta a Cloud SQL usando socket:

```bash
DATABASE_URL="postgresql://postgres:PASSWORD@localhost/vintedge_main?host=/cloudsql/vintedge:us-central1:vintedge-db-prod"
```

Esta conexión se configura automáticamente en el deploy de Cloud Run.
