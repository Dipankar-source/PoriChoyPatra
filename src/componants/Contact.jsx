import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import PageFrame, { BackBar, DASH, HLine, Hatch } from "@/components/PageFrame";

const SOCIALS = [
  {
    name: "LinkedIn",
    link: "https://linkedin.com/in/dipankarbarik/",
    handle: "@dipankarbarik",
    icon: Linkedin,
  },
  {
    name: "Twitter",
    link: "https://x.com/_dipankarsource",
    handle: "_dipankarsource",
    icon: Twitter,
  },
  {
    name: "GitHub",
    link: "https://github.com/Dipankar-source/",
    handle: "@Dipankar-source",
    icon: Github,
  },
];

const DETAILS = [
  {
    key: "email",
    label: "Email",
    value: "dipankarbarik2002@gmail.com",
    icon: Mail,
    copyable: true,
  },
  {
    key: "phone",
    label: "Phone",
    value: "+91 97331324__",
    icon: Phone,
    copyable: true,
  },
  {
    key: "location",
    label: "Location",
    value: "Barasat, West Bengal, India",
    icon: MapPin,
    copyable: false,
  },
];

const LOCATION_COORDINATES = { latitude: 22.7314985, longitude: 88.4884966 };

const getLocationMapUrls = ({ latitude, longitude }) => {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return null;
  }

  return {
    embed: `https://maps.google.com/maps?q=${latitude}%2C${longitude}&z=15&output=embed`,
    external: `https://www.google.com/maps/search/?api=1&query=${latitude}%2C${longitude}`,
  };
};

const FIELD =
  "w-full rounded-lg border border-neutral-300/80 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-emerald-500 dark:border-neutral-800";

const Field = ({ label, name, children }) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className="block font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400"
    >
      {label}
    </label>
    {children}
  </div>
);

const DetailRow = ({ item, copied, onCopy, locationOpen, onToggleLocation }) => {
  const Icon = item.icon;
  const isLocation = item.key === "location";
  const mapUrls = isLocation ? getLocationMapUrls(LOCATION_COORDINATES) : null;
  const content = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Icon
          className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 sm:w-24 sm:shrink-0">
            {item.label}
          </span>
          <span className="min-w-0 truncate text-base text-neutral-900 dark:text-neutral-100">
            {item.value}
          </span>
        </div>
      </div>
      {item.copyable && (
        <span
          className="shrink-0 text-neutral-500 dark:text-neutral-400"
          aria-live="polite"
        >
          {copied ? (
            <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-600 dark:text-emerald-400">
              <Check className="size-3.5" aria-hidden="true" /> Copied
            </span>
          ) : (
            <Copy
              className="size-4 transition-colors group-hover:text-neutral-950 dark:group-hover:text-white"
              aria-hidden="true"
            />
          )}
        </span>
      )}
    </>
  );

  return (
    <div className="relative">
      {item.copyable ? (
        <button
          type="button"
          onClick={() => onCopy(item)}
          aria-label={`Copy ${item.label.toLowerCase()}`}
          className="group flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-300 hover:bg-neutral-200/30 dark:hover:bg-white/[0.03] sm:px-6"
        >
          {content}
        </button>
      ) : isLocation ? (
        <>
          <button
            type="button"
            onClick={onToggleLocation}
            aria-expanded={locationOpen}
            aria-controls="contact-location-map"
            className="group flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-300 hover:bg-neutral-200/30 dark:hover:bg-white/[0.03] sm:px-6"
          >
            {content}
            <ChevronDown
              className={`size-4 shrink-0 text-neutral-500 transition-transform ${locationOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          {locationOpen && (
            <div
              id="contact-location-map"
              className="px-4 pb-4 sm:px-6"
            >
              {mapUrls ? (
                <div className="overflow-hidden rounded-md border border-dashed border-neutral-300/80 dark:border-neutral-800">
                  <iframe
                    title={`Map of ${item.value}`}
                    src={mapUrls.embed}
                    loading="lazy"
                    className="block h-64 w-full border-0"
                  />
                  <a
                    href={mapUrls.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border-t border-dashed border-neutral-300/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-neutral-950 dark:border-neutral-800 dark:hover:text-white"
                  >
                    Open map
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              ) : (
                <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed border-neutral-300/80 bg-neutral-100/60 px-5 text-center dark:border-neutral-800 dark:bg-white/[0.02]">
                  <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
                    Add your latitude and longitude in the location coordinates near the top of Contact.jsx to load the map.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          {content}
        </div>
      )}
      <HLine className="bottom-0" />
    </div>
  );
};

const Contact = () => {
  const [copied, setCopied] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(item.key);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("");
    try {
      const res = await fetch("https://formspree.io/f/xvgeykek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          _replyto: form.email,
          _subject: `Portfolio Inquiry: ${form.firstName}`,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <PageFrame>
      <BackBar to="/" label="Home" />

      {/* Title */}
      <header className="relative px-4 pb-6 pt-6 sm:px-6">
        <h1 className="aktura-font text-[44px] leading-none tracking-wider sm:text-[56px]">
          Contact
        </h1>
        <p className="mt-2 dancing-font max-w-[56ch] text-2xl text-neutral-500 dark:text-neutral-400">
          Have a project in mind or just want to chat? I'm open to new
          opportunities and collaborations.
        </p>

        <HLine className="bottom-0" />
      </header>

      {/* Details */}
      <section aria-label="Contact details">
        {DETAILS.map((item) => (
          <DetailRow
            key={item.key}
            item={item}
            copied={copied === item.key}
            onCopy={handleCopy}
            locationOpen={locationOpen}
            onToggleLocation={() => setLocationOpen((open) => !open)}
          />
        ))}
      </section>

      {/* Socials */}
      <section
        aria-label="Socials"
        className="relative grid grid-cols-1 sm:grid-cols-3"
      >
        {SOCIALS.map(({ name, link, handle, icon: Icon }) => (
          <a
            key={name}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between gap-3 border-b px-4 py-5 transition-colors duration-300 last:border-0 hover:bg-neutral-200/30 dark:hover:bg-white/[0.03] sm:border-b-0 sm:border-r sm:px-6 ${DASH}`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <Icon
                className="size-5 shrink-0 text-neutral-500 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{name}</span>
                <span className="block truncate font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {handle}
                </span>
              </span>
            </span>
            <ArrowUpRight
              className="size-4 shrink-0 -translate-x-1 text-neutral-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              aria-hidden="true"
            />
          </a>
        ))}
        <HLine className="bottom-0" />
      </section>

      {/* Form */}
      <section aria-label="Send a message" className="relative">
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center sm:py-4">
          <h2 className="text-xl dispay-font tracking-tight">
            Send a message
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            I'll get back to you within 24 hours.
          </p>
        </div>
          <HLine className="bottom-[452px]" />

        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 md:py-8">
          {status === "success" ? (
            <div
              className={`flex flex-col items-start gap-3 border border-dashed p-6 ${DASH}`}
              role="status"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Check className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold">Message sent</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Thank you. I'll be in touch soon.
              </p>
              <button
                type="button"
                onClick={() => setStatus("")}
                className="text-sm text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="First name" name="firstName">
                  <input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    autoComplete="given-name"
                    className={FIELD}
                  />
                </Field>
                <Field label="Last name" name="lastName">
                  <input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    autoComplete="family-name"
                    className={FIELD}
                  />
                </Field>
              </div>

              <Field label="Email" name="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  required
                  autoComplete="email"
                  className={FIELD}
                />
              </Field>

              <Field label="Message" name="message">
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project…"
                  required
                  className={`${FIELD} resize-none`}
                />
              </Field>

              {status === "error" && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500"
                >
                  Something went wrong. Please try emailing directly.
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-950 sm:w-auto"
              >
                {sending ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />{" "}
                    Sending…
                  </>
                ) : (
                  <>
                    Send message <Send className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        <HLine className="bottom-0" />
      </section>

      <Hatch />
    </PageFrame>
  );
};

export default Contact;
