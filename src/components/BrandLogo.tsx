import { Link } from "@tanstack/react-router";

/** WealthBridgeCM mark: the bridge span over its deck and piers, in the brand palette. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" focusable="false" fill="none">
      {/* Bridge span */}
      <path d="M14 73 Q48 22 82 73" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      {/* Deck, in the brand bronze */}
      <rect x="8" y="70" width="80" height="7.5" rx="3.75" fill="hsl(var(--gold))" />
      {/* Piers */}
      <rect x="20" y="77.5" width="7" height="13" rx="3.5" fill="currentColor" opacity="0.65" />
      <rect x="69" y="77.5" width="7" height="13" rx="3.5" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

export function BrandLogo({
  className = "",
  link = false,
}: {
  className?: string;
  link?: boolean;
}) {
  const logo = (
    <span className={`brand-logo ${className}`} role="img" aria-label="WealthBridgeCM">
      <BrandMark className="brand-logo-mark" />
      <span className="brand-logo-wordmark">
        WealthBridge<strong>CM</strong>
      </span>
    </span>
  );

  return link ? <Link to="/login">{logo}</Link> : logo;
}
