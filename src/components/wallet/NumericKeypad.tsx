import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Numeric keypad used for money amounts (deposit / withdrawal).
 * Renders a 3-column grid of large tap targets and reports the raw digit string,
 * so callers keep owning the amount state and its validation.
 */

type KeypadVariant = "gold" | "navy";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "back"] as const;
type Key = (typeof KEYS)[number];

const VARIANTS: Record<KeypadVariant, { key: string; accent: string }> = {
  gold: {
    key: "border-[#33333c] bg-[#141418] text-white hover:bg-[#1d1d24] active:bg-[#26262e] focus-visible:ring-[#f6c85a]",
    accent: "text-[#f6c85a]",
  },
  navy: {
    key: "border-[#dbe1ec] bg-white text-[#14213D] hover:bg-[#f3f6fc] active:bg-[#e8edf8] focus-visible:ring-[#3157D5]",
    accent: "text-[#3157D5]",
  },
};

const SIZES = {
  md: "h-14 text-2xl",
  lg: "h-16 text-3xl",
} as const;

function tapFeedback() {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* haptics are best-effort */
  }
}

export function NumericKeypad({
  value,
  onChange,
  variant = "gold",
  size = "md",
  disabled = false,
  maxLength = 10,
  label = "Numeric keypad",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  variant?: KeypadVariant;
  size?: keyof typeof SIZES;
  disabled?: boolean;
  maxLength?: number;
  label?: string;
  className?: string;
}) {
  const digits = value.replace(/\D/g, "");

  function press(key: Key) {
    if (disabled) return;
    tapFeedback();
    if (key === "back") {
      onChange(digits.slice(0, -1));
      return;
    }
    // Leading zeros are dropped, so the pad can never build "007".
    const next = `${digits}${key}`.replace(/^0+/, "").slice(0, maxLength);
    if (!next) return;
    onChange(next);
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("grid w-full grid-cols-3 gap-2", className)}
    >
      {KEYS.map((key) => {
        const isBackspace = key === "back";
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => press(key)}
            aria-label={
              isBackspace ? "Delete last digit" : key === "00" ? "Double zero" : `Digit ${key}`
            }
            className={cn(
              "flex touch-manipulation select-none items-center justify-center rounded-2xl border font-bold leading-none tabular-nums transition duration-75 active:scale-[0.97] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2",
              SIZES[size],
              VARIANTS[variant].key,
              isBackspace && VARIANTS[variant].accent,
            )}
          >
            {isBackspace ? <Delete className="size-6" /> : key}
          </button>
        );
      })}
    </div>
  );
}
