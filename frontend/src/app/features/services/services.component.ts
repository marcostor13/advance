import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { TextRevealDirective } from '../../core/directives/text-reveal.directive';
import { MagneticDirective } from '../../core/directives/magnetic.directive';

interface ServiceDetail {
  icon: string;
  title: string;
  description: string;
  bullets: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, ScrollAnimateDirective, TextRevealDirective, MagneticDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  protected readonly services: ServiceDetail[] = [
    {
      icon: '🚀',
      title: 'Transformación Digital',
      description:
        'Guiamos a tu empresa en la adopción de tecnología para optimizar procesos, reducir costos y mejorar la experiencia del cliente.',
      bullets: [
        'Diagnóstico y hoja de ruta digital',
        'Automatización de procesos',
        'Integración de sistemas',
        'Capacitación de equipos',
      ],
    },
    {
      icon: '💡',
      title: 'Consultoría Estratégica',
      description:
        'Analizamos tu modelo de negocio y diseñamos estrategias basadas en datos para maximizar tu crecimiento.',
      bullets: [
        'Análisis de mercado y competencia',
        'Diseño de modelos de negocio',
        'Planificación estratégica',
        'Medición de KPIs',
      ],
    },
    {
      icon: '⚙️',
      title: 'Desarrollo de Software',
      description:
        'Construimos aplicaciones web y móviles a medida con las mejores tecnologías del mercado.',
      bullets: [
        'Aplicaciones web (Angular, React)',
        'APIs y microservicios (NestJS, Node.js)',
        'Bases de datos y cloud',
        'Mantenimiento y soporte',
      ],
    },
    {
      icon: '📊',
      title: 'Analítica e Inteligencia de Datos',
      description:
        'Transformamos tus datos en ventajas competitivas con herramientas de BI, machine learning e IA.',
      bullets: [
        'Dashboards e informes ejecutivos',
        'Modelos predictivos',
        'Integración de fuentes de datos',
        'Consultoría en AI/ML',
      ],
    },
    {
      icon: '🔒',
      title: 'Ciberseguridad',
      description:
        'Protegemos los activos digitales de tu empresa con soluciones de seguridad proactivas.',
      bullets: [
        'Auditorías de seguridad',
        'Gestión de vulnerabilidades',
        'Cumplimiento normativo',
        'Respuesta a incidentes',
      ],
    },
    {
      icon: '☁️',
      title: 'Cloud & DevOps',
      description:
        'Migramos y optimizamos tu infraestructura en la nube para mayor escalabilidad y disponibilidad.',
      bullets: [
        'Migración a cloud (AWS, GCP, Azure)',
        'CI/CD y automatización',
        'Contenedores y orquestación',
        'Monitoreo y observabilidad',
      ],
    },
  ];
}
