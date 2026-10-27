import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericKeypad } from "@/components/wallet/NumericKeypad";

/**
 * Full-screen amount entry. The keypad gets its own screen instead of being
 * placed inside the page, so it can never overlap the page (or the app's
 * bottom bar) and every key stays comfortably tappable.
 *
 * The entered amount is a draft: "Done" commits it, closing the screen discards it.
 */

type Variant = "gold" | "navy";

export function AmountKeypadScreen({
  open,
  title,
  value,
  onCommit,
  onClose,
  variant = "gold",
  currency,
  hint,
  maxLength = 9,
  confirmLabel = "Done",
}: {
  open: boolean;
  title: string;
  value: string;
  onCommit: (value: string) => void;
  onClose: () => void;
  variant?: Variant;
  currency: string;
  hint?: string;
  maxLength?: number;
  confirmLabel?: string;
}) {
  const [draft, setDraft] = useState(value);

  // Each time the screen opens, continue from the amount already on the page.
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  function confirm() {
    onCommit(draft);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 320 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            // Above the app's floating banners (push prompt z-[80], install prompt z-[70])
            // so nothing of the page or its overlays covers the keypad.
            "fixed inset-0 z-[90] flex flex-col overflow-y-auto",
            variant === "gold" ? "bg-[#0f0f12] text-white" : "bg-background text-foreground",
          )}
        >
          <div className="mx-auto flex w-full max-w-md shrink-0 items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
            <span className="text-base font-semibold">{title}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancel amount entry"
              className={cn(
                "rounded-full p-2 transition",
                variant === "gold" ? "hover:bg-white/10" : "hover:bg-black/5",
              )}
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mx-auto flex min-h-24 w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-4">
            <div className="flex items-baseline justify-center gap-2">
              <span
                className={cn(
                  "text-[42px] font-extrabold leading-none tabular-nums",
                  variant === "gold" && "text-[#f6c85a]",
                )}
              >
                {Number(draft || 0).toLocaleString("en-US")}
              </span>
              <span
                className={cn("text-2xl font-extrabold", variant === "gold" && "text-[#f6c85a]")}
              >
                {currency}
              </span>
            </div>
            {hint && (
              <p
                className={cn(
                  "mt-3 text-center text-sm",
                  variant === "gold" ? "text-[#9a9aa2]" : "text-muted-foreground",
                )}
              >
                {hint}
              </p>
            )}
          </div>

          <div className="mx-auto w-full max-w-md shrink-0 px-5 pb-3">
            <NumericKeypad
              value={draft}
              onChange={setDraft}
              variant={variant}
              size="lg"
              maxLength={maxLength}
              label={`${title} keypad`}
            />
          </div>

          <div className="mx-auto w-full max-w-md shrink-0 px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
            <button
              type="button"
              onClick={confirm}
              disabled={!draft}
              className={cn(
                "h-12 w-full rounded-xl text-base font-bold transition active:scale-[0.99] disabled:opacity-50",
                variant === "gold" ? "bg-[#f6c85a] text-[#141418]" : "bg-[#14213D] text-white",
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
