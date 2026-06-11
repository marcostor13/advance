---
name: Prestige Brevon
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#43474d'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#486080'
  primary: '#000206'
  on-primary: '#ffffff'
  primary-container: '#001d3a'
  on-primary-container: '#6e86a8'
  inverse-primary: '#b0c8ed'
  secondary: '#ba0518'
  on-secondary: '#ffffff'
  secondary-container: '#df2b2d'
  on-secondary-container: '#fffbff'
  tertiary: '#030100'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a1900'
  on-tertiary-container: '#a37e4b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e3ff'
  primary-fixed-dim: '#b0c8ed'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#304867'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb3ac'
  on-secondary-fixed: '#410003'
  on-secondary-fixed-variant: '#93000f'
  tertiary-fixed: '#ffddb2'
  tertiary-fixed-dim: '#eabf86'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#5e4113'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap: 120px
---

## Brand & Style

This design system translates the robust foundation of financial services into a high-end, contemporary corporate aesthetic. It leverages a **Minimalist Modern** style characterized by expansive negative space, high-contrast accents, and a precise, architectural layout.

The UI should evoke a sense of "Quiet Luxury"—professional and grounded, yet forward-thinking. By emphasizing structural clarity over decorative elements, the design system ensures that information remains the priority. The visual narrative is driven by sharp execution, a refined color palette, and a sophisticated interplay between deep navy depths and vibrant, intentional accents.

## Colors

The palette uses **Azul Respaldo (#001D3A)** as the primary anchor for headers, primary buttons, and structural depth. **Rojo Capital (#B70016)** is reserved for high-impact accents, critical call-to-actions, and precise interactive indicators. **Beige Prestige (#FCD095)** acts as a sophisticated secondary surface color, softening the high-contrast transitions and providing a premium background for featured content blocks.

The neutral scale favors cool greys and pure whites to maintain the clean, "Brevon-inspired" clarity. Backgrounds should primarily be white (#FFFFFF) or off-white (#F8F9FA) to maximize the perception of space.

## Typography

This design system utilizes **Hanken Grotesk** across all roles to achieve a cohesive, technical elegance. To mirror the Brevon aesthetic, typography must be treated with generous line-heights for body text to ensure readability amidst white space. 

Headlines utilize tighter tracking and heavier weights to create a commanding visual hierarchy. Labels and small metadata should utilize increased tracking (letter-spacing) and uppercase transformations where appropriate to differentiate them from body content without increasing visual weight.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1280px central grid on desktop, utilizing a 12-column structure with wide 32px gutters to prevent visual clutter. 

Negative space is the primary layout tool. Vertical "Section Gaps" are intentionally large (120px+) to allow the eye to rest and to separate distinct financial products or service modules. For mobile, margins tighten to 24px, and column structures collapse to a single vertical stack, maintaining the same generous vertical rhythm between components.

## Elevation & Depth

To maintain a clean, structured look, this design system avoids heavy shadows in favor of **Tonal Layers** and **Soft Outlines**. 

- **Level 0 (Surface):** The main background, typically White or Beige Prestige.
- **Level 1 (Cards/Containers):** Subtle 1px borders in a muted neutral (e.g., #E9ECEF) or very soft, large-radius ambient shadows (Color: Azul Respaldo, Opacity: 4%, Blur: 40px).
- **Interaction Depth:** Upon hover, elements may slightly lift with a more defined shadow or shift to a Rojo Capital border to indicate focus.

Depth is primarily communicated through color contrast (Azul Respaldo elements appearing "heavier" than Beige Prestige elements) rather than physical simulation.

## Shapes

In alignment with the "ROUND_FOUR" (4px) aesthetic, the design system utilizes **Soft** roundedness. This subtle curve breaks the harshness of a pure brutalist grid while maintaining the "structured" and "corporate" feel required for a capital firm. 

Buttons, input fields, and cards all share the base 0.25rem (4px) radius. Full-pill shapes should be avoided to maintain the professional, architectural tone of the system.

## Components

### Buttons
Primary buttons use the **Azul Respaldo** background with white text and a 4px corner radius. High-priority CTAs use **Rojo Capital**. Secondary buttons should be ghost-style (transparent background) with a 1px Azul Respaldo border.

### Input Fields
Fields utilize a light grey background (#F1F3F5) with a bottom-only border or a subtle 4px rounded perimeter. Upon focus, the border transitions to Rojo Capital for high-contrast visibility.

### Cards
Cards are minimalist: white backgrounds, 1px light grey borders, and generous internal padding (32px). Use Beige Prestige for "highlighted" cards or informational banners.

### Lists & Data
Data tables and lists should be highly legible with no vertical dividers, only thin horizontal hairlines. Use Hanken Grotesk Medium for headers to ensure clarity in complex financial data.

### Chips & Tags
Small, 4px rounded labels using Beige Prestige backgrounds with Azul Respaldo text for categorical information, or Rojo Capital for "Active" or "Critical" statuses.