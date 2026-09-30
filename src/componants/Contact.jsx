import React, { useState, useEffect } from "react";
// distinct imports assuming you have these icons installed via lucide-react
import {
  Copy,
  Check,
  Send,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Loader2,
} from "lucide-react";

// Assuming these are your existing components.
// If you are using standard React, ensure paths are correct.
import FooterSystem from "@/componants/Footer";
import Navbar from "@/componants/Navbar";
import { useTheme } from "@/context/ThemeContext";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

const PALM_BEECH_SHADER_COLORS = [
  [84, 42, 82],
  [255, 179, 154],
];
const CONTACT_SHADER_OPACITIES = [
  0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18,
];

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

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email",
    value: "dipankarbarik2002@gmail.com",
    description: "For direct communication",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "West Bengal, India",
    description: "Based in Kolkata",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 97331324__",
    description: "Available for calls",
  },
];

const Contact = () => {
  const { isDark } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Theme constants
  const theme = {
    bg: "bg-[var(--contact-bg)]",
    text: "text-[var(--contact-text)]",
    subText: "text-[var(--contact-muted)]",
    border: "border-[var(--contact-border)]",
    cardBg: "bg-[var(--contact-surface)]",
    inputBg: "bg-[var(--contact-input)]",
    separatorBg: "bg-[var(--contact-separator)]",
    accent: "text-[var(--contact-accent)]",
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const response = await fetch("https://formspree.io/f/xvgeykek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
          _replyto: formData.email,
          _subject: `Portfolio Inquiry: ${formData.firstName}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null; // Or a simple loader

  return (
    <div
      className={`min-h-screen font-sans selection:bg-(--beech) selection:text-(--palm) ${theme.bg} ${theme.text}`}
    >
      {/* Navbar Wrapper to match strict margin constraints if needed, 
          though usually Navbars are full width. Keeping logic as requested. */}
      <div className={`fixed top-0 left-0 right-0 z-50 ${theme.bg}`}>
        <div className="lg:mx-92 border-x border-transparent">
          <Navbar />
        </div>
      </div>

      <div
        className={`lg:mx-92 border-x ${theme.border} min-h-screen flex flex-col pt-20`}
      >
        {/* Hero / Header */}
        <div
          className={`relative isolate overflow-hidden border-b px-8 py-12 md:py-16 ${theme.border}`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--contact-accent-soft),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <CanvasRevealEffect
              animationSpeed={0.2}
              colors={PALM_BEECH_SHADER_COLORS}
              opacities={CONTACT_SHADER_OPACITIES}
              dotSize={2.5}
              showGradient={false}
              containerClassName="!absolute !inset-0 !bg-transparent"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 relative z-10">
            Let's build{" "}
            <span className={theme.accent}>something iconic.</span>
          </h1>
          <p
            className={`text-lg md:text-xl font-light ${theme.subText} max-w-4xl relative z-10`}
          >
            Have a project in mind or just want to chat? I'm currently open to
            new opportunities and collaborations.
          </p>
        </div>

        {/* Main Split Layout */}
        <main className="flex flex-col xl:flex-row flex-1 relative">
          {/* LEFT COLUMN: Contact Info */}
          <div className="w-full xl:w-1/2 p-6 md:p-10 space-y-10">
            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <h3 className={`text-xs font-bold tracking-widest uppercase ${theme.accent} mb-6`}>
                // Contact Details
              </h3>
              {CONTACT_METHODS.map((method) => (
                <div
                  key={method.title}
                  onClick={() =>
                    handleCopy(method.value, method.title.toLowerCase())
                  }
                  className={`group relative overflow-hidden rounded-xl border p-4 ${theme.border} ${theme.cardBg} cursor-pointer transition-colors duration-200 hover:border-(--contact-accent)`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className="rounded-lg bg-(--contact-accent-soft) p-3 text-(--contact-accent)"
                    >
                      <method.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${theme.subText} mb-0.5`}
                      >
                        {method.title}
                      </p>
                      <p className="text-base font-semibold truncate pr-4">
                        {method.value}
                      </p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-(--contact-border) bg-transparent transition-colors group-hover:border-(--contact-accent) group-hover:bg-(--contact-accent)">
                      {copied === method.title.toLowerCase() ? (
                        <Check
                          size={14}
                          className="text-(--contact-accent) group-hover:text-(--contact-accent-foreground)"
                        />
                      ) : (
                        <Copy
                          size={14}
                          className={`${theme.subText} group-hover:text-(--contact-accent-foreground)`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Grid */}
            <div>
              <h3 className={`text-xs font-bold tracking-widest uppercase ${theme.accent} mb-6`}>
                // Socials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col items-center justify-center rounded-xl border p-5 ${theme.border} ${theme.cardBg} transition-colors duration-200 hover:border-(--contact-accent) hover:bg-(--contact-accent-soft)`}
                  >
                    <social.icon
                      className="mb-3 h-6 w-6 text-(--contact-accent) transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium">{social.name}</span>

                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE SEPARATOR (Strict Requirement) */}
          {/* Vertical on Desktop */}
          <div
            className={`hidden xl:block w-12 border-x ${theme.border} relative overflow-hidden shrink-0 ${theme.separatorBg}`}
          >
            <TiltedLines isDark={isDark} />
          </div>
          {/* Horizontal on Mobile/Tablet */}
          <div
            className={`xl:hidden w-full h-12 border-y ${theme.border} relative overflow-hidden shrink-0 ${theme.separatorBg}`}
          >
            <TiltedLines isDark={isDark} />
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="w-full xl:w-1/2 p-6 md:p-10">
            <div className="h-full flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Send a message</h3>
                <p className={`text-sm ${theme.subText}`}>
                  Fill out the form below and I'll get back to you within 24
                  hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {submitStatus === "success" ? (
                  <div
                    className={`flex animate-in flex-col items-center rounded-xl border p-8 text-center fade-in zoom-in duration-300 ${theme.border} bg-(--contact-accent-soft)`}
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-(--contact-accent-soft)">
                      <Check className="h-7 w-7 text-(--contact-accent)" />
                    </div>
                    <h3 className={`mb-2 text-xl font-bold ${theme.accent}`}>
                      Message Sent!
                    </h3>
                    <p className={theme.subText}>
                      Thank you, {formData.firstName}. I'll be in touch soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitStatus("")}
                      className="mt-6 text-sm font-medium underline decoration-(--contact-accent) underline-offset-4 hover:text-(--contact-accent)"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <FormInput
                        label="First Name"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        theme={theme}
                        required
                      />
                      <FormInput
                        label="Last Name"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        theme={theme}
                        required
                      />
                    </div>

                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      theme={theme}
                      required
                    />

                    <div className="space-y-2">
                      <label
                        className={`text-xs font-semibold uppercase tracking-wider ${theme.subText} ml-1`}
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell me about your project..."
                        className={`w-full p-4 rounded-xl border ${theme.border} ${theme.inputBg} 
                                text-sm transition-all duration-300 
                                placeholder:text-(--contact-muted) focus:border-(--contact-accent) focus:outline-none focus:ring-2 focus:ring-(--contact-accent-soft) resize-none`}
                      />
                    </div>

                    {submitStatus === "error" && (
                      <p className="text-red-500 text-sm bg-red-500/5 p-3 rounded-lg border border-red-500/20">
                        Something went wrong. Please try emailing directly.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200
                            ${isSubmitting
                          ? "cursor-not-allowed bg-zinc-400 text-white"
                          : "bg-(--contact-accent) text-(--contact-accent-foreground) hover:brightness-105"
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </main>

        {/* Footer Area Wrapper */}
        <div className={`border-t ${theme.border}`}>
          <FooterSystem />
        </div>
      </div>
    </div>
  );
};

const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  theme,
  required,
}) => {
  return (
    <div className="space-y-2">
      <label
        className={`text-xs font-semibold uppercase tracking-wider ${theme.subText} ml-1`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full p-4 rounded-xl border ${theme.border} ${theme.inputBg} 
        text-sm transition-all duration-300 
        placeholder:text-(--contact-muted) focus:border-(--contact-accent) focus:outline-none focus:ring-2 focus:ring-(--contact-accent-soft)`}
      />
    </div>
  );
};

const TiltedLines = ({ isDark }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={`lines-${isDark ? "dark" : "light"}`}
            x="0"
            y="0"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
              stroke="var(--contact-accent)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#lines-${isDark ? "dark" : "light"})`}
        />
      </svg>
    </div>
  );
};

export default Contact;
