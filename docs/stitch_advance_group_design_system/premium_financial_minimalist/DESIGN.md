---
name: Premium Financial Minimalist
colors:
  surface: '#faf9fc'
  surface-dim: '#dbd9dc'
  surface-bright: '#faf9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f6'
  surface-container: '#efedf0'
  surface-container-high: '#e9e7ea'
  surface-container-highest: '#e3e2e5'
  on-surface: '#1b1c1e'
  on-surface-variant: '#43474d'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f2f0f3'
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
  background: '#faf9fc'
  on-background: '#1b1c1e'
  surface-variant: '#e3e2e5'
  background-surface: '#ffffff'
  neutral-ink: '#0a0a0a'
  neutral-muted: '#6b7280'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
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
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

The brand personality is defined by a synthesis of institutional solidity and high-end modern minimalism. It targets sophisticated investors and business owners who value both traditional financial security and contemporary digital efficiency.

The visual direction follows a **Minimalist** approach with a **Corporate Modern** backbone. The system prioritizes functional elegance, utilizing extreme negative space to create a "gallery-like" environment for financial data and investment messaging. The aesthetic is sharp, intentional, and expensive, moving away from cluttered traditional banking interfaces toward a sleek, agency-inspired experience. Key emotional drivers are confidence, exclusivity, and crystalline clarity.

## Colors

This design system utilizes a "Prestige Capital" palette applied with surgical precision. 

- **Azul Respaldo (#001d3a)** serves as the primary structural color, used for high-level navigation, primary buttons, and deep background sections to anchor the visual weight.
- **Rojo Capital (#b70016)** is used exclusively as a high-impact accent for critical actions, key data points, and indicators of growth or movement.
- **Beige Prestige (#fcd095)** acts as a sophisticated secondary surface color, providing a premium warmth to cards, dividers, or subtle background tints that differentiate the brand from cold, standard fintech blue/white palettes.
- **White (#ffffff)** is the dominant canvas, ensuring the "Brevon" inspired minimalism is maintained through generous breathing room.

## Typography

The system utilizes **Hanken Grotesk** to bridge the gap between financial stability and modern tech. The typographic scale is dramatic, using "Display" sizes for impactful value propositions and minimalist headers.

- **Contrast:** Large, bold headlines are paired with significantly smaller, well-spaced body text to create a hierarchical tension characteristic of premium design.
- **Weight:** Avoid using "Extra Black" for body text; reserve weights above 700 for headlines and labels.
- **Italics:** Strictly prohibited as per brand guidelines to maintain a sense of unwavering stability.
- **Legibility:** Maintain generous line heights (1.5x - 1.6x) for body copy to enhance the minimalist, airy feel.

## Layout & Spacing

The layout philosophy is based on a **Fixed Grid** for desktop and a **Fluid Grid** for mobile. It uses a 12-column structure with wide gutters to facilitate a "spacious" feel.

- **Vertical Rhythm:** Large vertical gaps (120px+) between sections are encouraged to allow the content to breathe and to signal a premium experience.
- **Alignment:** Content should predominantly be left-aligned or centered within wide-margin containers to emulate editorial layouts.
- **Mobile Reflow:** On mobile, margins tighten but vertical spacing remains generous to ensure a comfortable, high-end scrolling experience.

## Elevation & Depth

To maintain the clean, minimalist aesthetic, this design system avoids heavy shadows. 

- **Tonal Layers:** Depth is achieved through color-blocking with the Beige Prestige and light gray backgrounds rather than shadows.
- **Low-contrast Outlines:** Buttons and cards should use subtle 1px borders in a muted primary or secondary tint. 
- **Interactive Depth:** Only use "Ambient Shadows" (ultra-diffused, 4-8% opacity) on active states or floating modals to provide a soft sense of lift without breaking the flat, sophisticated surface logic.

## Shapes

The shape language is "Soft" yet disciplined. While the isotipo is sharp and geometric, the UI uses subtle **0.25rem (4px)** rounding on standard elements like inputs and cards to soften the corporate edge without appearing "bubbly" or informal. Buttons may occasionally use a pill-shape for high-impact CTAs to create a visual "trigger" effect, but the primary language remains architectural and structured.

## Components

- **Buttons:** Primary buttons use a solid "Azul Respaldo" background with white Hanken Grotesk Bold text. Secondary buttons use a 1px border of the same blue with no fill.
- **Input Fields:** Minimalist design with only a bottom border or a very light gray stroke. Labels should use the "Label-bold" typography style (uppercase, tracked out).
- **Cards:** White backgrounds on a subtle Beige Prestige page surface, using thin 1px borders (#E5E7EB) instead of shadows.
- **Chips/Badges:** Small, uppercase labels with background tints of the primary blue (10% opacity) or red for high-alert data points.
- **Financial Graphs:** Clean vector lines in Rojo Capital or Azul Respaldo, avoiding heavy fills or gradients.
- **Micro-interactions:** Transitions should be fast but smooth (200-300ms), utilizing "ease-out" curves to feel responsive and high-tech.