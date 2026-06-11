import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';

/** Subtle magnetic pull toward the cursor on fine-pointer devices. */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements OnInit, OnDestroy {
  @Input() magneticStrength = 0.22;
  @Input() magneticMax = 10;

  private cleanup: Array<() => void> = [];

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngOnInit(): void {
    if (
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const host = this.el.nativeElement;
    this.zone.runOutsideAngular(() => {
      const onMove = (e: MouseEvent): void => {
        const rect = host.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * this.magneticStrength;
        const dy = (e.clientY - rect.top - rect.height / 2) * this.magneticStrength;
        const clamp = (v: number): number => Math.max(-this.magneticMax, Math.min(this.magneticMax, v));
        host.style.transition = 'transform 0.15s ease-out';
        host.style.transform = `translate(${clamp(dx).toFixed(1)}px, ${clamp(dy).toFixed(1)}px)`;
      };
      const onLeave = (): void => {
        host.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        host.style.transform = 'translate(0, 0)';
      };
      host.addEventListener('mousemove', onMove, { passive: true });
      host.addEventListener('mouseleave', onLeave, { passive: true });
      this.cleanup.push(
        () => host.removeEventListener('mousemove', onMove),
        () => host.removeEventListener('mouseleave', onLeave)
      );
    });
  }

  ngOnDestroy(): void {
    this.cleanup.forEach((fn) => fn());
  }
}
