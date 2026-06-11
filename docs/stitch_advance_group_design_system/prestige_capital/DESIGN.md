---
name: Prestige Capital
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#43474d'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
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
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  azul-respaldo: '#001D3A'
  rojo-capital: '#B70016'
  beige-prestige: '#FCD095'
  blanco-transparencia: '#FFFFFF'
  success-green: '#22C15E'
  slate-gray: '#7A7A7A'
typography:
  headline-xxl:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
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
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
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
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 80px
---

## Brand & Style

The design system is engineered to project **Trust, Security, and Solidity** for a high-net-worth audience. It adopts a **Corporate Modern** aesthetic characterized by a structured grid, generous whitespace, and high-quality photography. The visual narrative balances the weight of institutional finance with the clarity of modern fintech.

### Key Visual Principles
- **Architectural Structure:** Layouts are built on a rigorous grid, echoing the "building" metaphor of the brand's isotipo.
- **Strategic Patterning:** The 'A' from the logo is utilized as a subtle background watermark or large-scale geometric crop to create depth and brand recall.
- **Premium Materiality:** Depth is achieved through tonal layering and high-end imagery—specifically corporate office environments, data-driven graphics, and confident, professional interactions.
- **Directness:** Communications are brief, bold, and benefit-driven, removing unnecessary decorative elements to focus on transparency.

## Colors

The palette is rooted in **Azul Respaldo**, providing a deep, stable foundation for the interface. **Rojo Capital** is used sparingly as a high-intent accent for primary actions and growth indicators. **Beige Prestige** acts as a sophisticated secondary surface color, softening the high-contrast professional environment and adding an element of exclusivity.

- **Primary (Azul Respaldo):** Used for headers, primary text, and navigation backgrounds to establish authority.
- **Secondary (Rojo Capital):** Reserved for call-to-actions (CTAs), growth metrics, and vital status indicators.
- **Tertiary (Beige Prestige):** Utilized for section backgrounds, highlight cards, and premium UI containers.
- **Neutral (Blanco Transparencia):** The primary canvas color to ensure maximum legibility and a sense of "transparency."

## Typography

The typography system utilizes **Hanken Grotesk** (as a digital-first substitute for Helvetica Now Display) to maintain a clean, neo-grotesque executive feel. The scale is designed for impact, utilizing **Extra Bold** and **Extra Black** weights for high-level value propositions.

**Rules:**
- **No Italics:** In accordance with brand guidelines, slanted text is strictly prohibited.
- **Weight Hierarchy:** Headlines use weights of 700 or higher to convey solidity. Body copy remains at 400 for maximum readability.
- **Tracking:** Headings at large scales (XXL/XL) should use a slight negative letter-spacing (-0.01em to -0.02em) to appear more compact and authoritative.

## Layout & Spacing

The layout utilizes a **12-column fixed grid** for desktop, ensuring content remains centered and focused—a metaphor for stability and control.

- **Grid:** 12 columns with a 24px gutter.
- **Margins:** 40px on desktop to provide breathing room; 16px on mobile for maximum utility.
- **Vertical Rhythm:** A strict 8px base unit drives all spacing. Component gaps should scale in multiples of 8 (16, 24, 32, 48, 64).
- **Section Breaks:** Use large vertical gaps (80px+) between major content blocks to emphasize a "premium" use of space, avoiding cluttered interfaces.

## Elevation & Depth

To maintain a "Solid" and "Structured" brand feel, this design system avoids heavy shadows, instead using **Tonal Layers** and **Low-Contrast Outlines**.

- **Surface Tiers:** Use `Azul Respaldo` for primary background areas and `Beige Prestige` or ultra-light grays for container backgrounds.
- **Shadows:** When necessary for functional elevation (e.g., modals or dropdowns), use a "Deep Institutional Shadow": `0px 4px 20px rgba(0, 29, 58, 0.08)`.
- **Outlines:** Use 1px solid borders in `Azul Respaldo` at 10% opacity for card definitions, ensuring a crisp, architectural finish without the "fuzziness" of soft shadows.

## Shapes

The shape language is **Soft (0.25rem)**. While the brand represents "Solidity," slight rounding prevents the UI from feeling aggressive or dated.

- **Buttons & Inputs:** Use the standard `rounded` (4px) setting.
- **Feature Cards:** May use `rounded-lg` (8px) to subtly differentiate content containers from functional UI elements.
- **The 'A' Graphic:** When used as a background element, the geometric angles of the logo should remain sharp to reinforce the "growth/building" metaphor.

## Components

### Buttons
- **Primary:** Solid `Azul Respaldo` with white text. Bold weight. Minimal 4px corner radius.
- **Secondary:** Solid `Rojo Capital` for "Invest Now" or "Action" items.
- **Ghost:** `Azul Respaldo` 1px outline with bold text for secondary navigation.

### Cards
- **Financial Cards:** Use a white background with a 1px border (#001D3A at 10%). Large titles and clear metric labels in `Azul Respaldo`.
- **Premium Cards:** Use a `Beige Prestige` background to denote exclusive or high-tier information.

### Inputs
- **Style:** Underlined or fully enclosed with 1px borders. Focused state uses a 2px `Azul Respaldo` bottom border.
- **Labels:** Always visible, using the `label-bold` typography style for clarity and "transparency."

### Financial Graphics
- **Data Viz:** Charts should primarily use `Azul Respaldo` for trend lines, with `Rojo Capital` used only to highlight specific data points of growth or opportunity.
- **Backgrounds:** Use corporate photography with a 20-40% `Azul Respaldo` overlay to ensure text legibility while maintaining a professional office atmosphere.