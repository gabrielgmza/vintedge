# Guía de Deploy a Cloud Run - Vintedge

## Opción 1: Deploy Manual desde Cloud Console (Recomendado para inicio)

### Paso 1: Abrir Cloud Shell

1. Ve a `https://console.cloud.google.com`
2. Click en el ícono de **Cloud Shell** (terminal) arriba a la derecha
3. Espera a que se inicie

### Paso 2: Clonar Repositorio

En Cloud Shell, ejecuta:

```bash
git clone https://github.com/TU-USUARIO/vintedge.git
cd vintedge
```

### Paso 3: Configurar Variables de Entorno

```bash
# Crear archivo .env para producción
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=8080
API_PREFIX=api
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost/vintedge_main?host=/cloudsql/vintedge:us-central1:vintedge-db-prod
FIREBASE_PROJECT_ID=vintedge
CORS_ORIGINS=https://vintedge.vip,https://www.vintedge.vip
EOF
```

### Paso 4: Build de la Imagen Docker

```bash
# Configurar Docker para usar Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build de la imagen
cd apps/api
docker build -t us-central1-docker.pkg.dev/vintedge/vintedge-images/api:v1 .
```

### Paso 5: Push a Artifact Registry

```bash
docker push us-central1-docker.pkg.dev/vintedge/vintedge-images/api:v1
```

### Paso 6: Deploy a Cloud Run

```bash
gcloud run deploy vintedge-api \
  --image us-central1-docker.pkg.dev/vintedge/vintedge-images/api:v1 \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances vintedge:us-central1:vintedge-db-prod \
  --set-env-vars "NODE_ENV=production,PORT=8080" \
  --set-secrets "DATABASE_PASSWORD=DATABASE_PASSWORD:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest" \
  --service-account vintedge-backend@vintedge.iam.gserviceaccount.com \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### Paso 7: Obtener URL del Servicio

Después del deploy, verás algo como:
```
Service URL: https://vintedge-api-xxxxx-uc.a.run.app
```

Esta es tu URL de API de producción.

---

## Opción 2: Deploy Automático con Cloud Build

### Paso 1: Conectar Repositorio

1. Menú (☰) → **Cloud Build** → **Activadores**
2. Click **"CONECTAR REPOSITORIO"**
3. Selecciona **"GitHub"**
4. Autoriza y selecciona tu repositorio `vintedge`

### Paso 2: Crear Activador

1. Click **"CREAR ACTIVADOR"**
2. Configura:
   - **Nombre**: `deploy-api-prod`
   - **Evento**: Push a rama
   - **Rama**: `^main$`
   - **Configuración**: Archivo de configuración de Cloud Build
   - **Ubicación**: `cloudbuild.yaml`
3. Click **"CREAR"**

### Paso 3: Configurar Substituciones

En el activador, agregar variables:
- `_CLOUD_SQL_CONNECTION`: `vintedge:us-central1:vintedge-db-prod`

### Paso 4: Hacer Push

Cada push a `main` activará el build y deploy automático.

---

## Verificar Deploy

### Health Check

```bash
curl https://TU-URL-CLOUD-RUN/api/v1/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T...",
  "version": "1.0.0"
}
```

### Swagger Docs (solo en desarrollo)

Si `NODE_ENV=development`:
```
https://TU-URL/docs
```

---

## Configurar Dominio Personalizado

### Paso 1: Mapear Dominio

1. Cloud Run → `vintedge-api` → **DOMINIOS PERSONALIZADOS**
2. Click **"AGREGAR ASIGNACIÓN"**
3. Dominio: `api.vintedge.vip`
4. Sigue las instrucciones para verificar DNS

### Paso 2: Configurar DNS en tu Registrador

Agrega registro CNAME:
- **Nombre**: `api`
- **Valor**: `ghs.googlehosted.com`

---

## Ejecutar Migraciones en Producción

### Desde Cloud Shell:

```bash
# Conectar a Cloud SQL usando proxy
cloud_sql_proxy -instances=vintedge:us-central1:vintedge-db-prod=tcp:5432 &

# Esperar conexión
sleep 5

# Ejecutar migraciones
cd packages/database
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/vintedge_main" npx prisma migrate deploy

# Ejecutar seed (solo primera vez)
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/vintedge_main" npx ts-node prisma/seed.ts
```

---

## Monitoreo

### Ver Logs

1. Cloud Run → `vintedge-api` → **REGISTROS**
2. O en Cloud Logging: Menú → Logging → Explorador de registros

### Métricas

1. Cloud Run → `vintedge-api` → **MÉTRICAS**
2. Ve: Solicitudes, Latencia, Memoria, CPU

### Alertas

1. Menú → **Monitoring** → **Alertas**
2. Crear política para:
   - Error rate > 5%
   - Latency P95 > 2s
   - Memory > 80%
