import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { CountUpDirective } from '../../core/directives/count-up.directive';
import { TextRevealDirective } from '../../core/directives/text-reveal.directive';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { MagneticDirective } from '../../core/directives/magnetic.directive';
import { MarqueeComponent } from '../../shared/components/marquee/marquee.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { QuoterComponent } from './quoter/quoter.component';

@Component({
  selector: 'app-factoring',
  standalone: true,
  imports: [
    RouterLink,
    ScrollAnimateDirective,
    CountUpDirective,
    TextRevealDirective,
    ParallaxDirective,
    MagneticDirective,
    MarqueeComponent,
    IconComponent,
    QuoterComponent,
  ],
  templateUrl: './factoring.component.html',
  styleUrl: './factoring.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactoringComponent {
  goToCotizador(event: Event): void {
    event.preventDefault();
    document.getElementById('cotizador')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  readonly heroFacts = [
    'Operaciones reguladas por la SBS',
    'Participante Indirecto CAVALI',
    '+20 años en el mercado financiero',
  ];

  readonly marqueeItems = [
    'Factoring',
    'Confirming',
    'SBS N° 00029814',
    'CAVALI · Matriz 937',
    '+20 años de experiencia',
  ];

  readonly services = [
    {
      id: 'factoring',
      title: 'Factoring',
      tagline: 'Convierte tus facturas en efectivo de manera inmediata',
      icon: 'file-text',
      benefits: [
        'Recupera tu capital de trabajo rápidamente',
        'Mejora tus indicadores financieros sin aumentar deuda',
        'Terceriza la gestión de cobranza',
      ],
    },
    {
      id: 'confirming',
      title: 'Confirming',
      tagline: 'Optimiza tus pagos y extiende plazos para mejorar la gestión financiera',
      icon: 'check-circle',
      benefits: [
        'Simplificación y ahorro en procesos de pago',
        'Beneficios para proveedores',
        'Acceso a crédito con condiciones favorables',
      ],
    },
  ];

  readonly differentiators = [
    { icon: 'target', title: 'Expertos especializados', desc: 'Soluciones financieras adaptadas a las necesidades específicas de tu empresa.' },
    { icon: 'clock', title: 'Procesos ágiles', desc: 'Procesos rápidos, seguros y confiables para que tu negocio no espere.' },
    { icon: 'award', title: 'Respaldo regulatorio', desc: 'Registro en SBS y CAVALI para tu absoluta tranquilidad.' },
    { icon: 'refresh-cw', title: 'Gestión integral', desc: 'Validamos facturas, gestionamos cobros y aseguramos operaciones eficientes.' },
  ];

  readonly team = [
    {
      name: 'Jorge Rosado',
      role: 'Co-Founder',
      initials: 'JR',
      degree: 'MBA · Esan Graduate School of Business',
      specialties: ['Factoring', 'Leasing', 'Finanzas', 'Gestión de Carteras'],
      experience: '20+ años',
      bio: 'Economista con más de 20 años de experiencia en desarrollo de productos financieros. VP Comercial de W Factoring; Gerente Comercial de Coval Servicios Financieros.',
    },
    {
      name: 'Dante Jara',
      role: 'Co-Founder',
      initials: 'DJ',
      degree: 'MBA · Esan / Máster Economía · U. de Chile',
      specialties: ['Finanzas Corporativas', 'Leasing', 'Banca', 'SAB'],
      experience: '20+ años',
      bio: 'Economista con más de 20 años en bancos, sociedades agentes de bolsa y empresas de factoring. Gerente Comercial de Capital Express; Subgerente COFIDE.',
    },
    {
      name: 'Saúl Martel',
      role: 'VP Comercial',
      initials: 'SM',
      degree: 'MBA · CENTRUM Católica / EADA Business School',
      specialties: ['Factoring', 'Consultoría', 'Estrategia', 'Riesgo Crediticio'],
      experience: '14+ años',
      bio: 'Administrador de Empresas con más de 14 años en productos financieros. Subgerente Comercial en Andino Factoring; Funcionario en Interbank y BCP.',
    },
  ];

  readonly sectors = [
    { name: 'Minería', icon: 'mountain' },
    { name: 'Agroindustria', icon: 'leaf' },
    { name: 'Pesca', icon: 'anchor' },
    { name: 'Infraestructura', icon: 'building' },
    { name: 'Energía e Hidrocarburos', icon: 'zap' },
    { name: 'Tecnología y Telecomunicaciones', icon: 'radio' },
  ];

  readonly offices = [
    { city: 'Lima', address: 'Av. El Polo 695, Piso 8', district: 'Santiago de Surco', isMain: true },
    { city: 'Trujillo', address: 'Urb. Las Flores del Golf 252, Ofic. 204', district: 'Víctor Larco', isMain: false },
    { city: 'Arequipa', address: 'City Center Torre Norte, Ofic. 1709', district: 'Cerro Colorado', isMain: false },
  ];

  readonly serviceMiniFeatures: Record<string, string[]> = {
    factoring: ['Liquidez inmediata', 'Sin deuda adicional', 'Cobranza incluida'],
    confirming: ['Pagos optimizados', 'Plazos extendidos', 'Red de proveedores'],
  };

  readonly counters = [
    { value: 20, suffix: '+', label: 'Años de experiencia' },
    { value: 2, suffix: '', label: 'Servicios especializados' },
    { value: 6, suffix: '', label: 'Sectores atendidos' },
    { value: 3, suffix: '', label: 'Oficinas en Perú' },
  ];
}
