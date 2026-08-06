# Guía de Despliegue — Advance Group

Monorepo con frontend Angular 21 y backend NestJS 11, ambos en **Coolify** (Docker), coordinados por **GitHub Actions**.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Repositorio GitHub](#2-repositorio-github)
3. [MongoDB Atlas](#3-mongodb-atlas)
4. [Backend en Coolify](#4-backend-en-coolify)
5. [Frontend en Coolify](#5-frontend-en-coolify)
6. [Secretos de GitHub Actions](#6-secretos-de-github-actions)
7. [Primer despliegue](#7-primer-despliegue)
8. [Variables de entorno de referencia](#8-variables-de-entorno-de-referencia)
9. [Verificación](#9-verificación)
10. [Flujo de despliegue continuo](#10-flujo-de-despliegue-continuo)

---

## 1. Requisitos previos

| Servicio | Propósito |
|---|---|
| [GitHub](https://github.com) | Repositorio + CI/CD |
| [Coolify](https://coolify.io) | Hosting frontend (nginx) y backend (Docker) |
| [MongoDB Atlas](https://mongodb.com/atlas) | Base de datos en la nube |
| [DeepSeek](https://platform.deepseek.com) | API del asistente virtual |

---

## 2. Repositorio GitHub

```bash
# Desde la raíz del monorepo
git init
git add .
git commit -m "feat: initial commit"

# Crear repo en GitHub (puede ser privado)
gh repo create advance-group --private --source=. --push
# O manualmente: crear repo en GitHub y agregar origin
git remote add origin https://github.com/<usuario>/advance-group.git
git push -u origin main
```

> El repositorio puede ser privado. Coolify puede acceder vía GitHub App o token.

---

## 3. MongoDB Atlas

1. Crear cuenta en [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crear un **cluster** (M0 gratuito es suficiente para empezar)
3. En **Database Access**: crear usuario con contraseña segura y permisos `readWriteAnyDatabase`
4. En **Network Access**: agregar `0.0.0.0/0` (o la IP de tu servidor Coolify)
5. En **Connect → Drivers**: copiar el string de conexión:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/advance-group?retryWrites=true&w=majority
   ```

---

## 4. Backend en Coolify

### 4.1 Instalar Coolify (si no está instalado)

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Accede al panel en `http://<tu-servidor>:8000` y completa la configuración inicial.

### 4.2 Crear la aplicación (backend)

1. En Coolify: **New Resource → Application → Public/Private Repository**
2. Conectar el repositorio GitHub (vía GitHub App o Personal Access Token)
3. Seleccionar rama `main`
4. En **Build Settings**, configurar:

| Campo | Valor |
|---|---|
| **Base Directory** | `/backend` |
| **Build Pack** | `Dockerfile` |
| **Dockerfile Location** | `Dockerfile` |
| **Port** | `3000` |
| **Healthcheck path** | `/api/health` |

> `Base Directory = /backend` es crítico en monorepos. Sin esto, Coolify intenta detectar el tipo de app desde la raíz del repositorio y falla (Nixpacks no encuentra una app reconocible). El Dockerfile ya está en `backend/Dockerfile` — con base `/backend` la ruta relativa queda simplemente `Dockerfile`.

### 4.3 Variables de entorno en Coolify

En la pestaña **Environment Variables** de la aplicación, agregar:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...   # URI completa de MongoDB Atlas
FRONTEND_URL=https://advance.midominio.com   # dominio del frontend en Coolify (CORS)
JWT_SECRET=<cadena_aleatoria_larga_y_segura>
JWT_EXPIRES=7d
ADMIN_EMAIL=admin@advancegroup.pe
ADMIN_PASSWORD=<contraseña_admin_segura>
NVIDIA_API_KEY=<tu_clave_de_build.nvidia.com>   # asistente IA del chat flotante
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<cuenta_gmail>
SMTP_PASS=<app_password_de_16_caracteres>       # requiere 2FA, NO la contraseña normal
MAIL_FROM="Advance Group <cuenta_gmail>"
COMPLAINTS_EMAIL=contacto@advance-factoring.com
```

> `FRONTEND_URL` se compara de forma **exacta** contra el `Origin` del navegador (`main.ts`). Debe coincidir en esquema, host y `www`, y sin barra final: `https://advance.com` ≠ `https://www.advance.com` ≠ `https://advance.com/`. Si no coincide, el navegador bloquea la respuesta y el chat muestra "No se pudo contactar al servidor". Para varios dominios, sepáralos con comas.

### 4.4 Obtener el webhook de Coolify

1. En la aplicación de Coolify: **Settings → Deploy Webhook**
2. Copiar la URL del webhook (formato: `https://tu-coolify.com/api/v1/deploy?token=xxx&uuid=xxx`)
3. Guardarla como el secreto de GitHub `COOLIFY_BACKEND_WEBHOOK_URL` (ver sección 6)

### 4.5 Actualizar la URL del backend en el frontend

**ANTES** de hacer el primer despliegue del frontend, actualiza el archivo:

```
frontend/src/environments/environment.prod.ts
```

Reemplaza la URL placeholder con la URL real de tu backend en Coolify:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://apiadvance.marcostorresalarcon.com/api',  // ← reemplazar con URL real
};
```

Luego commit y push para que el CI/CD tome el cambio.

---

## 5. Frontend en Coolify

> ⚠️ **El frontend es una aplicación NUEVA y SEPARADA en Coolify.**
> No reutilices ni reconfigures la aplicación del backend. Son dos aplicaciones que
> apuntan al mismo repositorio pero con distinto `Base Directory`, distinto puerto y
> distinto dominio:
>
> | | Backend | Frontend |
> |---|---|---|
> | Base Directory | `/backend` | `/frontend` |
> | Puerto | `3000` | `80` |
> | Healthcheck | `/api/health` | `/healthz` |
> | Dominio | `apiadvance.…` | el del sitio público |
>
> Si le cambias el `Base Directory` a la app del backend, el contenedor pasa a ser
> nginx en el puerto 80 mientras Coolify sigue enrutando al 3000 → el proxy responde
> **503 `no available server`** y el backend queda caído.

El frontend se sirve como imagen Docker: se compila con Angular CLI y el resultado
estático lo sirve **nginx**. La configuración vive en el repo:

| Archivo | Propósito |
|---|---|
| `frontend/Dockerfile` | Build multi-stage: `node:22-alpine` → `nginx:1.27-alpine` |
| `frontend/nginx/default.conf` | SPA fallback, caché de assets, gzip, healthcheck |
| `frontend/nginx/security-headers.conf` | Cabeceras de seguridad (incluido en cada `location`) |
| `frontend/.dockerignore` | Excluye `node_modules`, `dist`, `.angular`, etc. |

### 5.1 Crear la aplicación (frontend)

1. En Coolify: **New Resource → Application → Public/Private Repository**
2. Conectar el mismo repositorio GitHub y seleccionar rama `main`
3. En **Build Settings**, configurar:

| Campo | Valor |
|---|---|
| **Base Directory** | `/frontend` |
| **Build Pack** | `Dockerfile` |
| **Dockerfile Location** | `Dockerfile` |
| **Port** | `80` |
| **Healthcheck path** | `/healthz` |

> Igual que en el backend, `Base Directory = /frontend` es obligatorio en monorepos:
> sin eso Coolify busca el Dockerfile en la raíz del repo y falla.

### 5.2 Dominio y SSL

1. **Settings → Domains** → agregar el dominio (ej. `https://advance.midominio.com`)
2. Apuntar el registro DNS `A` al servidor de Coolify
3. Coolify emite el certificado Let's Encrypt automáticamente

### 5.3 Variables de entorno

El frontend **no** necesita variables en Coolify: la `apiUrl` se compila dentro del
bundle desde `frontend/src/environments/environment.prod.ts`. Si cambia la URL del
backend hay que editar ese archivo y hacer push (no basta con reiniciar el contenedor).

### 5.4 Obtener el webhook del frontend

1. En la aplicación frontend de Coolify: **Settings → Deploy Webhook**
2. Guardar la URL como el secreto de GitHub `COOLIFY_FRONTEND_WEBHOOK_URL` (ver sección 6)

### 5.5 Probar la imagen localmente

```bash
cd frontend
docker build -t advance-frontend .
docker run --rm -p 8080:80 advance-frontend
# http://localhost:8080  → la app
# http://localhost:8080/healthz  → "ok"
```

---

## 6. Secretos de GitHub Actions

En el repositorio GitHub: **Settings → Secrets and variables → Actions → New repository secret**

| Secreto | Valor |
|---|---|
| `COOLIFY_BACKEND_WEBHOOK_URL` | Deploy webhook de la aplicación **backend** en Coolify |
| `COOLIFY_FRONTEND_WEBHOOK_URL` | Deploy webhook de la aplicación **frontend** en Coolify |
| `COOLIFY_TOKEN` | API Token de Coolify (Settings → API Tokens) |

> `GITHUB_TOKEN` es automático — no es necesario configurarlo.

**Migración desde Netlify:** el secreto que antes se llamaba `COOLIFY_WEBHOOK_URL`
ahora es `COOLIFY_BACKEND_WEBHOOK_URL`. Los secretos `NETLIFY_AUTH_TOKEN` y
`NETLIFY_SITE_ID` ya no se usan y pueden eliminarse.

---

## 7. Primer despliegue

### Backend (orden importante)

```bash
# 1. Asegúrate de que la imagen GHCR es pública o que Coolify tiene acceso
# 2. El primer push a main construye y publica la imagen
git push origin main

# 3. Monitorear en GitHub → Actions → Backend CI/CD
# 4. Verificar en Coolify que la aplicación levantó correctamente
curl https://apiadvance.marcostorresalarcon.com/api/health
```

### Frontend

```bash
# El push a main también dispara el frontend CI/CD,
# que llama al webhook de Coolify tras pasar tests y build

# Verificar
curl https://advance.midominio.com/healthz   # → ok
curl -I https://advance.midominio.com/       # → 200, Cache-Control: no-cache
```

### Seed inicial de la base de datos

El backend crea automáticamente el usuario admin al iniciar si `ADMIN_EMAIL` y `ADMIN_PASSWORD` están configurados. Verificar en los logs de Coolify.

---

## 8. Variables de entorno de referencia

### Backend (`.env.example`)

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/advance-group?retryWrites=true&w=majority

# App
PORT=3000
NODE_ENV=production

# CORS
FRONTEND_URL=https://advance.midominio.com

# JWT
JWT_SECRET=<mínimo_32_caracteres_aleatorios>
JWT_EXPIRES=7d

# Admin inicial
ADMIN_EMAIL=admin@advancegroup.pe
ADMIN_PASSWORD=<contraseña_segura>

# NVIDIA API (build.nvidia.com) — asistente IA del chat
NVIDIA_API_KEY=nvapi-...

# SMTP (Gmail) — contacto, recuperación de contraseña y libro de reclamaciones
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<cuenta_gmail>
SMTP_PASS=<app_password_de_16_caracteres>
MAIL_FROM="Advance Group <cuenta_gmail>"
COMPLAINTS_EMAIL=contacto@advance-factoring.com
```

### Frontend

Las variables de entorno del frontend se configuran en `environment.prod.ts` (se compilan en el bundle, NO en runtime). El único valor configurable es:

```typescript
apiUrl: 'https://<backend-url>/api'
```

---

## 9. Verificación

### Backend

```bash
# Health check
GET https://<backend>/api/health
# Esperado: { status: "ok", ... }

# Test del chat
POST https://<backend>/api/chat
Content-Type: application/json
{ "messages": [{ "role": "user", "content": "Hola" }] }
```

### Frontend

1. Abrir `https://advance.midominio.com`
2. Verificar que la página carga sin errores en consola
3. Recargar (F5) sobre una ruta profunda como `/factoring` → debe responder 200, no 404
   (comprueba el SPA fallback de nginx)
4. Probar el cotizador en `/factoring` → sección Cotizador
5. Probar el simulador en `/capital` → sección Simulador
6. Probar el chat flotante (ícono inferior derecho)
7. Verificar `/contacto` con los datos correctos

---

## 10. Flujo de despliegue continuo

```
Push a main
├── frontend/** cambió → GitHub Actions (frontend-ci.yml)
│   ├── test (ChromeHeadless)
│   ├── build:prod  (gate — verifica que compila)
│   └── curl COOLIFY_FRONTEND_WEBHOOK_URL → Coolify build (Dockerfile) + redeploy
│
└── backend/** cambió → GitHub Actions (backend-ci.yml)
    ├── test:cov
    └── curl COOLIFY_BACKEND_WEBHOOK_URL → Coolify build (Dockerfile) + redeploy
```

> Coolify clona el repo y construye la imagen él mismo — GitHub Actions solo valida
> (tests + build) y dispara el webhook. No se publica ninguna imagen en un registry.

### Ramas

| Rama | Comportamiento |
|---|---|
| `main` | Despliegue automático a producción |
| `develop` | Solo tests y build (sin deploy) |
| `feature/*`, `fix/*` | Solo tests en PR |

---

## Notas finales

- **Repos privados**: Coolify necesita acceso al repositorio vía GitHub App o Personal Access Token (**Sources → GitHub**). Ambas aplicaciones (frontend y backend) usan la misma fuente.
- **Dominios**: configurar ambos en Coolify (**Settings → Domains**) — frontend y backend son dos aplicaciones separadas con dominios distintos. Actualizar `FRONTEND_URL` en el backend y `apiUrl` en `frontend/src/environments/environment.prod.ts` con los dominios reales.
- **HTTPS**: Coolify emite y renueva los certificados vía Let's Encrypt en cuanto el DNS apunta al servidor.
- **Recursos del servidor**: el build de Angular corre ahora en el servidor de Coolify. Con menos de 2 GB de RAM el build puede morir por OOM — si ocurre, agregar swap o construir la imagen en CI y publicarla en un registry.
- **Caché de assets**: `index.html` se sirve con `no-cache` y los bundles con hash con `immutable` durante un año. Si se cambia `outputHashing` en `angular.json`, revisar `frontend/nginx/default.conf`.
- **Backups MongoDB**: Activar backups automáticos en MongoDB Atlas (M2+ o Cloud Backup).
