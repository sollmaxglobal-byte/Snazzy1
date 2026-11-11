import { Link } from "@tanstack/react-router";

/**
 * Site wordmark. The name matches the `site_name` app setting so a rebrand only
 * needs to touch this component. `onDark` is for panels/footers with a dark
 * background where the default brand colours would not read.
 */
export function BrandLogo({
  className = "",
  link = false,
  onDark = false,
}: {
  className?: string;
  link?: boolean;
  onDark?: boolean;
}) {
  const logo = (
    <span
      className={`brand-logo ${onDark ? "brand-logo-on-dark" : ""} ${className}`}
      role="img"
      aria-label="WEALTHBRIDGECM"
    >
      <span className="brand-logo-mark" aria-hidden="true">
        ↗
      </span>
      <span className="brand-logo-wordmark">
        WEALTHBRIDGE<strong>CM</strong>
      </span>
    </span>
  );

  return link ? <Link to="/login">{logo}</Link> : logo;
}
