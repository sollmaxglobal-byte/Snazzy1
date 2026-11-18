/**
 * Helpers for the site-wide WhatsApp support button.
 *
 * The support contact is stored in the existing public `announcement_link`
 * setting (already labelled "WhatsApp support link" in the admin panel) so the
 * number is editable from Admin → Settings and readable by anonymous visitors
 * through the `public_settings` view.
 */

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello WEALTHBRIDGECM support, I would like some help with my account.";

export type WhatsAppContact = {
  /** International number without punctuation, e.g. 237670000000 */
  digits: string;
  /** Clean wa.me URL, safe to use as an href */
  link: string;
  /** Human readable number, e.g. +237 670 000 000 */
  display: string;
  /** Country detected from the dialling code */
  country: string;
};

const COUNTRY_BY_CODE: Array<[string, string]> = [
  ["237", "Cameroon"],
  ["234", "Nigeria"],
  ["233", "Ghana"],
  ["254", "Kenya"],
  ["229", "Benin"],
  ["228", "Togo"],
  ["225", "Côte d'Ivoire"],
  ["221", "Senegal"],
  ["241", "Gabon"],
  ["242", "Congo"],
  ["243", "DR Congo"],
  ["235", "Chad"],
  ["236", "Central African Republic"],
  ["27", "South Africa"],
  ["971", "United Arab Emirates"],
  ["966", "Saudi Arabia"],
  ["33", "France"],
  ["44", "United Kingdom"],
  ["49", "Germany"],
  ["32", "Belgium"],
  ["31", "Netherlands"],
  ["1", "United States / Canada"],
];

// Longest dialling code first, so +237 matches before +2x fallbacks.
COUNTRY_BY_CODE.sort((a, b) => b[0].length - a[0].length);

function formatDisplay(digits: string) {
  const code = COUNTRY_BY_CODE.find(([c]) => digits.startsWith(c))?.[0];
  const rest = code ? digits.slice(code.length) : digits;
  const grouped = rest.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  return code ? `+${code} ${grouped}` : `+${digits}`;
}

/** Parses a pasted number or wa.me link; returns null when it is not usable. */
export function normalizeWhatsApp(value: string | null | undefined): WhatsAppContact | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;

  const fromLink = raw.match(/(?:wa\.me|api\.whatsapp\.com\/send)\/[^\d]*?(\d{6,15})/i);
  const digits = (fromLink?.[1] ?? raw.replace(/[^\d]/g, "")).replace(/^00/, "").replace(/^0+/, "");
  if (!/^\d{8,15}$/.test(digits)) return null;

  const country = COUNTRY_BY_CODE.find(([code]) => digits.startsWith(code))?.[1] ?? "International";

  return {
    digits,
    link: `https://wa.me/${digits}`,
    display: formatDisplay(digits),
    country,
  };
}

/** wa.me link with a pre-filled first message. */
export function whatsAppChatLink(contact: WhatsAppContact) {
  return `${contact.link}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
}
