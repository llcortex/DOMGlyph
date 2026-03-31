"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <aside
        className={`fixed left-0 top-[60px] bottom-0 w-[272px] overflow-y-auto scrollbar-thin border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="px-4 py-6 space-y-8">
          {navigation.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.title}
                </h5>
                {section.badge && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                    {section.badge}
                  </span>
                )}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                          isActive
                            ? "bg-brand-50 text-brand-700 font-medium dark:bg-brand-900/20 dark:text-brand-400"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="border-t border-slate-200 pt-6 dark:border-slate-800 lg:hidden">
            <div className="flex items-center gap-2 mb-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Demo
              </h5>
            </div>
            <a
              href="https://cortexui-demo.llcortex.ai/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-brand-400"
            >
              <span>Demo</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
