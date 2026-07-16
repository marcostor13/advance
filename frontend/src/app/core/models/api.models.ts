// ---- Auth ----
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role: 'client' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ---- Quotes (factoring) ----
export type LeadStatus = 'nueva' | 'contactado' | 'en_proceso' | 'cerrada' | 'descartada';

export interface QuoteRequest {
  currency: 'PEN' | 'USD';
  amount: number;
  termDays: 30 | 45 | 60 | 90 | 120;
}

export interface Quote {
  _id: string;
  user: User | string;
  currency: 'PEN' | 'USD';
  amount: number;
  termDays: number;
  advancePct: number;
  monthlyRate: number;
  advanceAmount: number;
  discount: number;
  commission: number;
  netDisbursement: number;
  retention: number;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

// ---- Simulations (capital) ----
export type Instrument = 'factoring' | 'leasing' | 'capital_estructurado';

export interface SimulationRequest {
  instrument: Instrument;
  currency: 'PEN' | 'USD';
  amount: number;
  termMonths: 3 | 6 | 12 | 18 | 24 | 36;
  compound: boolean;
}

export interface ScheduleEntry {
  month: number;
  interest: number;
  balance: number;
}

export interface Simulation {
  _id: string;
  user: User | string;
  instrument: Instrument;
  currency: 'PEN' | 'USD';
  amount: number;
  termMonths: number;
  annualRate: number;
  compound: boolean;
  interestEarned: number;
  finalAmount: number;
  schedule: ScheduleEntry[];
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

// ---- Admin ----
export interface AdminStats {
  totalQuotes: number;
  totalSimulations: number;
  totalLeads: number;
  newQuotes: number;
  newSimulations: number;
}

export interface Lead extends User {
  quotesCount: number;
  simulationsCount: number;
}

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'nueva', label: 'Nueva' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'cerrada', label: 'Cerrada' },
  { value: 'descartada', label: 'Descartada' },
];

export const INSTRUMENT_LABELS: Record<Instrument, string> = {
  factoring: 'Factoring de Inversión',
  leasing: 'Leasing Financiero',
  capital_estructurado: 'Capital Estructurado',
};

// ---- Portal: Investments ----
export type InvestmentStatus = 'active' | 'matured' | 'pending' | 'cancelled';
export type MovementType = 'deposit' | 'interest' | 'payout' | 'maturity';

export interface Movement {
  date: string;
  type: MovementType;
  amount: number;
  description: string;
}

export interface Investment {
  _id: string;
  product: string;
  instrument: Instrument;
  currency: 'PEN' | 'USD';
  principal: number;
  annualRate: number;
  termMonths: number;
  startDate: string;
  maturityDate: string;
  currentValue: number;
  interestAccrued: number;
  status: InvestmentStatus;
  movements: Movement[];
  createdAt: string;
}

export interface PortfolioSummary {
  currency: string;
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  returnPct: number;
  activeCount: number;
  maturedCount: number;
  weightedRate: number;
  byInstrument: { instrument: Instrument; value: number }[];
}

export const INVESTMENT_STATUS_LABELS: Record<InvestmentStatus, string> = {
  active: 'Activa',
  matured: 'Vencida',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
};

export const MOVEMENT_LABELS: Record<MovementType, string> = {
  deposit: 'Suscripción',
  interest: 'Rendimiento',
  payout: 'Pago',
  maturity: 'Vencimiento',
};

// ---- Portal: Reports ----
export type ReportType = 'monthly' | 'quarterly' | 'annual' | 'statement';

export interface Report {
  _id: string;
  title: string;
  type: ReportType;
  period: string;
  summary?: string;
  fileUrl: string;
  sizeKb: number;
  publishedAt: string;
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  annual: 'Anual',
  statement: 'Constancia',
};

// ---- Portal: News ----
export type NewsCategory = 'mercado' | 'empresa' | 'producto' | 'educacion';

export interface NewsArticle {
  _id: string;
  title: string;
  excerpt: string;
  body: string;
  category: NewsCategory;
  image: string;
  author?: string;
  featured: boolean;
  publishedAt: string;
}

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  mercado: 'Mercado',
  empresa: 'Empresa',
  producto: 'Producto',
  educacion: 'Educación',
};
