import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { CountUpDirective } from '../../core/directives/count-up.directive';
import { TextRevealDirective } from '../../core/directives/text-reveal.directive';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { MagneticDirective } from '../../core/directives/magnetic.directive';
import { MarqueeComponent } from '../../shared/components/marquee/marquee.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface Counter {
  value: number;
  suffix: string;
  label: string;
  desc: string;
}

interface Company {
  id: string;
  label: string;
  logo: string;
  logoWhite: string;
  title: string;
  tagline: string;
  features: string[];
  link: string;
}

interface Pillar {
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-home',
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly counters: Counter[] = [
    { value: 20, suffix: '+', label: 'Años de experiencia', desc: 'Trayectoria consolidada en el mercado financiero peruano.' },
    { value: 2, suffix: '', label: 'Empresas especializadas', desc: 'Advance Factoring y Advance\u00A0Capital' },
    { value: 3, suffix: '', label: 'Oficinas en el Perú', desc: 'Lima, Trujillo, Arequipa' },
    { value: 6, suffix: '', label: 'Sectores atendidos', desc: 'De la minería a la tecnología.' },
  ];

  readonly companies: Company[] = [
    {
      id: 'factoring',
      label: 'Liquidez',
      logo: '/logo-factoring.png',
      logoWhite: '/logo-factoring-white.png',
      title: 'Advance Factoring',
      tagline: 'Convierta sus facturas en efectivo de manera inmediata con soluciones de factoring y confirming, respaldadas por nuestra inscripción en la SBS y CAVALI.',
      features: ['Factoring', 'Confirming', 'Regulados por SBS y CAVALI'],
      link: '/factoring',
    },
    {
      id: 'capital',
      label: 'Inversiones',
      logo: '/logo-capital.png',
      logoWhite: '/logo-capital-white.png',
      title: 'Advance Capital',
      tagline: 'Inversiones en factoring, leasing y capital estructurado. El brazo financiero de Advance Factoring que potencia el rendimiento de su patrimonio.',
      features: ['Factoring', 'Leasing', 'Capital Estructurado'],
      link: '/capital',
    },
  ];

  readonly pillars: Pillar[] = [
    { icon: 'shield', title: 'Confianza', desc: '20 años de trayectoria respaldando empresas peruanas con operaciones transparentes y resultados comprobados.' },
    { icon: 'lock', title: 'Seguridad', desc: 'Registrados en SBS y CAVALI. Garantizamos que cada operación cumple con los más altos estándares regulatorios del Perú.' },
    { icon: 'eye', title: 'Transparencia', desc: 'Procesos claros, tarifas justas y comunicación directa en todo momento. Nunca hay sorpresas en nuestras operaciones.' },
  ];

  readonly sectors: string[] = [
    'Minería', 'Agroindustria', 'Pesca', 'Infraestructura', 'Energía e Hidrocarburos', 'Tecnología y Telecomunicaciones',
  ];

  readonly facts: string[] = ['SBS N° 00029814 — Regulados', 'CAVALI · Código Matriz 937'];
}
