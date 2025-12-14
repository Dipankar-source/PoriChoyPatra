"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Copy, Check, Send } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SOCIALS = [
  {
    name: "LinkedIn",
    link: "https://linkedin.com/in/dipankarbarik/",
    handle: "@dipankarbarik",
  },
  {
    name: "Twitter",
    link: "https://x.com/_dipankarsource",
    handle: "_dipankarsource",
  },
  {
    name: "GitHub",
    link: "https://github.com/Dipankar-source/",
    handle: "@Dipankar-source",
  },
];

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText("dipankarbarik2002@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          _subject: `New message from ${formData.firstName} ${formData.lastName}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 py-20 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono font-bold text-indigo-500 tracking-widest uppercase mb-4 block">
            // Initialize Comms
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
            Let's build <br />
            <span className="text-zinc-400 dark:text-zinc-600">
              something new.
            </span>
          </h1>

          <div className="mb-12">
            <p className="text-sm text-zinc-500 mb-2 font-mono">
              DIRECT CHANNEL
            </p>
            <button
              onClick={handleCopy}
              className="group flex items-center gap-3 text-2xl md:text-3xl font-medium hover:text-indigo-500 transition-colors"
            >
              dipankarbarik2002@gmail.com
              <div className="relative">
                <Copy
                  className={`w-5 h-5 transition-all ${
                    copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                  }`}
                />
                <Check
                  className={`w-5 h-5 absolute top-0 left-0 text-emerald-500 transition-all ${
                    copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-200 dark:border-white/10 pt-8">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 p-4 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{social.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  {social.handle}
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-xl backdrop-blur-sm"
        >
          {submitStatus === "success" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Check className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Thanks for reaching out. I'll get back to you soon at{" "}
                {formData.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <MinimalInput
                  label="FIRST NAME"
                  placeholder="John"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <MinimalInput
                  label="LAST NAME"
                  placeholder="Doe"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <MinimalInput
                label="EMAIL"
                placeholder="john@example.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="group relative">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 block uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-3 text-lg focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                  placeholder="Tell me about your project..."
                  required
                />
              </div>

              {submitStatus === "error" && (
                <div className="text-red-500 text-sm">
                  Failed to send message. Please try again or email directly.
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative overflow-hidden bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold tracking-wide transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && (
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                  </span>
                  <div className="absolute inset-0 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const MinimalInput = ({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  required,
}) => {
  return (
    <div className="group relative">
      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 block uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-2 text-lg focus:outline-none transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
        placeholder={placeholder}
        required={required}
      />
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-indigo-500 transition-all duration-500 group-focus-within:w-full" />
    </div>
  );
};

export default Contact;
