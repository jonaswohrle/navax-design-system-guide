interface IconProps {
  className?: string
}

/** Compass star burst -- "Unforgettable experiences" */
export function IconUnforgettableExperiences({ className = "h-16 w-16" }: IconProps) {
  return (
    <svg viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Compass star burst with radiating lines */}
      <circle cx="43" cy="43" r="28" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="43" cy="43" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Main star points */}
      <line x1="43" y1="3" x2="43" y2="15" stroke="currentColor" strokeWidth="2" />
      <line x1="43" y1="71" x2="43" y2="83" stroke="currentColor" strokeWidth="2" />
      <line x1="3" y1="43" x2="15" y2="43" stroke="currentColor" strokeWidth="2" />
      <line x1="71" y1="43" x2="83" y2="43" stroke="currentColor" strokeWidth="2" />
      {/* Diagonal rays */}
      <line x1="14.7" y1="14.7" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" />
      <line x1="63" y1="63" x2="71.3" y2="71.3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="71.3" y1="14.7" x2="63" y2="23" stroke="currentColor" strokeWidth="1.5" />
      <line x1="23" y1="63" x2="14.7" y2="71.3" stroke="currentColor" strokeWidth="1.5" />
      {/* Short accent rays */}
      <line x1="43" y1="15" x2="35" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="43" y1="15" x2="51" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="71" y1="43" x2="66" y2="35" stroke="currentColor" strokeWidth="1.5" />
      <line x1="71" y1="43" x2="66" y2="51" stroke="currentColor" strokeWidth="1.5" />
      <line x1="43" y1="71" x2="51" y2="66" stroke="currentColor" strokeWidth="1.5" />
      <line x1="43" y1="71" x2="35" y2="66" stroke="currentColor" strokeWidth="1.5" />
      <line x1="15" y1="43" x2="20" y2="51" stroke="currentColor" strokeWidth="1.5" />
      <line x1="15" y1="43" x2="20" y2="35" stroke="currentColor" strokeWidth="1.5" />
      {/* Decorative small dots */}
      <circle cx="43" cy="3" r="2" fill="currentColor" />
      <circle cx="43" cy="83" r="2" fill="currentColor" />
      <circle cx="3" cy="43" r="2" fill="currentColor" />
      <circle cx="83" cy="43" r="2" fill="currentColor" />
    </svg>
  )
}

/** Person with hat and flag -- "Expert tour leaders" */
export function IconExpertTourLeaders({ className = "h-16 w-16" }: IconProps) {
  return (
    <svg viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Hat */}
      <ellipse cx="43" cy="27" rx="14" ry="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M33 27C33 27 35 14 43 14C51 14 53 27 53 27" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Head */}
      <circle cx="43" cy="35" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Body */}
      <path d="M35 43C35 43 28 48 28 56C28 60 30 62 35 63" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M51 43C51 43 58 48 58 56C58 60 56 62 51 63" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M35 63L35 76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M51 63L51 76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Flag */}
      <line x1="62" y1="10" x2="62" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M62 12L76 17L62 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Ground line */}
      <line x1="24" y1="76" x2="62" y2="76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Box with number 11 -- "Small group tours" */
export function IconSmallGroupTours({ className = "h-16 w-16" }: IconProps) {
  return (
    <svg viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Calendar/box outline */}
      <rect x="12" y="16" width="62" height="58" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Calendar top tabs */}
      <line x1="28" y1="10" x2="28" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="10" x2="58" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Horizontal divider */}
      <line x1="12" y1="30" x2="74" y2="30" stroke="currentColor" strokeWidth="2" />
      {/* Number 11 */}
      <text x="43" y="58" textAnchor="middle" dominantBaseline="central" fontSize="26" fontWeight="700" fontFamily="sans-serif" fill="currentColor">
        11
      </text>
    </svg>
  )
}

/** Heart with leaf/globe -- "Responsible at heart" */
export function IconResponsibleAtHeart({ className = "h-16 w-16" }: IconProps) {
  return (
    <svg viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Heart shape */}
      <path
        d="M43 74C43 74 10 55 10 33C10 22 18 14 28 14C34 14 39 17 43 22C47 17 52 14 58 14C68 14 76 22 76 33C76 55 43 74 43 74Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Leaf / sustainability element inside heart */}
      <path
        d="M43 36C43 36 35 42 35 50C35 54 38 56 43 56C48 56 51 54 51 50C51 42 43 36 43 36Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Leaf vein */}
      <line x1="43" y1="38" x2="43" y2="54" stroke="currentColor" strokeWidth="1.5" />
      <path d="M43 44L39 48" stroke="currentColor" strokeWidth="1" />
      <path d="M43 48L47 52" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/** Directional signpost -- for category navigation or wayfinding */
export function IconSignpost({ className = "h-16 w-16" }: IconProps) {
  return (
    <svg viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Main post */}
      <line x1="43" y1="10" x2="43" y2="80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right-pointing sign */}
      <path d="M43 22H66L72 28L66 34H43V22Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Left-pointing sign */}
      <path d="M43 40H20L14 46L20 52H43V40Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Small sign right */}
      <path d="M43 56H60L64 60L60 64H43V56Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Base */}
      <line x1="34" y1="80" x2="52" y2="80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/** Shield with checkmark -- "Explore Flex" / guaranteed departures */
export function IconGuaranteed({ className = "h-16 w-16" }: IconProps) {
  return (
    <svg viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shield outline */}
      <path
        d="M43 8L14 22V43C14 60 26 73 43 80C60 73 72 60 72 43V22L43 8Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Check mark */}
      <path d="M30 43L39 52L56 35" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Star badge -- "Loyalty programme" */
export function IconLoyalty({ className = "h-16 w-16" }: IconProps) {
  return (
    <svg viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ribbon */}
      <circle cx="43" cy="38" r="24" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="43" cy="38" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Star inside */}
      <path
        d="M43 24L46.5 33H56L48.5 39L51 48L43 42.5L35 48L37.5 39L30 33H39.5L43 24Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Ribbon tails */}
      <path d="M32 56L28 78L38 70L43 78" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M54 56L58 78L48 70L43 78" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Globe with plane -- for general "Explore" travel icon */
export function IconExploreGlobe({ className = "h-16 w-16" }: IconProps) {
  return (
    <svg viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Globe */}
      <circle cx="43" cy="43" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Globe lines */}
      <ellipse cx="43" cy="43" rx="14" ry="30" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="13" y1="33" x2="73" y2="33" stroke="currentColor" strokeWidth="1.5" />
      <line x1="13" y1="53" x2="73" y2="53" stroke="currentColor" strokeWidth="1.5" />
      {/* Plane */}
      <path d="M62 16L70 10L72 12L66 20L62 16Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M64 18L56 22L60 26" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
