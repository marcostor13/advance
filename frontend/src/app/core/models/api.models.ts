// ---- Auth ----
export type DocumentType = 'DNI' | 'CE' | 'RUC' | 'Pasaporte';
export type RiskProfile = 'conservador' | 'moderado' | 'agresivo';

export interface User {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  role: 'client' | 'admin';
  documentType?: DocumentType;
  documentNumber?: string;
  address?: string;
  district?: string;
  city?: string;
  country?: string;
  bank?: string;
  accountNumber?: string;
  cci?: string;
  riskProfile?: RiskProfile;
  birthDate?: string;
  occupation?: string;
  mustChangePassword?: boolean;
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

export interface CreateUserPayload {
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  password?: string;
  role?: 'client' | 'admin';
  documentType?: DocumentType;
  documentNumber?: string;
  address?: string;
  district?: string;
  city?: string;
  country?: string;
  bank?: string;
  accountNumber?: string;
  cci?: string;
  riskProfile?: RiskProfile;
  birthDate?: string;
  occupation?: string;
}

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'password'>>;

export interface CreatedUser extends User {
  tempPassword?: string;
}

// ---- Products (fondos y bonos) ----
export type ProductType = 'fondo' | 'bono';

export interface Product {
  _id: string;
  name: string;
  type: ProductType;
  annualRate: number;
  termMonths: number;
  description?: string;
  status: 'activo' | 'cerrado';
  createdAt: string;
}

export interface ProductPayload {
  name: string;
  type: ProductType;
  annualRate: number;
  termMonths: number;
  description?: string;
}

// ---- Movements (movimientos por producto) ----
export type MovementType = 'SUSCRIPCIÓN' | 'RENDIMIENTO' | 'VENCIMIENTO';

export interface Movement {
  _id: string;
  user: User | string;
  product: Product | string;
  type: MovementType;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface MovementPayload {
  user: string;
  product: string;
  type: MovementType;
  amount: number;
  date: string;
  notes?: string;
}

export interface Position {
  product: { _id: string; name: string; type: ProductType; annualRate: number; termMonths: number };
  capital: number;
  earned: number;
  firstSubscription: string | null;
  maturity: string | null;
  progress: number;
}

export interface PortalSummary {
  capitalInvertido: number;
  rendimientoAcumulado: number;
  rentabilidadAnual: number;
  inversionesActivas: number;
  allocations: { name: string; amount: number; pct: number }[];
}

// ---- Import ----
export interface ImportSummary {
  usersCreated: number;
  usersUpdated: number;
  productsCreated: number;
  productsUpdated: number;
  movementsCreated: number;
  tempPasswords: { email: string; documentNumber: string; tempPassword: string }[];
  errors: { sheet: string; row: number; message: string }[];
}

// ---- Password recovery ----
export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
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
export type Instrument = 'bono' | 'fondo';

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
  bono: 'Bono',
  fondo: 'Fondo',
};
