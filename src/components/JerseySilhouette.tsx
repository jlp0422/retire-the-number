interface JerseySilhouetteProps {
  number: string;
  className?: string;
}

// Placeholder garment graphic: team-neutral tone, number only, no logo/wordmark.
// Swap for a real cropped photo (via player.imageFile) once sourced — layout
// already assumes a 3:4 portrait canvas per the spec's normalization rule.
export function JerseySilhouette({ number, className }: JerseySilhouetteProps) {
  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      role="img"
      aria-label="Retired jersey, team hidden"
    >
      <rect width="300" height="400" rx="16" fill="var(--color-jersey-canvas)" />
      <path
        d="M90,40 L130,40 L150,70 L170,40 L210,40 L240,82 L214,112 L230,362 L70,362 L86,112 L60,82 Z"
        fill="var(--color-jersey-fabric)"
        stroke="var(--color-jersey-trim)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M126,42 L150,70 L174,42"
        fill="none"
        stroke="var(--color-jersey-trim)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line x1="94" y1="47" x2="122" y2="47" stroke="var(--color-jersey-trim)" strokeWidth="5" strokeLinecap="round" />
      <line x1="178" y1="47" x2="206" y2="47" stroke="var(--color-jersey-trim)" strokeWidth="5" strokeLinecap="round" />
      <text
        x="150"
        y="252"
        textAnchor="middle"
        fontFamily="var(--font-serif-display, Georgia, serif)"
        fontWeight="700"
        fontSize="108"
        fill="var(--color-jersey-number)"
      >
        {number}
      </text>
    </svg>
  );
}
