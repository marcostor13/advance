# Plan de implementación — Tickets MayaHelp TCK-8005 … TCK-8016

Fuente: `docs/tickets-mayahelp (4).md` (7 tickets, Advance Group, cliente Sandra).
Rama base: `main` (limpia). Adjuntos revisados: 5 capturas.

---

## Resumen del análisis

| Ticket | Tema | Estado real en el código | Acción |
|---|---|---|---|
| TCK-8005 | Ambos campos en rojo al pasar el cursor | **Ya implementado** — commit `9fb1333`, `.btn--outline:hover` se llena de rojo | Cerrar; queda absorbido por 8013 |
| TCK-8013 | No deben verse los dos cuadros rojos a la vez | **Regresión causada por 8005** | Implementar (Fase 1) |
| TCK-8016 | Igual, el recuadro cambia a rojo según el cursor (Factoring/Capital) | Mismo patrón, falta en 2 heroes | Implementar (Fase 1) |
| TCK-8014 | "Iniciar sesión clientes", sólo en Advance Capital | Hoy dice "Iniciar sesión" y sale en todas las rutas | Implementar (Fase 2) |
| TCK-8015 | Ocultar logos de las otras unidades | Hoy la navbar muestra Group + Factoring + Capital siempre | Implementar (Fase 2) |
| TCK-8006 | Cambiar dirección de oficina | **Ya correcta** en 4 sitios | Verificar y cerrar |
| TCK-8007 | Libro de reclamaciones virtual | **Ya implementado** (front + back + link en footer) | Verificar y cerrar |

**Hallazgo clave:** TCK-8005 ya se resolvió y *provocó* TCK-8013. La clienta pidió "que ambos campos se pongan en rojo cuando el cursor está encima"; se interpretó como "los dos rojos a la vez" cuando quería decir "cualquiera de los dos se pone rojo, según dónde apunte". TCK-8013 y TCK-8016 lo aclaran: **exactamente uno rojo a la vez, y el rojo sigue al cursor.**

---

## Fase 1 — Par de CTAs: el rojo sigue al cursor (TCK-8005 / 8013 / 8016)

### Comportamiento objetivo (idéntico en los 3 heroes)

```
Reposo:      [ CTA primario ]  [ CTA secundario ]
                   ROJO             transparente

Hover 1ro:   [ CTA primario ]  [ CTA secundario ]
                 ROJO oscuro        transparente

Hover 2do:   [ CTA primario ]  [ CTA secundario ]
                transparente          ROJO
```

### Implementación

**1. Helper global reutilizable en `frontend/src/styles.scss`** (junto al bloque `.btn`):

```scss
// Par de CTAs: sólo uno puede estar en rojo a la vez — el relleno sigue al cursor
.cta-pair {
  &:has(> :nth-child(2):hover) > :first-child {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.35);
    color: var(--white);
  }
}
```

`:has()` está soportado en Chrome 105+, Safari 15.4+ y Firefox 121+. No requiere JS ni señales.

**2. Aplicar la clase `cta-pair` a los 3 contenedores:**

| Archivo | Línea aprox. | Contenedor |
|---|---|---|
| `features/home/home.component.html` | 20 | `.hero__actions` |
| `features/factoring/factoring.component.html` | 28 | `.af-hero__actions` |
| `features/capital/capital.component.html` | 26 | `.ac-hero__actions` |

**3. Normalizar el segundo CTA de Factoring y Capital** (decisión confirmada):

`Escríbanos por WhatsApp` deja de ser `link-arrow link-arrow--light` y pasa a `btn btn--outline btn--lg`, conservando el `<app-icon name="arrow-right">` como `class="btn__arrow"`. Así los 3 heroes son estructuralmente iguales.

**4. Unificar el primario de Capital** (decisión confirmada):

`features/capital/capital.component.html:27` — `btn--warm` → `btn--primary`. El hero de Capital pasa de beige a rojo, igual que Home y Factoring.

**5. Revisar los `__actions` inferiores** (`home:158`, `factoring:314`, `capital:240`). Hoy son `btn--white` + `btn--outline` sobre fondo oscuro. El `:hover` del outline los deja a ambos "llenos" (blanco + rojo). No están en ningún ticket, pero son el mismo defecto visual. **Propuesta:** aplicar `cta-pair` también ahí para coherencia — confirmar con la clienta antes, o dejarlo fuera del alcance.

### Verificación
- `/`, `/factoring`, `/capital`: en reposo sólo el primer botón rojo.
- Hover sobre el segundo: se llena de rojo y el primero queda transparente con borde.
- Al salir del par, vuelve al estado de reposo (sin parpadeo).
- Móvil (<768px): sin `:hover`, el estado de reposo debe verse correcto.

---

## Fase 2 — Navbar contextual (TCK-8014 / 8015)

Ambos tocan el mismo componente; van juntos en un solo cambio.

### TCK-8014 — "Iniciar sesión clientes", sólo en Advance Capital

`shared/components/navbar/navbar.component.ts`:

```ts
private readonly capitalRoutes = ['/capital'];

protected readonly isCapital = computed(
  () => this.currentUrl().startsWith('/capital'),
);
```

`navbar.component.html` — envolver ambos accesos (desktop línea 57 y móvil línea 46) en `@if (isCapital()) { … }` y cambiar el texto a `Iniciar sesión clientes`.

**Supuesto declarado:** "sólo cuando entras a Advance Capital" = ruta `/capital` y sus subrutas (`/capital/simulador`). Las rutas `/portal/*` ya son el área logueada y no llevan navbar pública; no se tocan.

### TCK-8015 — Aislamiento de marcas

Decisión confirmada: **ocultar el logo por completo** en las rutas de unidad.

| Ruta | Marca sup. izq. | Logo Factoring en menú | Logo Capital en menú |
|---|---|---|---|
| `/` y demás | Advance Group | sí | sí |
| `/factoring` | **oculto** | oculto | **oculto** |
| `/capital` | **oculto** | **oculto** | oculto |

En `navbar.component.ts`:

```ts
protected readonly isFactoring = computed(() => this.currentUrl().startsWith('/factoring'));
// isCapital ya definido arriba
protected readonly isUnitPage = computed(() => this.isCapital() || this.isFactoring());

protected readonly visibleLinks = computed(() =>
  this.isUnitPage() ? this.links.filter((l) => !l.logo) : this.links,
);
```

En `navbar.component.html`: `@if (!isUnitPage())` sobre el `<a class="navbar__logo">` (línea 9) y cambiar el `@for` para iterar `visibleLinks()`.

**Riesgo a mitigar:** sin logo arriba-izquierda, la navbar queda descompensada y se pierde el atajo a Inicio. El link de texto `INICIO` cubre la navegación. Habrá que ajustar `navbar.component.scss` para que `.navbar__nav { margin-inline-start: auto }` no deje un hueco raro — probablemente basta con reservar el espacio o alinear el nav a la izquierda cuando `isUnitPage()`. **Pedir screenshot de aprobación a la clienta antes de dar por cerrado el ticket.**

**Nota:** el `@for` de animación móvil en `navbar.component.scss:382` usa `@for $i from 1 through 5`; al reducirse el número de hijos sigue siendo válido (sobra, no falta).

### Verificación
- `/capital`: sin logo superior, sin logos en el menú, "INICIAR SESIÓN CLIENTES" visible.
- `/factoring`: sin logo superior, sin logos en el menú, sin acceso de login.
- `/`, `/contacto`, `/nosotros`: logo Group + ambos logos de unidad, sin login.
- Menú móvil abierto en cada caso.
- Actualizar `navbar.component.spec.ts` (hoy asume logo y login siempre presentes).

---

## Fase 3 — Verificación de tickets ya resueltos (TCK-8006 / 8007)

No requieren código, sólo confirmación y respuesta a la clienta.

### TCK-8006 — Dirección
Pedido: `Ave El Derby 055, Torre 2, oficina 703, Surco, 15023`
En el código ya figura `Av. El Derby 055, Torre 2, Oficina 703, Santiago de Surco 15023` en:
- `features/contact/contact.component.html:63`
- `features/complaints-book/complaints-book.component.html:18`
- `features/factoring/factoring.component.ts:120`
- `backend/src/modules/chat/chat.service.ts:30` (contexto del asistente IA)

**Acción:** ninguna. Confirmar con la clienta que "Ave" vs "Av." y "Santiago de Surco" vs "Surco" son equivalentes aceptables.

> `backend/src/modules/import/import.service.ts:93` tiene `Av. El Polo 695` — es data de importación de un tercero, no la dirección de la oficina. No tocar.

### TCK-8007 — Libro de reclamaciones
Ya existe end-to-end:
- Ruta `/libro-de-reclamaciones` (`app.routes.ts:30`)
- `features/complaints-book/` (componente + estilos + specs)
- `core/services/complaint.service.ts` → `POST /complaints`
- `backend/src/modules/complaints/` (controller, service, schema, DTO)
- Enlace con ícono en el footer (`footer.component.html:82`)

**Acción:** smoke test de envío real del formulario (que llegue a Mongo y salga el correo de confirmación) y cerrar.

---

## Orden de ejecución y entregables

| # | Rama | Tickets | Alcance |
|---|---|---|---|
| 1 | `fix/tck-8013-cta-pair-hover` | 8005, 8013, 8016 | `styles.scss` + 3 HTML de hero |
| 2 | `feat/tck-8014-8015-navbar-contextual` | 8014, 8015 | navbar `.ts` / `.html` / `.scss` / `.spec.ts` |
| 3 | — | 8006, 8007 | Sólo verificación + respuesta en MayaHelp |

Commits citando el código de ticket, según convención de `CLAUDE.md`:
`fix: sólo un CTA en rojo a la vez, el relleno sigue al cursor (TCK-8013, TCK-8016)`

Antes de dar por terminado: `bun run test` en `frontend/` (umbral de cobertura 80%) y `bun run build`.

---

## Puntos abiertos para la clienta

1. **TCK-8015:** sin logo arriba-izquierda la navbar queda visualmente descompensada en `/capital` y `/factoring`. Enviar captura de aprobación.
2. **Fase 1, punto 5:** ¿se aplica también el patrón "uno rojo a la vez" a los CTAs del pie de cada página (`Contáctanos` / `WhatsApp`), o sólo a los heroes?
3. **TCK-8006:** confirmar que la dirección ya publicada es la correcta.
