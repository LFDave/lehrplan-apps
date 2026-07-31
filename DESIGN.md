version: 2026-08-01
name: mini-apps-design-system
role: token-only
register: product-surface
theme:
  default: dark
  allowed:
    - dark
  disallowed:
    - light
    - theme-switch

color:
  mode:
    dark:
      background:
        app: "#0E141D"
        canvas: "#111A25"
        surface: "#162232"
        surface-raised: "#1B2A3C"
        surface-soft: "#13202E"
        overlay: "#0B1119E6"
      border:
        subtle: "#263648"
        strong: "#3A4B5F"
        focus: "#F4E7B1"
      text:
        primary: "#F5F7FA"
        secondary: "#C5D0DD"
        muted: "#8FA1B4"
        disabled: "#617286"
        inverse: "#101722"
      action:
        primary-bg: "#F5F7FA"
        primary-text: "#101722"
        primary-hover-bg: "#E5EAF0"
        secondary-bg: "#1C2A3B"
        secondary-text: "#F5F7FA"
        secondary-hover-bg: "#26384E"
      accent:
        default: "#D8C47A"
        default-soft: "#D8C47A26"
        default-muted: "#A99858"
        success: "#8ECFA3"
        success-soft: "#8ECFA326"
        warning: "#E6C26E"
        warning-soft: "#E6C26E26"
        danger: "#E58C8A"
        danger-soft: "#E58C8A26"
        info: "#9FC7D7"
        info-soft: "#9FC7D726"
      app-accent-options:
        amber:
          base: "#D8C47A"
          soft: "#D8C47A26"
          muted: "#A99858"
        sage:
          base: "#9BC8A8"
          soft: "#9BC8A826"
          muted: "#72987C"
        blue:
          base: "#9FBBD7"
          soft: "#9FBBD726"
          muted: "#718CAB"
        coral:
          base: "#D99A8B"
          soft: "#D99A8B26"
          muted: "#AC746A"
        violet:
          base: "#B9A9D6"
          soft: "#B9A9D626"
          muted: "#8F7AAD"

typography:
  font-family:
    body: "Atkinson Hyperlegible"
    display: "Literata"
    mono: "IBM Plex Mono"
    fallback: "system-ui, sans-serif"
  font-source:
    policy: self-hosted
    external-font-services: false
    ship-only-used-fonts: true
  font-usage:
    body:
      - body-copy
      - labels
      - buttons
      - feedback
    display:
      - titles
      - display-headings
    mono:
      - timers
      - scores
      - streaks
      - column-arithmetic
      - codes-and-ids
    policy:
      mono-for-body-copy: false
  weight:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
  size:
    xs: "0.75rem"
    sm: "0.875rem"
    md: "1rem"
    lg: "1.125rem"
    xl: "1.375rem"
    xxl: "1.75rem"
    display-sm: "2.125rem"
    display-md: "2.75rem"
  line-height:
    tight: 1.2
    title: 1.15
    body: 1.55
    relaxed: 1.7
  letter-spacing:
    normal: "0em"
    title: "-0.015em"
    label: "0.02em"
    avoid-body-wide: true
    avoid-crushed: true

space:
  0: "0px"
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  10: "2.5rem"
  12: "3rem"
  16: "4rem"
  rhythm:
    tight-group: "0.5rem"
    field-gap: "0.75rem"
    card-gap: "1rem"
    section-gap: "2rem"
    screen-padding-mobile: "1rem"
    screen-padding-tablet: "1.5rem"
    screen-padding-desktop: "2rem"

radius:
  none: "0px"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  pill: "999px"
  policy:
    animate-radius: false
    avoid-many-radii-per-screen: true

shadow:
  none: "none"
  sm: "0 1px 2px #00000033"
  md: "0 8px 24px #00000030"
  lg: "0 18px 48px #00000038"
  policy:
    colored-glow: false
    wide-diffuse-plus-hairline-border: false

motion:
  duration:
    fast: "120ms"
    base: "180ms"
    slow: "240ms"
  easing:
    out: "cubic-bezier(0.16, 1, 0.3, 1)"
    in-out: "cubic-bezier(0.65, 0, 0.35, 1)"
  allowed-properties:
    - opacity
    - transform
  disallowed-easing:
    - bounce
    - elastic
    - wobble
    - spring
  reduced-motion:
    non-essential-animation: false

layout:
  max-width:
    readable: "72ch"
    app: "72rem"
    narrow: "42rem"
  shell:
    min-height: "100svh"
    padding-mobile: "1rem"
    padding-tablet: "1.5rem"
    padding-desktop: "2rem"
  screen:
    gap: "1.5rem"
    header-gap: "0.5rem"
    content-gap: "1rem"
    feedback-gap: "0.75rem"

breakpoint:
  tablet: "40rem"
  desktop: "64rem"
  policy:
    mobile-first: true

target:
  min: "2.75rem"
  child: "3rem"
  min-gap: "0.5rem"

focus:
  ring-width: "2px"
  ring-offset: "2px"
  ring-color: color.mode.dark.border.focus
  ring-style: solid

layer:
  base: 0
  raised: 1
  sticky: 10
  overlay: 20
  modal: 30
  toast: 40

component:
  app-shell:
    background: color.mode.dark.background.app
    color: color.mode.dark.text.primary
    padding: space.rhythm.screen-padding-mobile
  panel:
    background: color.mode.dark.background.surface
    border: "1px solid"
    border-color: color.mode.dark.border.subtle
    radius: radius.lg
    shadow: shadow.sm
    padding: space.5
  card:
    background: color.mode.dark.background.surface-raised
    border: "1px solid"
    border-color: color.mode.dark.border.subtle
    radius: radius.md
    shadow: shadow.none
    padding: space.4
  button-primary:
    background: color.mode.dark.action.primary-bg
    color: color.mode.dark.action.primary-text
    hover-background: color.mode.dark.action.primary-hover-bg
    radius: radius.pill
    height: "2.75rem"
    padding-inline: space.5
    font-weight: typography.weight.semibold
  button-secondary:
    background: color.mode.dark.action.secondary-bg
    color: color.mode.dark.action.secondary-text
    hover-background: color.mode.dark.action.secondary-hover-bg
    radius: radius.pill
    height: "2.75rem"
    padding-inline: space.5
  input:
    background: color.mode.dark.background.surface-soft
    color: color.mode.dark.text.primary
    border-color: color.mode.dark.border.subtle
    focus-border-color: color.mode.dark.border.focus
    radius: radius.md
    height: "2.75rem"
  feedback:
    background-default: color.mode.dark.accent.default-soft
    background-success: color.mode.dark.accent.success-soft
    background-warning: color.mode.dark.accent.warning-soft
    background-danger: color.mode.dark.accent.danger-soft
    text: color.mode.dark.text.primary
    radius: radius.md
    padding: space.4
  progress:
    track: color.mode.dark.background.surface-soft
    fill: color.mode.dark.accent.default
    height: "0.5rem"
    radius: radius.pill
  choice:
    background: color.mode.dark.background.surface-raised
    selected-border-color: color.mode.dark.accent.default
    correct-background: color.mode.dark.accent.success-soft
    wrong-background: color.mode.dark.accent.danger-soft
    radius: radius.md
    padding: space.4

icon:
  library: lucide
  delivery: inline-svg
  external-icon-cdn: false
  favicon:
    format: svg
    file: favicon.svg
    self-hosted: true
  stroke-width: 2
  size:
    sm: "1rem"
    md: "1.25rem"
    lg: "1.5rem"
  policy:
    icon-tile-above-heading: false
    decorative-icon-stacks: false

flag:
  provider: flagcdn
  code-format: iso-3166-1-alpha-2-lowercase
  svg-url-pattern: "https://flagcdn.com/{code}.svg"
  png-url-pattern: "https://flagcdn.com/w80/{code}.png"
  emoji-flags: false

anti-pattern:
  side-tab-accent-border: false
  thick-colored-rounded-border: false
  gradient-text: false
  purple-violet-gradient: false
  cyan-on-dark-glow: false
  cream-page-background: false
  nested-cards: false
  monotonous-spacing: false
  bounce-easing: false
  dark-glow: false
  icon-tile-stack: false
  italic-serif-hero: false
  hero-eyebrow-chip: false
  repeated-section-kickers: false
  numbered-section-markers: false
  em-dash-overuse: false
  marketing-buzzwords: false
  oversized-long-h1: false
  crushed-letter-spacing: false
  broken-placeholder-image: false
