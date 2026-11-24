"use client";

import { AnimatePresence, m } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { business } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

type Values = {
  name: string;
  phone: string;
  email: string;
  language: string;
  age: string;
  service: string;
  times: string[];
  message: string;
  company: string; // honeypot
};
type Field = "name" | "phone" | "email" | "age" | "service";
type Errors = Partial<Record<Field, string>>;

const LANGS = ["es", "en", "pt", "ar"] as const;
const AGES = ["u17", "17-20", "21+"] as const;
const TIMES = ["wd-am", "wd-pm", "wd-eve", "sat"] as const;
const digits = (s: string) => s.replace(/\D/g, "");

function formatPhone(raw: string) {
  const d = digits(raw).replace(/^1(?=\d{10})/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function BookingForm({ services, idPrefix = "book" }: { services: { id: string; name: string }[]; idPrefix?: string }) {
  const t = useTranslations("form");
  const locale = useLocale();
  const uid = useId();
  const id = (f: string) => `${idPrefix}-${f}-${uid.replace(/:/g, "")}`;
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const initial: Values = { name: "", phone: "", email: "", language: locale === "es" ? "es" : "en", age: "", service: "", times: [], message: "", company: "" };
  const [v, setV] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  // Prefill the service from ?service=<id> (used by "Book this" buttons).
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("service");
    if (s && services.some((x) => x.id === s)) setV((p) => ({ ...p, service: s }));
  }, [services]);

  const validate = (vals: Values): Errors => {
    const e: Errors = {};
    if (!vals.name.trim()) e.name = t("errors.nameRequired");
    const d = digits(vals.phone).replace(/^1(?=\d{10}$)/, "");
    if (!d) e.phone = t("errors.phoneRequired");
    else if (d.length !== 10) e.phone = t("errors.phoneInvalid");
    if (vals.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(vals.email.trim())) e.email = t("errors.emailInvalid");
    if (!vals.age) e.age = t("errors.ageRequired");
    if (!vals.service) e.service = t("errors.serviceRequired");
    return e;
  };

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (touched[k as Field]) setErrors(validate(next));
  };
  const blur = (f: Field) => {
    setTouched((p) => ({ ...p, [f]: true }));
    setErrors(validate(v));
  };
  const err = (f: Field) => (touched[f] ? errors[f] : undefined);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(v);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, age: true, service: true });
    if (Object.keys(found).length) {
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
      });
      return;
    }
    setServerError("");
    setSubmittedName(v.name.trim().split(/\s+/)[0]);
    // Optimistic: show success right away, roll back if delivery fails.
    setStatus("success");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, locale, page: window.location.pathname, elapsedMs: Date.now() - startedAt.current }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch (error) {
      setStatus("error");
      setServerError(typeof navigator !== "undefined" && !navigator.onLine ? t("errors.network") : t("errors.server"));
      void error;
    }
  };

  const reset = () => {
    setV(initial);
    setErrors({});
    setTouched({});
    setStatus("idle");
    startedAt.current = Date.now();
  };

  const errorList = (Object.keys(errors) as Field[]).filter((f) => touched[f] && errors[f]);

  return (
    <div className="card relative overflow-hidden bg-white p-6 text-asphalt shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)] sm:p-9 on-light">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <m.div
            key="ok"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
            role="status"
            aria-live="polite"
          >
            <svg viewBox="0 0 80 80" className="size-24" aria-hidden="true">
              <m.circle cx="40" cy="40" r="36" fill="none" stroke="#22C55E" strokeWidth="5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} />
              <m.path d="M24 41 L35 52 L57 29" fill="none" stroke="#15803D" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.5, ease: "easeOut" }} />
            </svg>
            <h3 className="mt-6 text-h3">{t("success.title")}</h3>
            <p className="mt-3 max-w-sm text-ink-muted">{t("success.body", { name: submittedName })}</p>
            <button type="button" onClick={reset} className="btn btn-ghost-light btn-sm mt-8">
              {t("success.again")}
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            ref={formRef}
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
            aria-describedby={id("sub")}
          >
            <div>
              <h3 className="text-h3">{t("title")}</h3>
              <p id={id("sub")} className="mt-2 text-sm text-ink-muted">
                {t("subtitle")}
              </p>
            </div>

            {(serverError || errorList.length > 0) && (
              <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-2xl border border-danger/30 bg-[#fdecea] p-4 text-sm text-danger outline-none">
                <p className="font-semibold">{serverError || t("errors.summary")}</p>
                {!serverError && (
                  <ul className="mt-2 list-disc space-y-1 ps-5">
                    {errorList.map((f) => (
                      <li key={f}>
                        <a href={`#${id(f)}`} className="underline underline-offset-2">
                          {errors[f]}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                {serverError && (
                  <a href={business.phoneHref} className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold underline">
                    <Icon name="phone" className="size-4" /> {business.phoneDisplay}
                  </a>
                )}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id={id("name")} label={`${t("name")} *`} value={v.name} onChange={(x) => set("name", x)} onBlur={() => blur("name")} error={err("name")} autoComplete="name" required />
              <TextField
                id={id("phone")}
                label={`${t("phone")} *`}
                value={v.phone}
                onChange={(x) => set("phone", formatPhone(x))}
                onBlur={() => blur("phone")}
                error={err("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                required
              />
            </div>
            <TextField id={id("email")} label={t("email")} value={v.email} onChange={(x) => set("email", x)} onBlur={() => blur("email")} error={err("email")} type="email" autoComplete="email" inputMode="email" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field">
                <select id={id("language")} className="field-input" value={v.language} onChange={(e) => set("language", e.target.value)}>
                  {LANGS.map((l) => (
                    <option key={l} value={l} lang={l}>
                      {t(`languageOptions.${l}`)}
                    </option>
                  ))}
                </select>
                <label htmlFor={id("language")} className="field-label" data-static="true">
                  {t("language")}
                </label>
              </div>
              <div className="field">
                <select
                  id={id("service")}
                  className="field-input"
                  value={v.service}
                  onChange={(e) => set("service", e.target.value)}
                  onBlur={() => blur("service")}
                  aria-invalid={!!err("service")}
                  aria-describedby={err("service") ? id("service-err") : undefined}
                  required
                >
                  <option value="" disabled>
                    —
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                  <option value="unsure">{t("serviceUnsure")}</option>
                </select>
                <label htmlFor={id("service")} className="field-label" data-static="true">
                  {t("service")} *
                </label>
                <FieldError id={id("service-err")} msg={err("service")} />
              </div>
            </div>

            <fieldset aria-invalid={!!err("age")} aria-describedby={err("age") ? id("age-err") : undefined}>
              <legend className="mb-2.5 text-sm font-semibold">{t("age")} *</legend>
              <div className="flex flex-wrap gap-2" id={id("age")} tabIndex={-1}>
                {AGES.map((a) => (
                  <label key={a} className="relative">
                    <input
                      type="radio"
                      name={id("age-group")}
                      value={a}
                      checked={v.age === a}
                      onChange={() => {
                        set("age", a);
                        setTouched((p) => ({ ...p, age: true }));
                        setErrors(validate({ ...v, age: a }));
                      }}
                      className="peer sr-only"
                    />
                    <span className="inline-flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-line bg-white px-5 font-medium transition-colors peer-checked:border-asphalt peer-checked:bg-asphalt peer-checked:text-yellow peer-focus-visible:ring-4 peer-focus-visible:ring-yellow/60">
                      {t(`ageOptions.${a}`)}
                    </span>
                  </label>
                ))}
              </div>
              <FieldError id={id("age-err")} msg={err("age")} />
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold">{t("times")}</legend>
              <p className="mb-2.5 text-xs text-ink-muted">{t("timesHint")}</p>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((tm) => (
                  <label key={tm} className="relative">
                    <input
                      type="checkbox"
                      value={tm}
                      checked={v.times.includes(tm)}
                      onChange={(e) => set("times", e.target.checked ? [...v.times, tm] : v.times.filter((x) => x !== tm))}
                      className="peer sr-only"
                    />
                    <span className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-line bg-white px-4 text-sm font-medium transition-colors peer-checked:border-asphalt peer-checked:bg-yellow peer-focus-visible:ring-4 peer-focus-visible:ring-yellow/60">
                      {t(`timeOptions.${tm}`)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="field">
              <textarea id={id("message")} className="field-input" placeholder=" " rows={4} value={v.message} onChange={(e) => set("message", e.target.value)} aria-describedby={id("message-hint")} maxLength={2000} />
              <label htmlFor={id("message")} className="field-label">
                {t("message")}
              </label>
              <p id={id("message-hint")} className="mt-1.5 text-xs text-ink-muted">
                {t("messageHint")}
              </p>
            </div>

            {/* Honeypot: hidden from people and assistive tech, tempting to bots */}
            <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={id("company")}>{t("honeypot")}</label>
              <input id={id("company")} type="text" name="company" tabIndex={-1} autoComplete="off" value={v.company} onChange={(e) => set("company", e.target.value)} />
            </div>

            <button type="submit" className="btn btn-dark w-full" disabled={status === "sending"}>
              {status === "sending" ? t("sending") : t("submit")}
              <Icon name="arrow" className="size-5 rtl:-scale-x-100" />
            </button>
            <p className="text-xs leading-relaxed text-ink-muted">{t("consent")}</p>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <m.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-danger"
        >
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" />
            <path d="M12 7.5v5.5M12 16.5h.01" strokeLinecap="round" />
          </svg>
          {msg}
        </m.p>
      )}
    </AnimatePresence>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "text";
  required?: boolean;
}) {
  return (
    <div className="field">
      <input
        id={id}
        type={type}
        className="field-input"
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        {...rest}
      />
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <FieldError id={`${id}-err`} msg={error} />
    </div>
  );
}
