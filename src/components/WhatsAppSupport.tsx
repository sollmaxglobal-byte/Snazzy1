import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, ShieldCheck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeWhatsApp, whatsAppChatLink, type WhatsAppContact } from "@/lib/whatsapp";

/**
 * Floating WhatsApp support entry point for the public site.
 * The number comes from Admin → Settings → WhatsApp support (`announcement_link`
 * in the public settings row), so nothing here is hardcoded.
 */
export function WhatsAppSupport() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [contact, setContact] = useState<WhatsAppContact | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { data } = await supabase
          .from("public_settings")
          .select("announcement_link")
          .eq("id", 1)
          .maybeSingle();
        if (!cancelled) setContact(normalizeWhatsApp(data?.announcement_link));
      } catch {
        /* support button is non-critical */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!contact || pathname.startsWith("/admin")) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Chat with support on WhatsApp, ${contact.display}`}
        className="group fixed bottom-24 right-4 z-40 flex items-center gap-2.5 rounded-full border border-primary/30 bg-background/90 py-2 pl-2 pr-4 shadow-[0_12px_40px_-14px_rgba(0,0,0,0.55)] backdrop-blur-xl transition hover:border-primary/60 hover:shadow-[0_16px_48px_-14px_rgba(0,0,0,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:bottom-6 md:right-6"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-primary/40 [animation-duration:2.8s]"
          />
          <MessageCircle className="relative h-4 w-4" />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Support
          </span>
          <span className="mt-1 text-sm font-medium text-foreground">Chat on WhatsApp</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="whatsapp-support"
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close support"
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-foreground/40 backdrop-blur-[2px]"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="whatsapp-support-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 right-0 flex w-[min(400px,100vw)] flex-col overflow-y-auto border-l border-border/60 bg-background/85 px-6 pb-8 pt-6 shadow-2xl backdrop-blur-2xl sm:px-8 sm:pt-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Support concierge
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  autoFocus
                  aria-label="Close support"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-base font-semibold text-primary ring-1 ring-primary/20">
                  WB
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">Client Support</p>
                  <p className="text-xs text-muted-foreground">{contact.country}</p>
                </div>
              </div>

              <h2
                id="whatsapp-support-title"
                className="mt-7 font-display text-3xl leading-tight text-primary"
              >
                Talk to a human.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Deposits, withdrawals, plans or anything else — message our team on WhatsApp and we
                will pick it up from there.
              </p>

              <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                  Replies within minutes
                </span>
              </div>

              <dl className="mt-8 space-y-3 border-t border-border/60 pt-6 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">WhatsApp</dt>
                  <dd className="font-mono text-foreground">{contact.display}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Hours</dt>
                  <dd className="text-foreground">Mon–Sat, 8:00–20:00</dd>
                </div>
              </dl>

              <div className="mt-auto pt-10">
                <a
                  href={whatsAppChatLink(contact)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-primary px-5 py-4 text-base font-semibold text-primary-foreground shadow-[0_14px_36px_-16px_rgba(0,0,0,0.65)] transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Start chat on WhatsApp
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Opens WhatsApp with a pre-filled message
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
