# Propuesta SEM / SEO / AEO / GEO — Advance Group

**Cliente:** Advance Group (Advance Factoring · Advance Capital)
**Sitio:** advance-group.pe
**Fecha:** Setiembre 2026
**Inversión total:** S/ 4,500 (dos fases)

---

## 1. Diagnóstico: por qué hoy el sitio no es visible

Se auditó el código de la plataforma (Angular 21 + NestJS 11). Estos son los hallazgos que hoy bloquean el posicionamiento:

| # | Hallazgo | Impacto |
|---|---|---|
| 1 | **La web es 100% client-side (SPA sin SSR).** El HTML que se entrega al crawler es prácticamente `<body><app-root></app-root></body>`; todo el contenido se pinta con JavaScript. | Google puede renderizar JS, pero con retraso y de forma parcial. **Los bots de IA (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot) no ejecutan JavaScript: para ellos la web está literalmente vacía.** Hoy Advance es invisible en ChatGPT, Perplexity, Gemini y AI Overviews. |
| 2 | **Un solo `<title>` y una sola meta description** en `index.html` para todo el sitio ("Advance Group — Soluciones empresariales de alto impacto"). Los títulos por ruta se aplican recién en el navegador. | Todas las páginas compiten con el mismo snippet. Cero control del clic en resultados. |
| 3 | **No existe `robots.txt` ni `sitemap.xml`.** | Los buscadores descubren páginas por azar; `/admin` y `/portal` quedan expuestos al rastreo. |
| 4 | **Cero datos estructurados (JSON-LD).** No hay `Organization`, `FinancialService`, `FAQPage` ni `BreadcrumbList`. | Sin rich results, sin panel de marca, y sin el formato que los motores de IA usan para extraer respuestas. |
| 5 | **Sin Open Graph / Twitter Cards.** | Los enlaces compartidos en WhatsApp o LinkedIn salen sin imagen ni descripción — crítico en un negocio B2B que se mueve por referidos. |
| 6 | **Sin analítica ni medición de conversiones.** No hay GA4, GTM ni Search Console. | El cotizador de factoring, el simulador de capital y el formulario de contacto generan leads que **hoy no se miden**. Sin datos no hay optimización posible ni cálculo de costo por lead. |
| 7 | **Soft 404:** nginx responde `200 OK` con `index.html` a cualquier ruta inexistente. | Google puede indexar URLs basura y diluir la autoridad del dominio. |
| 8 | **No hay contenido indexable de fondo** (blog, recursos, FAQs). | Sin contenido no hay cola larga, y sin cola larga no hay nada que un LLM pueda citar. |

**Conclusión:** la plataforma está bien construida a nivel de producto, pero es **inalcanzable para buscadores y asistentes de IA**. Antes de invertir un sol en estrategia hay que hacerla legible. Ese es el orden de las dos fases.

---

## 2. Qué significan SEO, SEM, AEO y GEO (y por qué los cuatro)

| Sigla | Qué es | Para Advance |
|---|---|---|
| **SEO** | Posicionamiento orgánico en Google. | Captar a quien busca "factoring Perú", "adelanto de facturas", "dónde invertir mi dinero en Perú". Tráfico sostenido sin costo por clic. |
| **SEM** | Publicidad pagada (Google Ads). | Leads **desde la semana 1**, mientras el SEO madura. Además, protege la marca: hoy un competidor puede pujar por "Advance Factoring". |
| **AEO** *(Answer Engine Optimization)* | Optimizar para que el buscador muestre **tu** respuesta directa (AI Overviews, fragmentos destacados, "People also ask"). | El 60% de las búsquedas ya termina sin clic. Si Google responde, que responda con contenido de Advance. |
| **GEO** *(Generative Engine Optimization)* | Lograr que ChatGPT, Perplexity, Gemini y Claude **mencionen y citen** a Advance al recomendar opciones. | Cada vez más gerentes financieros preguntan "¿qué empresas de factoring hay en Perú?" a un asistente antes que a Google. Estar o no estar en esa respuesta define el pipeline de los próximos 3 años. |

Los cuatro comparten la misma base técnica: **HTML servido, contenido estructurado y medición**. Por eso una sola implementación (Fase 1) los habilita a todos.

---

## FASE 1 — Implementación técnica (la base)

> **Objetivo:** que el sitio sea legible, rastreable, medible y citable. Sin esto, cualquier estrategia se ejecuta sobre terreno inválido.

### 1.1 Renderizado en servidor (prerender / SSG)
- **Qué:** se incorpora `@angular/ssr` en modo *prerender* para las rutas públicas (`/`, `/factoring`, `/capital`, `/contacto`, `/libro-de-reclamaciones`, `/404`). Cada ruta pasa a generar su propio HTML completo en el build.
- **Cómo:** el output estático se sirve con el nginx y el Docker que ya están en Coolify. **Sin costo de infraestructura adicional y sin servidor Node.** Las rutas privadas (`/portal`, `/admin`) siguen en client-side, como corresponde.
- **Por qué importa:** es el cambio que convierte al sitio de invisible a indexable, tanto para Google como para los bots de IA.

### 1.2 SEO técnico on-page
- `SeoService` centralizado que aplica por ruta: `title`, `meta description`, `canonical`, Open Graph y Twitter Cards.
- `robots.txt` con permiso explícito a `GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot` y `Google-Extended`, y bloqueo de `/admin` y `/portal`.
- `sitemap.xml` con las rutas públicas y prioridades.
- Corrección del soft 404: rutas inexistentes devuelven un **404 real**.
- Jerarquía de encabezados, `alt` de imágenes y enlazado interno revisados página por página.

### 1.3 Datos estructurados (el idioma de la IA)
JSON-LD inyectado en el HTML prerenderizado:
- `Organization` + `LocalBusiness` (las 3 oficinas) → panel de marca en Google.
- `FinancialService` para Advance Factoring y Advance Capital.
- `FAQPage` en cada landing → habilita respuestas directas y fragmentos destacados.
- `BreadcrumbList` y `WebSite`.

### 1.4 Capa GEO: `llms.txt`
Archivo `/llms.txt` y `/llms-full.txt` en la raíz: un resumen estructurado, en texto plano, de quién es Advance, qué ofrece cada empresa, tasas, requisitos y datos de contacto. **Es el estándar emergente que los modelos de lenguaje leen para entender un negocio.** Costo marginal, ventaja competitiva grande: casi ninguna financiera peruana lo tiene.

### 1.5 Medición (sin esto, todo lo demás es opinión)
- Google Analytics 4 + Google Tag Manager instalados.
- Google Search Console y **Bing Webmaster Tools** verificados *(Bing alimenta la búsqueda de ChatGPT — no es opcional)*.
- Eventos de conversión definidos: cotización de factoring completada, simulación de inversión completada, envío de formulario de contacto, clic a WhatsApp y a teléfono.
- Google Business Profile creado/optimizado para las 3 oficinas.

### 1.6 Rendimiento (Core Web Vitals)
Auto-hospedaje de fuentes, `preload` del LCP, revisión de INP y CLS. Meta: **Lighthouse ≥ 90** en móvil. La velocidad es factor de ranking y afecta directamente la conversión.

### Entregables Fase 1
✅ Código en producción (rama, PR y despliegue en Coolify) · ✅ GA4 + GTM + GSC + Bing configurados y verificados · ✅ Informe "antes / después" con Lighthouse y prueba de rastreo · ✅ Accesos entregados al cliente (todas las cuentas quedan a nombre de Advance).

**Plazo:** 3 semanas · **Inversión:** **S/ 2,400** (pago único)

---

## FASE 2 — Estrategia de posicionamiento

> **Objetivo:** convertir la base técnica en tráfico calificado, leads medidos y presencia en respuestas de IA.

### 2.1 Investigación y arquitectura (semana 1–2)
- Keyword research en dos frentes: **demanda de liquidez** (factoring, adelanto de facturas, descuento de letras, capital de trabajo) y **demanda de inversión** (dónde invertir en Perú, rentabilidad, inversión en facturas).
- Análisis de los 5 competidores directos que hoy rankean: qué contenido tienen, qué les falta.
- Mapa de intención → cada keyword asignada a una URL existente o a una nueva. Sin canibalización.

### 2.2 Contenido con doble propósito: SEO + AEO (semana 2–6)
- Optimización de las landings actuales de Factoring y Capital con el mapa de keywords.
- **Hub de recursos** (nueva sección `/recursos`) con **6 artículos** priorizados por volumen e intención comercial. Ej.: *"¿Qué es el factoring y cuánto cuesta en Perú?"*, *"Factoring vs. préstamo bancario"*, *"Cómo invertir en facturas: rentabilidad y riesgo real"*.
- **Formato AEO en todo el contenido:** cada pregunta se responde en un bloque directo de 40–60 palabras antes de desarrollarla, con tablas comparativas y cifras concretas. Es el formato que Google y los LLMs extraen para citar.
- Bloque de FAQs por servicio, marcado con `FAQPage`.

### 2.3 GEO — presencia en motores generativos (semana 3–8)
Los LLMs no citan sitios web: citan **consensos entre fuentes**. El trabajo es construir ese consenso.
- Alta y homogeneización de datos (NAP: nombre, dirección, teléfono) en directorios de negocio y financieros del Perú.
- Optimización de perfiles de LinkedIn y Google Business Profile como fuentes citables.
- Contenido comparativo y con datos propios (tasas, plazos, casos) — es lo que los modelos prefieren citar frente al contenido publicitario.
- **Monitoreo de citaciones:** batería de 15 prompts de control ("mejores empresas de factoring en Perú", "dónde invertir en facturas", etc.) medida mensualmente en ChatGPT, Perplexity y Gemini, con registro de si Advance aparece y en qué posición. **Se mide, no se asume.**

### 2.4 SEM — Google Ads (semana 2 en adelante)
- Estructura de cuenta: campaña de **marca** (defensiva, CPC bajo), campaña de **factoring** y campaña de **inversión**, separadas por intención.
- Redacción de anuncios y extensiones; lista de palabras negativas para no quemar presupuesto en tráfico irrelevante (empleo, tareas académicas, etc.).
- Conversiones importadas desde GA4 → se optimiza por **lead real**, no por clics.
- Campaña de remarketing hacia quien abandonó el cotizador o el simulador.
- Recomendación de presupuesto y proyección de costo por lead a partir del primer mes de datos reales.

> ℹ️ **La inversión publicitaria en Google no está incluida** en esta cotización (se paga directamente a Google con la tarjeta de Advance). Presupuesto sugerido para empezar: **S/ 800 – 1,500 mensuales**.

### 2.5 Medición y reporte
- Dashboard en Looker Studio: tráfico, posiciones, leads por canal, costo por lead y citaciones en IA — en una sola vista, con acceso permanente.
- **2 reportes mensuales** con lectura de resultados y decisiones para el mes siguiente.

### Entregables Fase 2
✅ Documento de estrategia con keywords, mapa de intención y calendario · ✅ 6 artículos publicados y optimizados · ✅ Landings optimizadas + FAQs con schema · ✅ Cuenta de Google Ads construida y activa · ✅ Dashboard Looker Studio · ✅ 2 reportes mensuales con reunión de revisión.

**Plazo:** 8 semanas · **Inversión:** **S/ 2,100**

---

## 3. Resultados esperados

Con metas realistas y verificables — el SEO no es inmediato, el SEM sí.

| Plazo | Resultado esperado |
|---|---|
| **Semana 3** (fin Fase 1) | 100% de las páginas públicas indexables y rastreables. Lighthouse ≥ 90. Todos los leads medidos desde el primer día. Enlaces compartidos con vista previa correcta. |
| **Semana 4–6** | Primeros leads pagados desde Google Ads con costo por lead medido. Marca protegida en subasta. Aparición en Google Business Profile para búsquedas locales. |
| **Mes 2–3** | Contenido indexado y posicionando en cola larga. Aparición en fragmentos destacados / AI Overviews para preguntas específicas del sector. Primeras menciones en ChatGPT y Perplexity. |
| **Mes 4–6** *(con continuidad)* | Crecimiento sostenido del tráfico orgánico y reducción progresiva del costo por lead, al ir sustituyendo tráfico pagado por orgánico. |

**Beneficio de fondo:** Advance deja de depender exclusivamente de referidos y prospección en frío. Se construye un **activo propio** — dominio con autoridad, contenido citable y una cuenta de Ads calibrada — que sigue generando demanda mes a mes, y se posiciona **antes que la competencia** en el canal que hoy se está definiendo: las respuestas de IA.

---

## 4. Inversión

| Fase | Descripción | Plazo | Inversión |
|---|---|---|---|
| **Fase 1** | Implementación técnica: SSR/prerender, SEO on-page, datos estructurados, `llms.txt`, analítica y medición, Core Web Vitals | 3 semanas | **S/ 2,400** |
| **Fase 2** | Estrategia: keywords, contenido SEO+AEO, GEO, Google Ads, dashboard y 2 reportes | 8 semanas | **S/ 2,100** |
| | | **TOTAL** | **S/ 4,500** |

**Forma de pago:** 50% al inicio de cada fase, 50% contra entrega.
**Incluye:** todo el trabajo técnico, de contenido y de configuración descrito. Herramientas usadas: GA4, GTM, Search Console, Bing Webmaster, Looker Studio y Google Business Profile (**todas sin costo de licencia**).
**No incluye:** inversión publicitaria en Google Ads (S/ 800–1,500/mes sugeridos, pagados directo a Google), producción de video/fotografía, ni artículos adicionales a los 6 acordados.

**Continuidad opcional (no incluida en este monto):** a partir del mes 4, mantenimiento mensual de contenido, gestión de Ads y monitoreo GEO. Se cotiza aparte solo si los resultados de la Fase 2 lo justifican.

---

## 5. Por qué ahora

El GEO está en el mismo punto en el que estaba el SEO en 2005: **el costo de entrar es bajo y la ventaja del primero es duradera**. Ninguna financiera peruana mediana está optimizando hoy para motores generativos. En 12 meses, cuando lo hagan todas, el costo de aparecer será varias veces mayor.

Y hay un punto más simple: **hoy Advance no mide un solo lead**. Cada semana que pasa sin medición es una semana de decisiones tomadas a ciegas.
