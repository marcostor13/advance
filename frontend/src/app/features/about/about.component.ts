import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { TextRevealDirective } from '../../core/directives/text-reveal.directive';
import { ParallaxDirective } from '../../core/directives/parallax.directive';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, ScrollAnimateDirective, TextRevealDirective, ParallaxDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly values = [
    { icon: '🎯', title: 'Foco en resultados', description: 'Cada proyecto está orientado a generar impacto real y medible en tu negocio.' },
    { icon: '🤝', title: 'Alianza estratégica', description: 'No somos proveedores, somos socios comprometidos con tu crecimiento.' },
    { icon: '🔬', title: 'Innovación constante', description: 'Adoptamos las mejores tecnologías y metodologías del mercado.' },
    { icon: '✅', title: 'Transparencia total', description: 'Comunicación clara, honesta y proactiva en cada etapa del proyecto.' },
  ];

  protected readonly team: TeamMember[] = [
    { name: 'Carlos Mendoza', role: 'CEO & Fundador', initials: 'CM' },
    { name: 'Ana Reyes', role: 'Directora de Tecnología', initials: 'AR' },
    { name: 'Luis Torres', role: 'Director de Estrategia', initials: 'LT' },
    { name: 'María Gómez', role: 'Lider de Proyectos', initials: 'MG' },
  ];
}
