interface ExploreLogoProps {
  variant?: "dark" | "light" | "color"
  width?: number
}

export function ExploreLogo({ variant = "color", width = 140 }: ExploreLogoProps) {
  const textColor =
    variant === "light" ? "#FFFFFF" : variant === "dark" ? "#1A1A2E" : "#1A1A2E"
  const accentColor = "#E85D26"

  return (
    <svg
      width={width}
      height={width * 0.3}
      viewBox="0 0 140 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Explore"
    >
      <text
        x="0"
        y="32"
        fontFamily="var(--font-dm-sans), system-ui, sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="-1"
        fill={textColor}
      >
        {"expl"}
      </text>
      <text
        x="72"
        y="32"
        fontFamily="var(--font-dm-sans), system-ui, sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="-1"
        fill={accentColor}
      >
        {"o"}
      </text>
      <text
        x="92"
        y="32"
        fontFamily="var(--font-dm-sans), system-ui, sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="-1"
        fill={textColor}
      >
        {"re"}
      </text>
      <circle cx="78" cy="10" r="4" fill={accentColor} />
      <line x1="78" y1="6" x2="78" y2="2" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="78" y1="14" x2="78" y2="18" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="74" y1="10" x2="70" y2="10" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="10" x2="86" y2="10" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
