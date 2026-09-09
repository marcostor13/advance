# Brief para generar la propuesta en Claude

> **Cómo usar este archivo:** pégalo completo en una conversación nueva de Claude (o adjúntalo) y añade al final la línea de la sección *"Qué le pido a Claude"* según el formato que necesites. Todo el contenido del brief ya está validado — Claude solo lo redacta y lo maqueta, no debe inventar datos nuevos.

---

## 0. Instrucciones para Claude

Eres un consultor senior de marketing digital y SEO técnico. Vas a redactar una **propuesta comercial** para un cliente real a partir del brief que sigue.

**Reglas obligatorias:**

1. **No inventes datos.** Todas las cifras, hallazgos, plazos y precios están en este brief. Si necesitas un dato que no está, márcalo como `[POR CONFIRMAR]` en lugar de rellenarlo.
2. **No prometas posiciones en Google** ni plazos garantizados de ranking. Se comprometen entregables y avances medibles, nunca un puesto.
3. **Tono:** profesional, directo, sin jerga de agencia. El lector es un gerente financiero, no un marketero. Cada término técnico (SSR, JSON-LD, GEO) se explica en una frase la primera vez que aparece.
4. **Estructura obligatoria:** cada bloque de trabajo responde tres preguntas — *qué es, cómo se hace, por qué importa en dinero*.
5. **Español de Perú.** Moneda en soles con formato `S/ 2,900`. Fechas en formato "setiembre 2026".
6. **Longitud:** resumida pero explicativa. Ni un párrafo de relleno; tampoco viñetas sueltas sin contexto.
7. **Los entregables se listan con formato y criterio de aceptación**, nunca como promesas vagas.

---

## 1. Cliente y contexto

| Campo | Valor |
|---|---|
| Cliente | Advance Group — holding financiero peruano |
| Empresas | **Advance Factoring** (liquidez para empresas) y **Advance Capital** (inversiones estructuradas) |
| Sitio | advance-group.pe |
| Stack | Angular 21 (SPA, standalone + signals) + NestJS 11 + MongoDB Atlas, desplegado en Coolify con Docker y nginx |
| Público | Gerentes financieros de PyMEs (lado factoring) e inversionistas personas naturales (lado capital) |
| Presencia actual | 3 oficinas en Perú, 20+ años de experiencia |
| Herramientas de conversión ya existentes en el sitio | Cotizador de factoring, simulador de inversión, formulario de contacto, libro de reclamaciones, portal privado de inversionistas |

---

## 2. Diagnóstico técnico (hallazgos reales de la auditoría de código)

Estos ocho hallazgos son la base de la propuesta. Cada uno debe aparecer con su consecuencia económica, no solo con la descripción técnica.

| # | Hallazgo | Por qué cuesta dinero |
|---|---|---|
| 1 | La web se pinta 100% con JavaScript (SPA sin renderizado en servidor). El HTML que recibe un rastreador es un contenedor vacío. | Google renderiza JS con retraso y de forma parcial. **Los bots de IA (GPTBot, PerplexityBot, ClaudeBot) no ejecutan JavaScript en absoluto:** para ellos el sitio está en blanco. |
| 2 | Un solo título y una sola meta description en `index.html` para todo el sitio. | Inicio, Factoring, Capital y Contacto compiten con el mismo texto en resultados. Cero control sobre el clic. |
| 3 | No existe `robots.txt` ni `sitemap.xml`. | Las páginas se descubren por azar, y `/admin` y `/portal` quedan abiertos al rastreo. |
| 4 | Cero datos estructurados: sin `Organization`, `FinancialService`, `FAQPage` ni `BreadcrumbList`. | Sin resultados enriquecidos, sin panel de marca en Google, y sin el formato del que los motores de IA extraen respuestas. |
| 5 | Sin Open Graph ni Twitter Cards. | Los enlaces compartidos por WhatsApp o LinkedIn salen sin imagen ni descripción — crítico en un negocio B2B que se mueve por referidos. |
| 6 | Sin analítica ni medición: no hay GA4, Tag Manager ni Search Console. | El cotizador, el simulador y el formulario generan leads que **hoy nadie está midiendo**. Sin datos no hay costo por lead ni optimización posible. |
| 7 | Soft 404: nginx responde `200 OK` con el index ante cualquier URL inexistente. | Google puede indexar URLs basura y diluir la autoridad del dominio. |
| 8 | No hay contenido de fondo: ni blog, ni recursos, ni preguntas frecuentes. | Sin contenido no hay búsquedas de cola larga — y no hay nada que un modelo de IA pueda citar. |

**Conclusión que debe quedar clara en la propuesta:** la plataforma está bien construida como producto, pero es inalcanzable para buscadores y asistentes de IA. Por eso la Fase 1 va antes que la Fase 2.

---

## 3. Los cuatro frentes

Los cuatro comparten la misma base técnica (HTML servido, contenido estructurado y medición), por eso una sola implementación los habilita a todos.

| Sigla | Qué es | Qué significa para Advance |
|---|---|---|
| **SEO** | Posicionamiento orgánico en Google. | Captar a quien busca "factoring Perú", "adelanto de facturas", "dónde invertir mi dinero". Tráfico sostenido sin costo por clic. |
| **SEM** | Publicidad pagada (Google Ads). | Leads desde la primera semana, mientras el orgánico madura. Y defensa de marca: hoy un competidor puede pujar por "Advance Factoring". |
| **AEO** | *Answer Engine Optimization*: optimizar para AI Overviews, fragmentos destacados y "otras preguntas". | Seis de cada diez búsquedas ya terminan sin clic. Si Google va a responder por usted, que responda con contenido de Advance. |
| **GEO** | *Generative Engine Optimization*: que ChatGPT, Perplexity, Gemini y Claude mencionen y citen a Advance. | Cada vez más gerentes financieros preguntan a un asistente qué empresas de factoring hay en Perú. Estar o no en esa respuesta define el pipeline de los próximos años. |

---

## 4. FASE 1 — Implementación técnica

**Objetivo:** que el sitio sea legible, rastreable, medible y citable.
**Plazo:** 3 semanas · **Precio: S/ 2,900**

### 4.1 Renderizado en servidor (prerender)
- **Qué:** incorporar `@angular/ssr` en modo *prerender* para las rutas públicas (inicio, Factoring, Capital, contacto, libro de reclamaciones y 404). Cada ruta genera su HTML completo en el build.
- **Cómo:** el resultado estático se sirve con el mismo nginx y el mismo Docker que ya están en Coolify — **sin costo de infraestructura adicional y sin servidor Node**. El portal y el admin siguen del lado del cliente.
- **Por qué:** es el cambio que convierte al sitio de invisible a indexable. Todo lo demás depende de esto.

### 4.2 SEO técnico on-page
- Servicio centralizado de metadatos: título, descripción, canonical, Open Graph y Twitter Cards, únicos por ruta.
- `robots.txt` con permiso explícito a GPTBot, OAI-SearchBot, PerplexityBot y ClaudeBot, y bloqueo de `/admin` y `/portal`.
- `sitemap.xml` con las rutas públicas y sus prioridades, enviado a Google y Bing.
- Corrección del soft 404: las rutas inexistentes devuelven un 404 real.
- Jerarquía de encabezados, textos alternativos y enlazado interno revisados página por página.

### 4.3 Datos estructurados
JSON-LD dentro del HTML ya renderizado: `Organization` y `LocalBusiness` (3 oficinas), `FinancialService` para cada empresa, `FAQPage` en cada landing y `BreadcrumbList`. Es el formato con el que Google arma el panel de marca y con el que los modelos de IA entienden a qué se dedica una empresa.

### 4.4 Capa GEO: `llms.txt`
Resumen estructurado en texto plano —quiénes son, qué hace cada empresa, tasas, requisitos, contacto— publicado en la raíz del dominio. Es el estándar emergente que los modelos de lenguaje leen para entender un negocio. Costo marginal, ventaja real: casi ninguna financiera peruana lo tiene.

### 4.5 Medición
GA4 y Tag Manager instalados; Search Console y **Bing Webmaster Tools** verificados (Bing alimenta la búsqueda de ChatGPT). Cinco eventos de conversión definidos uno por uno: cotización de factoring completada, simulación de inversión completada, formulario enviado, clic a WhatsApp y clic a teléfono. Google Business Profile creado y optimizado para las 3 oficinas.

### 4.6 Rendimiento (Core Web Vitals)
Auto-hospedaje de tipografías, precarga del elemento principal, revisión de INP y CLS. Meta verificable: **Lighthouse ≥ 90 en móvil**.

### Entregables de la Fase 1 (11)

| # | Entregable | Formato | Criterio de aceptación |
|---|---|---|---|
| 1 | Prerender de 6 rutas públicas en producción | Rama + Pull Request + despliegue en Coolify | Cada ruta devuelve el HTML completo sin ejecutar JavaScript |
| 2 | Metadatos únicos por ruta | Código + hoja de control de las 6 rutas | Validado en Sharing Debugger; vista previa correcta en WhatsApp |
| 3 | JSON-LD (5 tipos) | Código en el HTML renderizado | Rich Results Test sin errores en las 6 rutas, con captura |
| 4 | `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` | Archivos en la raíz del dominio | Sitemap aceptado por Search Console y Bing |
| 5 | Corrección del soft 404 | Configuración nginx + ruta 404 | Una URL inexistente devuelve HTTP 404, no 200 |
| 6 | GA4 + Tag Manager instalados | Contenedor publicado + documento de configuración | DebugView registra los 5 eventos, probados uno por uno |
| 7 | Search Console y Bing verificados | Propiedades activas con sitemap enviado | Verificadas y con acceso de propietario para Advance |
| 8 | 3 fichas de Google Business Profile | Fichas publicadas y verificadas | Las 3 oficinas visibles en Maps con datos, horarios, fotos y categoría |
| 9 | Informe técnico antes / después | PDF de 8–10 páginas | Lighthouse comparado + prueba de rastreo + checklist de 20 puntos |
| 10 | Documento de accesos y titularidad | PDF | **Todas las cuentas quedan a nombre de Advance Group** |
| 11 | Sesión de traspaso y capacitación | Reunión de 45 min, grabada | El equipo sabe leer sus reportes y dónde ver sus leads |

---

## 5. FASE 2 — Estrategia de posicionamiento

**Objetivo:** convertir la base técnica en tráfico calificado, leads medidos y presencia en respuestas de IA.
**Plazo:** 8 semanas · **Precio: S/ 3,600**

### 5.1 Investigación y arquitectura de búsqueda
Keyword research en los dos frentes del negocio: **demanda de liquidez** (factoring, adelanto de facturas, descuento de letras, capital de trabajo) y **demanda de inversión** (dónde invertir en Perú, rentabilidad, inversión en facturas). Análisis de los 5 competidores que hoy rankean. Cada keyword se asigna a una URL concreta para que ninguna página compita contra otra del mismo sitio.

### 5.2 Contenido con doble propósito: SEO + AEO
Optimización de las landings de Factoring y Capital, más un **hub de recursos con 6 artículos** priorizados por volumen e intención comercial. Ejemplos de títulos: *"¿Qué es el factoring y cuánto cuesta en Perú?"*, *"Factoring vs. préstamo bancario"*, *"Cómo invertir en facturas: rentabilidad y riesgo real"*.

Todo se escribe en **formato de respuesta directa**: cada pregunta resuelta en 40–60 palabras antes de desarrollarla, con tablas comparativas y cifras concretas. Es el formato que Google y los modelos extraen para citar. Se suma un bloque de preguntas frecuentes por servicio, marcado con `FAQPage`.

### 5.3 GEO: construir presencia en motores generativos
Los modelos no citan webs: citan **consensos entre fuentes**. El trabajo es construir ese consenso — datos de negocio homogéneos (nombre, dirección, teléfono) en directorios peruanos, perfiles de LinkedIn y Google Business optimizados como fuentes citables, y contenido con datos propios (tasas, plazos, casos), que es lo que los modelos prefieren frente al material publicitario.

Y se mide: **batería de 15 prompts de control** consultada cada mes en ChatGPT, Perplexity y Gemini, con registro de si Advance aparece y en qué lugar.

### 5.4 SEM — Google Ads
Cuenta estructurada por intención: campaña de **marca** (defensiva, CPC bajo), campaña de **factoring** y campaña de **inversión**. Redacción de anuncios y extensiones, lista de palabras negativas, y conversiones importadas desde GA4 — **se optimiza por lead real, no por clics**. Se suma remarketing hacia quien abandonó el cotizador o el simulador.

### 5.5 Medición y reporte
Dashboard en Looker Studio con tráfico, posiciones, leads por canal, costo por lead y citaciones en IA. Dos reportes mensuales con lectura de resultados y decisiones concretas para el mes siguiente.

### Entregables de la Fase 2 (11)

| # | Entregable | Formato / cantidad | Criterio de aceptación |
|---|---|---|---|
| 1 | Documento de estrategia de búsqueda | PDF de 15–20 páginas | 60+ keywords con volumen, dificultad e intención; 5 competidores; mapa keyword→URL sin canibalización |
| 2 | Calendario editorial | Hoja de cálculo, 3 meses | Cada pieza con keyword, formato, fecha y responsable |
| 3 | 6 artículos publicados y optimizados | 1,200–1,800 palabras c/u | Respuesta directa + tabla comparativa + FAQ marcada + imagen + enlazado interno + JSON-LD válido |
| 4 | Sección `/recursos` construida | Nueva sección en el sitio | Indexada y enlazada desde el menú principal |
| 5 | Landings de Factoring y Capital optimizadas | 2 páginas reescritas | Keywords aplicadas + mínimo 8 FAQs por servicio con `FAQPage` |
| 6 | Cuenta de Google Ads construida | 3 campañas + 1 remarketing, 6 grupos, 15 anuncios | Conversiones importadas de GA4 y registrando; 100+ palabras negativas |
| 7 | Presencia GEO construida | Datos homogéneos en 10+ directorios y perfiles | Nombre, dirección y teléfono idénticos en todas las fuentes, verificados |
| 8 | Informe de citaciones en IA | 15 prompts × 3 motores × 2 mediciones = 90 consultas | Captura de cada respuesta indicando si Advance aparece y en qué posición |
| 9 | Dashboard en Looker Studio | Tablero de 5 bloques, acceso permanente | Tráfico, posiciones, leads, costo por lead y citaciones, autoactualizado |
| 10 | 2 reportes mensuales | PDF + reunión de 45 min c/u | Cada reporte cierra con 3 decisiones concretas para el mes siguiente |
| 11 | Manual de operación | PDF de 6–8 páginas | Con él, el equipo publica un artículo optimizado sin ayuda externa |

---

## 6. Resultados esperados

Metas verificables, no promesas. El SEM da resultados inmediatos; el SEO madura.

| Plazo | Resultado esperado |
|---|---|
| **Semana 3** (fin de Fase 1) | 100% de las páginas públicas indexables y rastreables. Lighthouse ≥ 90 en móvil. Todos los leads medidos desde el primer día. Enlaces compartidos con vista previa correcta. |
| **Semana 4–6** | Primeros leads pagados con costo por lead medido. Marca protegida en la subasta. Presencia en búsquedas locales vía Google Business Profile. |
| **Mes 2–3** | Contenido indexado y posicionando en cola larga. Apariciones en fragmentos destacados y AI Overviews. Primeras menciones en ChatGPT y Perplexity. |
| **Mes 4–6** (con continuidad) | Crecimiento sostenido del tráfico orgánico y reducción progresiva del costo por lead, al sustituir tráfico pagado por orgánico. |

**Beneficio de fondo:** Advance deja de depender solo de referidos y prospección en frío, y pasa a tener un activo propio —dominio con autoridad, contenido citable y una cuenta de Ads calibrada— que sigue generando demanda mes a mes.

---

## 7. Inversión — S/ 6,500 en total

### 7.1 Resumen por fase

| Fase | Alcance | Plazo | Inversión |
|---|---|---|---|
| **Fase 1 — Implementación** | Prerender/SSR, SEO técnico on-page, datos estructurados, `llms.txt`, analítica y medición, Core Web Vitals | 3 semanas | **S/ 2,900** |
| **Fase 2 — Estrategia** | Keyword research, contenido SEO + AEO (6 artículos), construcción y monitoreo GEO, Google Ads, dashboard y 2 reportes | 8 semanas | **S/ 3,600** |
| | | **TOTAL** | **S/ 6,500** |

### 7.2 Desglose dentro de cada fase

**Fase 1 — S/ 2,900**

| Componente | Inversión |
|---|---|
| Renderizado en servidor (prerender de 6 rutas) | S/ 1,000 |
| SEO técnico on-page (metadatos, robots, sitemap, corrección del 404) | S/ 600 |
| Datos estructurados JSON-LD + `llms.txt` | S/ 500 |
| Analítica y medición de conversiones (GA4, GTM, Search Console, Bing, Business Profile) | S/ 500 |
| Core Web Vitals, QA, informe y sesión de traspaso | S/ 300 |
| **Subtotal Fase 1** | **S/ 2,900** |

**Fase 2 — S/ 3,600**

| Componente | Inversión |
|---|---|
| Investigación, análisis de competencia y arquitectura de búsqueda | S/ 550 |
| Contenido SEO + AEO: 6 artículos, 2 landings y FAQs | S/ 1,300 |
| GEO: construcción de presencia y monitoreo de citaciones | S/ 550 |
| SEM: construcción y gestión de Google Ads durante 8 semanas | S/ 800 |
| Dashboard, 2 reportes mensuales y manual de operación | S/ 400 |
| **Subtotal Fase 2** | **S/ 3,600** |

### 7.3 Condiciones

- **Forma de pago:** 50% al inicio de cada fase, 50% contra entrega de los entregables verificados. Factura electrónica al inicio de cada fase.
- **Las fases son contratables por separado.** La Fase 2 solo tiene sentido con la Fase 1 ejecutada; la Fase 1 tiene valor propio aunque la Fase 2 no se contrate.
- **Incluye:** todo el trabajo técnico, de contenido y de configuración descrito. Herramientas usadas: GA4, Tag Manager, Search Console, Bing Webmaster, Looker Studio y Google Business Profile — todas sin costo de licencia.
- **No incluye:** inversión publicitaria en Google Ads (**S/ 800–1,500 mensuales sugeridos, pagados directo a Google**), producción de video o fotografía, ni artículos adicionales a los 6 acordados.
- **Continuidad opcional (se cotiza aparte):** desde el mes 4, mantenimiento de contenido, gestión de campañas y monitoreo GEO — referencia S/ 1,800–2,500 mensuales, más 15% de la inversión publicitaria.
- **Validez:** 30 días.

---

## 8. Cierre argumental

Dos ideas que deben cerrar la propuesta:

1. **El GEO está hoy donde estaba el SEO en 2005:** el costo de entrar es bajo y la ventaja del primero dura años. Ninguna financiera peruana mediana está optimizando todavía para motores generativos. Cuando lo hagan todas, aparecer costará varias veces más.
2. **Hoy Advance no mide un solo lead.** Cada semana sin medición es una semana de decisiones tomadas a ciegas.

---

## 9. Qué le pido a Claude

Elige **una** de estas líneas y pégala al final del brief:

- `Redacta la propuesta completa en un documento Word (.docx) con portada, tablas y pie de página, listo para enviar al cliente.`
- `Arma la propuesta como un artifact HTML: una página web privada que pueda compartir por enlace, con la identidad visual de Advance (azul #001D3A, rojo #B70016, beige #FCD095, tipografías Archivo e Inter).`
- `Convierte la propuesta en una presentación de 10 diapositivas para sustentarla en reunión.`
- `Redúcela a una versión de 2 páginas para enviar por correo como primer contacto.`
- `Genera solo el correo de presentación que acompaña la propuesta: máximo 150 palabras, con una sola llamada a la acción.`

### Datos que Claude debe pedirme antes de generar (si no se los di)

- Nombre y cargo del contacto en Advance Group
- Nombre, RUC y datos de facturación de quien emite la propuesta
- Fecha de inicio tentativa
- Si la propuesta se presenta con las dos fases juntas o solo la Fase 1
