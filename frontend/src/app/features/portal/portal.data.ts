// Mock data for the client portal (maqueta). Display-ready strings.

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const PORTAL_USER = {
  name: 'Marco Torres',
  role: 'Inversionista',
  initials: 'MT',
} as const;

export const PORTAL_NAV: NavItem[] = [
  { path: '/portal', label: 'Resumen', icon: 'bar-chart' },
  { path: '/portal/inversiones', label: 'Mis Inversiones', icon: 'trending-up' },
  { path: '/portal/historial', label: 'Historial', icon: 'refresh-cw' },
  { path: '/portal/reportes', label: 'Reportes', icon: 'file-text' },
  { path: '/portal/noticias', label: 'Noticias', icon: 'globe' },
];

// ── Historial ──────────────────────────────────────────────
export interface Movement {
  type: 'RENDIMIENTO' | 'SUSCRIPCIÓN' | 'VENCIMIENTO';
  positive: boolean;
  icon: string;
  amount: string;
  title: string;
  meta: string;
}

export const MOVEMENTS: Movement[] = [
  { type: 'RENDIMIENTO', positive: true, icon: 'trending-up', amount: '1,400.00', title: 'Rendimiento devengado mes 8', meta: 'Pagaré Estructurado Serie A-24 · 15 de junio, 2026' },
  { type: 'RENDIMIENTO', positive: true, icon: 'trending-up', amount: '650.00', title: 'Rendimiento devengado mes 5', meta: 'Fondo Factoring Corporativo · 15 de junio, 2026' },
  { type: 'RENDIMIENTO', positive: true, icon: 'trending-up', amount: '400.00', title: 'Rendimiento devengado mes 1', meta: 'Leasing Financiero Flota 2025 · 15 de mayo, 2026' },
  { type: 'SUSCRIPCIÓN', positive: false, icon: 'file-text', amount: '48,000.00', title: 'Suscripción inicial de capital', meta: 'Leasing Financiero Flota 2025 · 15 de abril, 2026' },
  { type: 'VENCIMIENTO', positive: true, icon: 'check-circle', amount: '45,400.00', title: 'Vencimiento y liquidación de capital + rendimientos', meta: 'Pagaré Estructurado Serie B-23 · 15 de abril, 2026' },
  { type: 'SUSCRIPCIÓN', positive: false, icon: 'file-text', amount: '65,000.00', title: 'Suscripción inicial de capital', meta: 'Fondo Factoring Corporativo · 15 de febrero, 2026' },
  { type: 'SUSCRIPCIÓN', positive: false, icon: 'file-text', amount: '120,000.00', title: 'Suscripción inicial de capital', meta: 'Pagaré Estructurado Serie A-24 · 15 de noviembre, 2025' },
  { type: 'SUSCRIPCIÓN', positive: false, icon: 'file-text', amount: '40,000.00', title: 'Suscripción inicial de capital', meta: 'Pagaré Estructurado Serie B-23 · 15 de abril, 2025' },
];

// ── Resumen ────────────────────────────────────────────────
export interface Stat {
  label: string;
  value: string;
  icon: string;
  accent?: boolean;
}

export const RESUMEN_STATS: Stat[] = [
  { label: 'Capital invertido', value: 'S/ 233,000.00', icon: 'briefcase' },
  { label: 'Rendimiento acumulado', value: 'S/ 2,450.00', icon: 'trending-up', accent: true },
  { label: 'Rentabilidad anual', value: '12.4%', icon: 'percent' },
  { label: 'Inversiones activas', value: '3', icon: 'layers' },
];

export interface Allocation {
  name: string;
  amount: string;
  pct: number;
}

export const ALLOCATIONS: Allocation[] = [
  { name: 'Pagaré Estructurado Serie A-24', amount: 'S/ 120,000.00', pct: 52 },
  { name: 'Fondo Factoring Corporativo', amount: 'S/ 65,000.00', pct: 28 },
  { name: 'Leasing Financiero Flota 2025', amount: 'S/ 48,000.00', pct: 20 },
];

// ── Mis Inversiones ────────────────────────────────────────
export interface Investment {
  name: string;
  status: string;
  capital: string;
  rate: string;
  term: string;
  earned: string;
  maturity: string;
  progress: number;
}

export const INVESTMENTS: Investment[] = [
  { name: 'Pagaré Estructurado Serie A-24', status: 'Activo', capital: 'S/ 120,000.00', rate: '12.5% anual', term: '18 meses', earned: 'S/ 1,400.00', maturity: '15 de noviembre, 2026', progress: 45 },
  { name: 'Fondo Factoring Corporativo', status: 'Activo', capital: 'S/ 65,000.00', rate: '11.0% anual', term: '12 meses', earned: 'S/ 650.00', maturity: '15 de febrero, 2027', progress: 40 },
  { name: 'Leasing Financiero Flota 2025', status: 'Activo', capital: 'S/ 48,000.00', rate: '10.5% anual', term: '24 meses', earned: 'S/ 400.00', maturity: '15 de abril, 2028', progress: 8 },
];

// ── Reportes ───────────────────────────────────────────────
export interface Report {
  name: string;
  meta: string;
  size: string;
}

export const REPORTS: Report[] = [
  { name: 'Estado de cuenta — Junio 2026', meta: 'Mensual', size: 'PDF · 240 KB' },
  { name: 'Reporte de rendimientos — Q2 2026', meta: 'Trimestral', size: 'PDF · 320 KB' },
  { name: 'Constancia de suscripción — Serie A-24', meta: 'Documento', size: 'PDF · 96 KB' },
  { name: 'Estado de cuenta — Mayo 2026', meta: 'Mensual', size: 'PDF · 236 KB' },
  { name: 'Certificado de retención 2025', meta: 'Anual', size: 'PDF · 180 KB' },
  { name: 'Resumen tributario 2025', meta: 'Anual', size: 'PDF · 210 KB' },
];

// ── Noticias ───────────────────────────────────────────────
export interface News {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: string;
  highlight?: string;
  body: string;
}

export const NEWS_CATEGORIES = ['Todas', 'Producto', 'Finanzas', 'Educación', 'Mercado'] as const;

export const NEWS: News[] = [
  {
    id: 1,
    category: 'Finanzas',
    title: 'Advance Capital cierra el semestre con un rendimiento promedio de 12.4%',
    excerpt: 'Los instrumentos estructurados superaron el promedio del mercado local, consolidando la confianza de nuestros inversionistas durante el primer semestre del año.',
    date: '11 de julio, 2026',
    image: '/img/advisory-dark.webp',
    author: 'Advance Capital',
    body: 'El desempeño del portafolio de instrumentos estructurados de Advance Capital se ubicó por encima del promedio del mercado, impulsado por una gestión de riesgo disciplinada y una cartera diversificada en factoring, leasing y pagarés estructurados. La firma reafirma su compromiso con la transparencia y los retornos competitivos para sus inversionistas.',
  },
  {
    id: 2,
    category: 'Producto',
    title: 'Nuevo instrumento: Pagaré Estructurado Serie C con tasa preferencial',
    excerpt: 'Disponible para inversionistas calificados a partir de S/ 50,000, con plazos de 12 a 36 meses.',
    date: '9 de julio, 2026',
    image: '/img/team-tablet.webp',
    author: 'Advance Capital',
    highlight: 'Disponible para inversionistas calificados a partir de S/ 50,000, con plazos de 12 a 36 meses.',
    body: 'La Serie C incorpora una tasa preferencial y condiciones flexibles de plazo, pensada para inversionistas que buscan diversificar su portafolio con instrumentos de renta estructurada y respaldo sólido. La suscripción ya se encuentra habilitada desde tu panel de inversionista.',
  },
  {
    id: 3,
    category: 'Mercado',
    title: 'Perspectivas del mercado de factoring para el segundo semestre 2026',
    excerpt: 'Análisis de nuestro comité de inversiones sobre tasas, riesgo de cartera y oportunidades del sector.',
    date: '4 de julio, 2026',
    image: '/img/meeting-room.webp',
    author: 'Comité de Inversiones',
    body: 'Nuestro comité de inversiones proyecta un entorno favorable para el factoring corporativo, con demanda sostenida de liquidez empresarial y spreads atractivos ajustados al riesgo. El informe detalla los sectores con mayor potencial y las señales de alerta a monitorear.',
  },
  {
    id: 4,
    category: 'Educación',
    title: 'Guía: cómo diversificar tu portafolio con instrumentos estructurados',
    excerpt: 'Principios prácticos para equilibrar rendimiento y riesgo según tu perfil de inversionista.',
    date: '28 de junio, 2026',
    image: '/img/executive-laptop.webp',
    author: 'Advance Capital',
    body: 'Diversificar no se trata solo de repartir capital, sino de combinar instrumentos con distintos plazos, tasas y perfiles de riesgo. En esta guía repasamos los criterios que aplican nuestros asesores para construir portafolios resilientes.',
  },
  {
    id: 5,
    category: 'Finanzas',
    title: 'Resultados del Fondo Factoring Corporativo en el primer semestre',
    excerpt: 'El fondo mantuvo una morosidad por debajo del 1% y distribuyó rendimientos mensuales puntuales.',
    date: '20 de junio, 2026',
    image: '/img/office-modern.webp',
    author: 'Advance Capital',
    body: 'El Fondo Factoring Corporativo cerró el semestre con indicadores de calidad de cartera sólidos y una distribución puntual de rendimientos mensuales, reflejo de una originación selectiva y un seguimiento cercano de cada operación.',
  },
  {
    id: 6,
    category: 'Mercado',
    title: 'Advance Group amplía su presencia con nueva oficina en Arequipa',
    excerpt: 'Reforzamos el acompañamiento cercano a inversionistas y empresas del sur del país.',
    date: '12 de junio, 2026',
    image: '/img/building-lobby.webp',
    author: 'Advance Group',
    body: 'Con la apertura de nuestra oficina en Arequipa, Advance Group acerca sus soluciones de factoring, leasing y capital estructurado a más empresas e inversionistas de la región sur, con la misma cercanía y respaldo que nos caracteriza.',
  },
];
