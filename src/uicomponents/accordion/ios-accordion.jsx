import { useState } from "react";
import { ChevronRight, Bell, Moon, Wifi, Shield } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-label="Toggle setting"
    aria-checked={checked}
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    className={cn(
      "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
      checked ? "bg-green-500" : "bg-zinc-200 dark:bg-zinc-700"
    )}
  >
    <span
      className={cn(
        "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

export default function IOSSettingsAccordion() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    wifi: true,
    privacy: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      color: "bg-red-500",
      description:
        "Manage push notifications, email alerts, and sound preferences.",
    },
    {
      id: "wifi",
      label: "Wi-Fi & Network",
      icon: Wifi,
      color: "bg-blue-500",
      description:
        "Configure your network connection, DNS settings, and proxies.",
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: Shield,
      color: "bg-indigo-500",
      description:
        "Control app permissions, data usage, and tracking transparency.",
    },
    {
      id: "darkMode",
      label: "Display & Brightness",
      icon: Moon,
      color: "bg-zinc-900",
      description:
        "Adjust brightness, text size, and toggle Dark Mode settings.",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-6  min-h-[600px] flex flex-col justify-center">
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <Accordion
          className="flex w-full flex-col"
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }} 
        >
          {items.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className={cn(
                "border-b border-zinc-100 dark:border-zinc-800 last:border-none",
                !settings[item.id] && "opacity-75"
              )}
            >
              <AccordionTrigger className="w-full px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm",
                        item.color
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-400 dark:text-zinc-500 hidden sm:block">
                      {settings[item.id] ? "On" : "Off"}
                    </span>
                    <ToggleSwitch
                      checked={settings[item.id]}
                      onChange={() => handleToggle(item.id)}
                    />
                    <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform duration-300 group-data-expanded:rotate-90 ml-1" />
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 pb-4">
                  <div className="ml-11 border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                      {item.description}
                    </p>
                    {settings[item.id] && (
                      <div className="flex flex-col gap-2 mt-2">
                        <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 text-left hover:underline">
                          Configure options...
                        </button>
                        <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 text-left hover:underline">
                          View usage history...
                        </button>
                      </div>
                    )}

                    {!settings[item.id] && (
                      <p className="text-xs text-amber-600 dark:text-amber-500 font-medium bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md inline-block">
                        Enable this setting to see more options.
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <p className="mt-4 text-center text-xs text-zinc-400">
        System Preferences v2.0
      </p>
    </div>
  );
}
