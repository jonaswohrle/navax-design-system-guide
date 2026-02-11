# Design System Rules for v0

Copy everything below the line into your v0 Rules panel (sidebar > Rules) to enforce this design system across all projects.

---

## Brand Identity

- Primary brand color: #79217a (magenta) — HSL 299 57% 30%
- Visual style: Clean & Minimal — generous whitespace, subtle borders, restrained color use
- Personality: Sophisticated, modern, approachable

## Color Palette (5 colors max)

1. **Primary (Magenta):** #79217a — used for CTAs, active states, links, and brand accents
2. **Foreground (Near-black):** #141318 — used for headings and body text
3. **Background (White):** #FFFFFF — used for page backgrounds and cards
4. **Muted (Warm gray):** #F4F4F5 — used for subtle backgrounds, disabled states
5. **Border (Light gray):** #E4E4E7 — used for borders, dividers, input outlines

Semantic colors (use sparingly):
- Destructive/Error: #E53935
- Success: #1A9A5C
- Warning: #E68A00

## Typography

- **Body/UI font:** Inter (font-sans) — use for all body text, labels, navigation
- **Display/Heading font:** DM Serif Display (font-serif) — use ONLY for hero headings or large display text (h1)
- **Monospace font:** JetBrains Mono (font-mono) — use for code blocks, technical values

### Scale
- Page headings (h1): text-3xl or text-4xl, font-serif, font-normal, tracking-tight
- Section headings (h2): text-2xl, font-sans, font-semibold, tracking-tight
- Sub-headings (h3): text-lg, font-sans, font-semibold
- Body: text-base (16px), font-sans, leading-relaxed
- Small/Caption: text-sm, text-muted-foreground
- Code: text-sm, font-mono

## Spacing & Layout

- Use Tailwind's spacing scale: p-4, p-6, p-8 — avoid arbitrary values
- Section padding: py-16 or py-20 on desktop, py-10 on mobile
- Component gaps: gap-4 for tight layouts, gap-6 for standard, gap-8 for loose
- Card padding: p-6
- Max content width: max-w-6xl mx-auto for pages, max-w-md for forms

## Component Conventions

- Border radius: rounded-lg (default), rounded-md for smaller elements
- Shadows: shadow-sm for cards, no heavy shadows — keep it flat and clean
- Borders: border border-border — always 1px, use the semantic border color
- Focus rings: ring-2 ring-ring ring-offset-2 — always use the primary ring color
- Transitions: transition-colors for color changes, duration-150

### Buttons
- Default (primary): bg-primary text-primary-foreground
- Secondary: bg-secondary text-secondary-foreground
- Ghost: transparent background, hover:bg-accent
- Outline: border border-input, transparent background
- Destructive: bg-destructive text-destructive-foreground
- Always include hover/focus/disabled states

### Cards
- bg-card border border-border rounded-lg shadow-sm
- Header: p-6, Title: text-2xl font-semibold
- Content: p-6 pt-0

### Inputs & Forms
- Height: h-10
- Border: border border-input rounded-md
- Focus: ring-2 ring-ring
- Labels: text-sm font-medium, above inputs with gap-2
- Error text: text-sm text-destructive

### Badges
- Rounded-full, small: px-2.5 py-0.5 text-xs font-semibold
- Default: bg-primary text-primary-foreground
- Use secondary/outline variants for lower emphasis

## Icons

- Use Lucide React icons exclusively
- Default sizes: 16px (size-4), 20px (size-5), 24px (size-6)
- Match icon color to surrounding text color
- Never use emojis as icons

## General Rules

- Mobile-first responsive design: base styles for mobile, md: for tablet, lg: for desktop
- Use semantic HTML (main, header, nav, section, article)
- Add proper ARIA labels and sr-only text for accessibility
- Use shadcn/ui components as the base — extend with the tokens above
- Prefer flexbox for layouts (flex items-center justify-between)
- Use CSS Grid only for complex 2D layouts (grid grid-cols-3 gap-4)
- Always use text-balance or text-pretty on headings
- No decorative blobs, abstract shapes, or gradient backgrounds unless explicitly asked
- Charts should use the --chart-1 through --chart-5 CSS variables
