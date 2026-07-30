import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { CountUpDirective } from '../../core/directives/count-up.directive';
import { TextRevealDirective } from '../../core/directives/text-reveal.directive';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { MagneticDirective } from '../../core/directives/magnetic.directive';
import { MarqueeComponent } from '../../shared/components/marquee/marquee.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SimulatorComponent } from './simulator/simulator.component';

interface CapitalProduct {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly tagline: string;
  readonly description: string;
  readonly highlights: readonly string[];
}

interface CapitalStat {
  readonly value: string;
  readonly label: string;
  readonly desc: string;
  readonly count?: number;
  readonly suffix?: string;
}

interface CapitalBenefit {
  readonly icon: string;
  readonly title: string;
  readonly desc: string;
}

interface CapitalStep {
  readonly number: string;
  readonly title: string;
  readonly desc: string;
}

@Component({
  selector: 'app-capital',
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
    SimulatorComponent,
  ],
  templateUrl: './capital.component.html',
  styleUrl: './capital.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapitalComponent {
  goToSimulador(event: Event): void {
    event.preventDefault();
    document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  readonly marqueeItems: string[] = [
    'Factoring de Inversión',
    'Bono Privado',
    'Capital Estructurado',
    '+20 años de experiencia',
    'Respaldo Advance Factoring',
  ];

  readonly products: readonly CapitalProduct[] = [
    {
      id: 'factoring',
      title: 'Factoring de Inversión',
      icon: 'trending-up',
      tagline:
        'Acceda a oportunidades de inversión respaldadas por facturas de empresas de primer nivel, combinando liquidez, diversificación y una gestión especializada.',
      description:
        'Acceda a oportunidades de inversión respaldadas por facturas de empresas de primer nivel, combinando liquidez, diversificación y una gestión especializada.',
      highlights: [
        'Respaldo en activos reales',
        'Plazos de corto y mediano plazo',
        'Riesgo controlado',
        'Administración profesional',
      ],
    },
    {
      id: 'bono-privado',
      title: 'Bono Privado',
      icon: 'file-text',
      tagline:
        'Participe en emisiones de deuda privada estructuradas para ofrecer estabilidad, flujos periódicos y rendimientos competitivos.',
      description:
        'Participe en emisiones de deuda privada estructuradas para ofrecer estabilidad, flujos periódicos y rendimientos competitivos.',
      highlights: [
        'Instrumentos de renta fija',
        'Pagos programados',
        'Respaldo fiduciario',
        'Estructuración especializada',
      ],
    },
    {
      id: 'capital-estructurado',
      title: 'Capital Estructurado',
      icon: 'layers',
      tagline:
        'Financiamiento diseñado para proyectos empresariales que requieren soluciones a medida y estructuras financieras eficientes.',
      description:
        'Financiamiento diseñado para proyectos empresariales que requieren soluciones a medida y estructuras financieras eficientes.',
      highlights: [
        'Estructuras personalizadas',
        'Financiamiento estratégico',
        'Proyectos de crecimiento',
        'Equipo experto',
      ],
    },
  ];

  readonly stats: readonly CapitalStat[] = [
    { value: '20+', label: 'Años de experiencia', desc: 'Trayectoria en el mercado financiero peruano', count: 20, suffix: '+' },
    { value: '3', label: 'Productos', desc: 'Factoring, Bono Privado y Capital Estructurado', count: 3, suffix: '' },
    { value: '100%', label: 'Respaldo', desc: 'Brazo financiero de Advance Factoring', count: 100, suffix: '%' },
    { value: 'SBS', label: 'Regulado', desc: 'Grupo inscrito bajo regulación SBS' },
  ];

  readonly benefits: readonly CapitalBenefit[] = [
    {
      icon: 'award',
      title: 'Experiencia comprobada',
      desc: '+20 años en el sector financiero peruano con casos de éxito documentados.',
    },
    {
      icon: 'bar-chart',
      title: 'Retornos competitivos',
      desc: 'Estructuramos inversiones con rentabilidades atractivas ajustadas al perfil de riesgo del inversionista.',
    },
    {
      icon: 'shield',
      title: 'Respaldo sólido',
      desc: 'Somos parte de Advance Group, con respaldo regulatorio SBS y CAVALI en nuestras operaciones de factoring.',
    },
    {
      icon: 'users',
      title: 'Asesoría personalizada',
      desc: 'Nuestro equipo de expertos diseña soluciones a la medida de cada inversionista o empresa.',
    },
    {
      icon: 'clock',
      title: 'Agilidad operativa',
      desc: 'Procesos eficientes que permiten estructurar operaciones en tiempos reducidos.',
    },
    {
      icon: 'globe',
      title: 'Visión global',
      desc: 'Conocimiento profundo del mercado peruano con visión de estándares internacionales.',
    },
  ];

  // Sticky deck: 3 cards holding two benefits each
  readonly benefitPairs: ReadonlyArray<readonly CapitalBenefit[]> = [0, 1, 2].map((i) =>
    this.benefits.slice(i * 2, i * 2 + 2)
  );

  readonly steps: readonly CapitalStep[] = [
    {
      number: '01',
      title: 'Consulta inicial',
      desc: 'Agende una reunión con nuestro equipo para presentar sus objetivos financieros.',
    },
    {
      number: '02',
      title: 'Análisis',
      desc: 'Evaluamos su perfil de inversión y le presentamos las opciones más adecuadas.',
    },
    {
      number: '03',
      title: 'Estructuración',
      desc: 'Diseñamos la solución financiera personalizada según sus necesidades y plazos.',
    },
    {
      number: '04',
      title: 'Operación',
      desc: 'Ejecutamos la operación con total transparencia y seguimiento continuo.',
    },
  ];
}
