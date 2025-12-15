import React, { useState, useEffect } from "react";
// distinct imports assuming you have these icons installed via lucide-react
import {
  ArrowUpRight,
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
import CustomMouseFollower from "@/componants/CustomMouseFollower";
import FooterSystem from "@/componants/Footer";
import Navbar from "@/componants/Navbar";
import { useTheme } from "@/context/ThemeContext";

const SOCIALS = [
  {
    name: "LinkedIn",
    link: "https://linkedin.com/in/dipankarbarik/",
    handle: "@dipankarbarik",
    icon: Linkedin,
    color: "text-blue-500",
    bgHover: "hover:bg-blue-500/10",
    borderHover: "hover:border-blue-500/50",
  },
  {
    name: "Twitter",
    link: "https://x.com/_dipankarsource",
    handle: "_dipankarsource",
    icon: Twitter,
    color: "text-sky-500",
    bgHover: "hover:bg-sky-500/10",
    borderHover: "hover:border-sky-500/50",
  },
  {
    name: "GitHub",
    link: "https://github.com/Dipankar-source/",
    handle: "@Dipankar-source",
    icon: Github,
    color: "text-zinc-600 dark:text-zinc-400",
    bgHover: "hover:bg-zinc-500/10",
    borderHover: "hover:border-zinc-500/50",
  },
];

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email",
    value: "dipankarbarik2002@gmail.com",
    description: "For direct communication",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "West Bengal, India",
    description: "Based in Kolkata",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 97331324__",
    description: "Available for calls",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
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
    bg: isDark ? "bg-[#050505]" : "bg-white",
    text: isDark ? "text-zinc-100" : "text-zinc-900",
    subText: isDark ? "text-zinc-400" : "text-zinc-500",
    border: isDark ? "border-zinc-800" : "border-zinc-200",
    cardBg: isDark ? "bg-zinc-900/30" : "bg-white",
    inputBg: isDark ? "bg-zinc-900/80" : "bg-zinc-50",
    separatorBg: isDark ? "bg-[#0a0a0a]" : "bg-zinc-50/50",
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
      className={`min-h-screen font-sans selection:bg-emerald-500/30 ${theme.bg} ${theme.text}`}
    >
      <CustomMouseFollower className="hidden lg:block" />

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
          className={`border-b ${theme.border} px-8 py-12 md:py-16 relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 relative z-10">
            Let's build{" "}
            <span className="text-emerald-500">something iconic.</span>
          </h1>
          <p
            className={`text-lg md:text-xl font-light ${theme.subText} max-w-2xl relative z-10`}
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
              <h3 className="text-xs font-bold tracking-widest uppercase text-emerald-500 mb-6">
                // Contact Details
              </h3>
              {CONTACT_METHODS.map((method) => (
                <div
                  key={method.title}
                  onClick={() =>
                    handleCopy(method.value, method.title.toLowerCase())
                  }
                  className={`group relative p-4 rounded-2xl border ${theme.border} ${theme.cardBg} 
                  hover:border-emerald-500/50 transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className={`p-3 rounded-xl ${method.bgColor} ${method.color}`}
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
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-transparent group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                      {copied === method.title.toLowerCase() ? (
                        <Check
                          size={14}
                          className="text-emerald-500 group-hover:text-white"
                        />
                      ) : (
                        <Copy
                          size={14}
                          className={`${theme.subText} group-hover:text-white`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Grid */}
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-emerald-500 mb-6">
                // Socials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col items-center justify-center p-6 rounded-2xl border ${theme.border} ${theme.cardBg} ${social.borderHover} ${social.bgHover} transition-all duration-300`}
                  >
                    <social.icon
                      className={`w-6 h-6 mb-3 ${social.color} transition-transform group-hover:scale-110`}
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
            className={`hidden xl:block w-12 border-x ${theme.border} relative overflow-hidden flex-shrink-0 ${theme.separatorBg}`}
          >
            <TiltedLines isDark={isDark} />
          </div>
          {/* Horizontal on Mobile/Tablet */}
          <div
            className={`xl:hidden w-full h-12 border-y ${theme.border} relative overflow-hidden flex-shrink-0 ${theme.separatorBg}`}
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
                    className={`p-8 rounded-2xl border ${theme.border} bg-emerald-500/5 text-center flex flex-col items-center animate-in fade-in zoom-in duration-300`}
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-500 mb-2">
                      Message Sent!
                    </h3>
                    <p className={theme.subText}>
                      Thank you, {formData.firstName}. I'll be in touch soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitStatus("")}
                      className="mt-6 text-sm font-medium underline hover:text-emerald-500"
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
                                placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none`}
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
                      className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300
                            flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20
                            ${
                              isSubmitting
                                ? "bg-zinc-400 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
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
        placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
      />
    </div>
  );
};

const TiltedLines = ({ isDark }) => {
  const strokeColor = isDark ? "#52525b" : "#d4d4d8"; // zinc-600 vs zinc-300

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
              stroke={strokeColor}
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
