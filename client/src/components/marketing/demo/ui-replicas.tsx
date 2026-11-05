/**
 * Presentational replicas of the real LandLinq app components, used only by the
 * animated marketing demos. Investment-company (client) view only. Class strings
 * are copied from the app source (LandLinq.ai White Labeled Replit app, read-only):
 *   components/developer-navigation.tsx  -> AppSidebar / CLIENT_NAV
 *   components/ui/page-header.tsx        -> PageHeader
 *   components/ui/badge.tsx / button.tsx / card.tsx
 *   components/ui/toast.tsx              -> AppToast
 */
import type { ReactNode } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Database,
  Home,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export const LOGO_WORDMARK = "/assets/deallinq-color-icon.png";
export const LOGO_ICON = "/assets/deallinq-color-icon.png";

/* ---------- DeveloperNavigation sidebar (components/developer-navigation.tsx) ---------- */

export type NavItem = { name: string; icon: LucideIcon };

/**
 * realEstateTabs from developer-navigation.tsx. Real-estate investment company
 * profiles filter out "Pipeline" (only general_sales profiles see it), so the
 * sidebar a logged-in investment group sees is exactly these seven links.
 */
export const CLIENT_NAV: NavItem[] = [
  { name: "Deal Dashboard", icon: LayoutDashboard },
  { name: "CRM", icon: Users },
  { name: "Outreach Analytics", icon: BarChart3 },
  { name: "Outreach Setup", icon: Send },
  { name: "Data Hub", icon: Database },
  { name: "Analytics", icon: BarChart3 },
];

/**
 * General Sales (non-real-estate) profiles: developer-navigation.tsx filters
 * realEstateTabs to drop "Deal Dashboard" and "Criteria" and keep "Pipeline".
 */
export const SALES_NAV: NavItem[] = [
  { name: "Home", icon: Home },
  { name: "Pipeline", icon: BriefcaseBusiness },
  { name: "CRM", icon: Users },
  { name: "Outreach", icon: Send },
  { name: "Analytics", icon: BarChart3 },
  { name: "Settings", icon: Settings },
];

export type DemoBrand = { short: string; line1: string; line2: string };

/** Fictional white-label brand (the real sidebar shows the group's own profile.logoUrl). */
export const DEMO_CLIENT_BRAND = { name: "Northwind Residential", short: "NR", color: "#4A90E2" };
const RE_BRAND: DemoBrand = { short: "NR", line1: "Northwind", line2: "Residential" };

function ClientLogo({ expanded, brand = RE_BRAND }: { expanded: boolean; brand?: DemoBrand }) {
  const mark = (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/95 text-[11px] font-bold tracking-tight text-[#081729]">
      {brand.short}
    </span>
  );
  if (!expanded) return mark;
  return (
    <span className="flex min-w-0 items-center gap-2">
      {mark}
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-serif text-[15px] font-semibold text-white">{brand.line1}</span>
        <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">{brand.line2}</span>
      </span>
    </span>
  );
}

export function AppSidebar({
  active,
  expanded = true,
  className = "",
  nav = CLIENT_NAV,
  brand,
}: {
  active?: string;
  expanded?: boolean;
  className?: string;
  nav?: NavItem[];
  brand?: DemoBrand;
}) {
  return (
    <aside
      className={`ll-demo-sidebar flex shrink-0 flex-col border-r border-slate-700/80 bg-[#081729] ${expanded ? "w-64" : "w-[4.5rem]"} ${className}`}
      aria-hidden="true"
    >
      <div className="relative flex h-20 items-center justify-between border-b border-white/10 px-4">
        <ClientLogo expanded brand={brand} />
        {expanded ? (
          <span className="rounded-md p-1.5 text-slate-300"><PanelLeftClose className="h-4 w-4" /></span>
        ) : (
          <span className="absolute bottom-1.5 right-1.5 rounded-md p-1 text-slate-400"><PanelLeftOpen className="h-3.5 w-3.5" /></span>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-hidden px-2 py-4">
        {nav.map(({ name, icon: Icon }) => {
          const isActive = name === active;
          return (
            <div
              key={name}
              className={`flex items-center rounded-md py-2.5 text-sm font-medium transition-colors duration-300 ${
                expanded ? "gap-3 px-3" : "justify-center px-2"
              } ${isActive ? "bg-white/10 text-cyan-300" : "text-slate-300"}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="ll-demo-sidebar-label truncate">{name}</span>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-2">
        <span className="ll-demo-sidebar-signout inline-flex h-9 w-full items-center justify-start gap-3 rounded-full border border-[#3286C8] bg-[#3286C8] px-3 text-sm font-semibold text-white">
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="ll-demo-sidebar-label">Sign Out</span>
        </span>
      </div>
    </aside>
  );
}

/* ---------- PageHeader (components/ui/page-header.tsx) ---------- */

export function PageHeader({ eyebrow, title, actions, compact = false, description }: { eyebrow?: string; title: string; actions?: ReactNode; compact?: boolean; description?: string }) {
  return (
    <div className={`flex items-start justify-between gap-4 border-b border-[hsl(210_16%_93%)] ${compact ? "mb-5 pb-4" : "mb-8 pb-6"}`}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#3286C8]">{eyebrow}</p>}
        <h1 className={`font-serif font-semibold tracking-tight text-[#081729] ${compact ? "text-[26px] leading-tight" : "text-3xl"}`}>{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- Button (components/ui/button.tsx: rounded-full, #3286C8) ---------- */

type BtnVariant = "default" | "outline" | "ghost" | "navy";
const BTN_VARIANT: Record<BtnVariant, string> = {
  default: "bg-[#3286C8] text-white border-[#3286C8]",
  outline: "bg-white text-[#081729] border-[#b8c9d8]",
  ghost: "bg-transparent text-[#081729] border-transparent",
  navy: "bg-[#0A2B4A] text-white border-[#4A90E2]",
};
export function Btn({
  variant = "default",
  size = "sm",
  className = "",
  children,
}: {
  variant?: BtnVariant;
  size?: "sm" | "xs" | "default";
  className?: string;
  children: ReactNode;
}) {
  const sz = size === "xs" ? "h-7 px-3 text-xs" : size === "default" ? "h-11 px-6 text-sm" : "h-9 px-4 text-sm";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border font-semibold transition-all duration-300 ${sz} ${BTN_VARIANT[variant]} ${className}`}>
      {children}
    </span>
  );
}

/* ---------- Badge (components/ui/badge.tsx) ---------- */

export function Badge({ className = "", children, variant = "custom" }: { className?: string; children: ReactNode; variant?: "default" | "outline" | "custom" }) {
  const v = variant === "default" ? "border-transparent bg-[#081729] text-white" : variant === "outline" ? "border-[hsl(220_13%_91%)] text-[hsl(210_25%_7.8%)]" : "";
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors duration-300 ${v} ${className}`}>{children}</span>;
}

/* ---------- Card (components/ui/card.tsx) ---------- */

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-lg border border-[hsl(220_13%_91%)] bg-[hsl(180_6.7%_97.1%)] text-[hsl(210_25%_7.8%)] shadow-sm ${className}`}>{children}</div>;
}

/* ---------- Toast (shadcn toast, default variant) ---------- */

export function AppToast({ title, description }: { title: string; description?: string }) {
  return (
    <div className="w-[340px] rounded-md border border-[hsl(220_13%_91%)] bg-white p-4 pr-8 shadow-lg">
      <p className="text-sm font-semibold text-[hsl(210_25%_7.8%)]">{title}</p>
      {description && <p className="mt-0.5 text-sm text-[hsl(210_25%_7.8%)]/90 opacity-90">{description}</p>}
    </div>
  );
}

/** Fake select trigger (components/ui/select.tsx). */
export function SelectBox({ value, className = "", active = false }: { value: string; className?: string; active?: boolean }) {
  return (
    <span
      className={`flex h-10 items-center justify-between gap-2 rounded-md border bg-white px-3 text-sm transition-colors duration-300 ${
        active ? "border-[#4A90E2] ring-2 ring-[#4A90E2]/20 text-slate-900" : "border-[hsl(220_13%_91%)] text-slate-700"
      } ${className}`}
    >
      <span className="truncate">{value}</span>
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 opacity-50" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
    </span>
  );
}
