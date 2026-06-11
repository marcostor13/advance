# Guía de Despliegue — Advance Group

Monorepo con frontend Angular 21 en **Netlify** y backend NestJS 11 en **Coolify** (Docker), coordinados por **GitHub Actions**.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Repositorio GitHub](#2-repositorio-github)
3. [MongoDB Atlas](#3-mongodb-atlas)
4. [Backend en Coolify](#4-backend-en-coolify)
5. [Frontend en Netlify](#5-frontend-en-netlify)
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
| [Netlify](https://netlify.com) | Hosting frontend (SPA) |
| [Coolify](https://coolify.io) | Hosting backend (Docker) |
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

### 4.2 Crear la aplicación

1. En Coolify: **New Resource → Application → Docker Image**
2. Conectar el repositorio GitHub (vía GitHub App o Personal Access Token)
3. En la configuración:

| Campo | Valor |
|---|---|
| **Image** | `ghcr.io/<github-usuario>/<repo>/backend:latest` |
| **Port** | `3000` |
| **Healthcheck path** | `/api/health` |

> La imagen se construye en GitHub Actions y se publica en GHCR (GitHub Container Registry). El repositorio de contenedores es público por defecto para repos públicos; para repos privados, configura acceso a GHCR en Coolify.

### 4.3 Variables de entorno en Coolify

En la pestaña **Environment Variables** de la aplicación, agregar:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...   # URI completa de MongoDB Atlas
FRONTEND_URL=https://<tu-sitio>.netlify.app   # URL real de Netlify
JWT_SECRET=<cadena_aleatoria_larga_y_segura>
JWT_EXPIRES=7d
ADMIN_EMAIL=admin@advancegroup.pe
ADMIN_PASSWORD=<contraseña_admin_segura>
DEEPSEEK_API_KEY=<tu_clave_deepseek>
```

### 4.4 Obtener el webhook de Coolify

1. En la aplicación de Coolify: **Settings → Deploy Webhook**
2. Copiar la URL del webhook (formato: `https://tu-coolify.com/api/v1/deploy?token=xxx&uuid=xxx`)
3. Guardar esta URL como secreto de GitHub (ver sección 6)

### 4.5 Actualizar la URL del backend en el frontend

**ANTES** de hacer el primer despliegue del frontend, actualiza el archivo:

```
frontend/src/environments/environment.prod.ts
```

Reemplaza la URL placeholder con la URL real de tu backend en Coolify:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://<tu-dominio-coolify>/api',  // ← reemplazar con URL real
};
```

Luego commit y push para que el CI/CD tome el cambio.

---

## 5. Frontend en Netlify

### 5.1 Crear el sitio

**Opción A — Vía CLI:**
```bash
npx netlify-cli login
npx netlify-cli sites:create --name advance-group
```

**Opción B — Vía UI:**
1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Conectar con GitHub → seleccionar el repositorio
3. Netlify detectará automáticamente `netlify.toml` en la raíz del repo

### 5.2 Configuración detectada automáticamente desde `netlify.toml`

| Campo | Valor |
|---|---|
| Base directory | `frontend` |
| Build command | `npm run build:prod` |
| Publish directory | `dist/advance-group-frontend/browser` |
| Node version | 22 |

> No se necesita configurar nada manualmente — el `netlify.toml` en la raíz del repo lo gestiona todo.

### 5.3 Obtener las credenciales de Netlify

**NETLIFY_SITE_ID:**
- UI: Site settings → General → Site details → Site ID
- CLI: `npx netlify-cli sites:list`

**NETLIFY_AUTH_TOKEN:**
- UI: User settings → Applications → Personal access tokens → New access token
- CLI: `npx netlify-cli token:list`

---

## 6. Secretos de GitHub Actions

En el repositorio GitHub: **Settings → Secrets and variables → Actions → New repository secret**

| Secreto | Valor |
|---|---|
| `NETLIFY_AUTH_TOKEN` | Token de acceso personal de Netlify |
| `NETLIFY_SITE_ID` | ID del sitio en Netlify |
| `COOLIFY_WEBHOOK_URL` | URL del deploy webhook de Coolify |
| `COOLIFY_TOKEN` | API Token de Coolify (Settings → API Tokens) |

> `GITHUB_TOKEN` es automático — no es necesario configurarlo.

---

## 7. Primer despliegue

### Backend (orden importante)

```bash
# 1. Asegúrate de que la imagen GHCR es pública o que Coolify tiene acceso
# 2. El primer push a main construye y publica la imagen
git push origin main

# 3. Monitorear en GitHub → Actions → Backend CI/CD
# 4. Verificar en Coolify que la aplicación levantó correctamente
curl https://<tu-dominio-coolify>/api/health
```

### Frontend

```bash
# El push a main también dispara el frontend CI/CD
# Netlify desplegará automáticamente

# Verificar
curl https://<tu-sitio>.netlify.app
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
FRONTEND_URL=https://<tu-sitio>.netlify.app

# JWT
JWT_SECRET=<mínimo_32_caracteres_aleatorios>
JWT_EXPIRES=7d

# Admin inicial
ADMIN_EMAIL=admin@advancegroup.pe
ADMIN_PASSWORD=<contraseña_segura>

# DeepSeek AI
DEEPSEEK_API_KEY=sk-...
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

1. Abrir `https://<tu-sitio>.netlify.app`
2. Verificar que la página carga sin errores en consola
3. Probar el cotizador en `/factoring` → sección Cotizador
4. Probar el simulador en `/capital` → sección Simulador
5. Probar el chat flotante (ícono inferior derecho)
6. Verificar `/contacto` con los datos correctos

---

## 10. Flujo de despliegue continuo

```
Push a main
├── frontend/** cambió → GitHub Actions (frontend-ci.yml)
│   ├── test (ChromeHeadless)
│   ├── build:prod
│   └── deploy → Netlify (automático)
│
└── backend/** cambió → GitHub Actions (backend-ci.yml)
    ├── test:cov
    ├── docker build → push a GHCR (:latest + :sha-xxxxxxx)
    └── curl webhook → Coolify redeploy
```

### Ramas

| Rama | Comportamiento |
|---|---|
| `main` | Despliegue automático a producción |
| `develop` | Solo tests y build (sin deploy) |
| `feature/*`, `fix/*` | Solo tests en PR |

---

## Notas finales

- **GHCR private repos**: Si el repo de GitHub es privado, la imagen Docker en GHCR también será privada. En Coolify, configurar las credenciales de GHCR en **Settings → Registries**.
- **Dominio personalizado**: Configurar en Netlify (Settings → Domain management) y en Coolify (Settings → Domains). Actualizar `FRONTEND_URL` en Coolify y `environment.prod.ts` con los dominios reales.
- **HTTPS**: Netlify provee SSL automático. Coolify provee SSL vía Let's Encrypt si configuras un dominio.
- **Backups MongoDB**: Activar backups automáticos en MongoDB Atlas (M2+ o Cloud Backup).
