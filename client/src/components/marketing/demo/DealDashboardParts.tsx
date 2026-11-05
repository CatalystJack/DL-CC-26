import type { ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Columns3,
  Download,
  FileSpreadsheet,
  FileText,
  Kanban,
  Map as MapIcon,
  Pencil,
  Plus,
  Search,
  Table2,
  Trash2,
  X,
} from "lucide-react";
import { AppSidebar, Btn, PageHeader, type DemoBrand, type NavItem } from "./ui-replicas";
import { DEMO_STATUS_COUNTS, money, type DealStatus, type DemoDeal } from "./demo-data";
import { T_ENTER, T_LAYOUT } from "./useDemoTimeline";

/*
 * Replica of the investment-company (client) Deal Dashboard. In the app the
 * "Deal Dashboard" sidebar link (/developer/dashboard) renders
 * pages/analyst-dashboard.tsx, whose page title is "Analyst Dashboard".
 * Class strings were taken from the deployed build of that page.
 */

/* ---------- Client shell: DeveloperNavigation + bg-warm page ---------- */

export function ClientShell({
  active,
  children,
  overlay,
  expanded = true,
  bg = "bg-[#fbfaf8]",
  nav,
  brand,
}: {
  active: string;
  children: ReactNode;
  overlay?: ReactNode;
  expanded?: boolean;
  bg?: string;
  nav?: NavItem[];
  brand?: DemoBrand;
}) {
  return (
    <div className="relative flex h-full min-h-0 overflow-hidden">
      <AppSidebar active={active} expanded={expanded} className="h-full" nav={nav} brand={brand} />
      <div className={`relative flex min-w-0 flex-1 flex-col overflow-hidden px-5 pt-5 ${bg}`}>{children}</div>
      {overlay}
    </div>
  );
}

/* ---------- Header ---------- */

export function AnalystHeader() {
  return (
    <PageHeader
      compact
      title="Analyst Dashboard"
      actions={
        <>
          <Btn variant="outline" size="xs" className="uppercase tracking-wider"><Plus className="mr-1.5 h-3.5 w-3.5" />Add New Deal</Btn>
          <Btn variant="outline" size="xs" className="uppercase tracking-wider"><Download className="mr-1.5 h-3.5 w-3.5" />Export CSV</Btn>
        </>
      }
    />
  );
}

/* ---------- Toolbar card: search, view toggle, Columns, filter buttons ---------- */

export type FilterKey = "status" | "priority" | "type";

const STATUS_OPTIONS: { key: DealStatus | "pending" | "dead" | "lost"; label: string; box: string; text: string; count?: number }[] = [
  { key: "unclassified", label: "Unclassified", box: "border-blue-500 bg-blue-500", text: "text-blue-700", count: DEMO_STATUS_COUNTS.unclassified },
  { key: "pursuing", label: "Pursuing", box: "border-green-500 bg-green-500", text: "text-green-700", count: DEMO_STATUS_COUNTS.pursuing },
  { key: "reviewing", label: "Reviewing", box: "border-yellow-500 bg-yellow-500", text: "text-yellow-700", count: DEMO_STATUS_COUNTS.reviewing },
  { key: "passed", label: "Passed", box: "border-red-500 bg-red-500", text: "text-red-700", count: DEMO_STATUS_COUNTS.passed },
  { key: "pending", label: "Pending Address", box: "border-orange-500 bg-orange-500", text: "text-orange-700", count: DEMO_STATUS_COUNTS.pendingAddress },
  { key: "dead", label: "Dead", box: "border-gray-500 bg-gray-500", text: "text-gray-700" },
  { key: "lost", label: "Lost", box: "border-purple-500 bg-purple-500", text: "text-purple-700" },
];

function FilterButton({ label, count, activeClass, minW }: { label: string; count: number; activeClass: string; minW: string }) {
  const on = count > 0;
  return (
    <span
      className={`inline-flex h-8 items-center justify-between gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors duration-300 ${minW} ${
        on ? activeClass : "border-[#b8c9d8] bg-white text-[#081729]"
      }`}
    >
      {on ? `${label} (${count})` : label}
      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
    </span>
  );
}

function Checkbox({ on, box }: { on: boolean; box: string }) {
  return (
    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-200 ${on ? box : "border-gray-300 bg-white"}`}>
      {on && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
    </span>
  );
}

export function AnalystToolbar({
  statusSel = [],
  typeSel = [],
  open,
  view = "table",
  query = "",
  reduced = false,
}: {
  statusSel?: string[];
  typeSel?: string[];
  open?: FilterKey;
  view?: "table" | "cards" | "map";
  query?: string;
  reduced?: boolean;
}) {
  const views = [
    { k: "table", label: "Table", Icon: Table2 },
    { k: "cards", label: "Pipeline", Icon: Kanban },
    { k: "map", label: "Map", Icon: MapIcon },
  ] as const;
  return (
    <div className="relative z-20 mb-3 rounded-lg border border-[hsl(220_13%_91%)] bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <div className={`flex h-9 items-center rounded-md border border-[hsl(220_13%_91%)] bg-white pl-9 pr-3 text-sm ${query ? "text-slate-800" : "text-slate-400"}`}>
            <span className="truncate">{query || "Search deals, brokers, locations..."}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 rounded-full border border-[#d7e5f4] bg-[#f3f8fe] p-1">
          {views.map(({ k, label, Icon }) => (
            <span
              key={k}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${view === k ? "bg-[#dcecff] text-[#2f73bb] shadow-sm" : "text-gray-500"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </span>
          ))}
        </div>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#3286C8] bg-white px-3 text-xs font-medium text-[#3286C8]">
          <Columns3 className="h-3.5 w-3.5" />Columns
        </span>
      </div>
      <div className="relative mt-2.5 flex items-center gap-2">
        <FilterButton label="Status" count={statusSel.length} activeClass="border-[#07172A] bg-[#07172A] text-white" minW="min-w-[118px]" />
        <FilterButton label="Priority" count={0} activeClass="border-gray-700 bg-gray-700 text-white" minW="min-w-[96px]" />
        <FilterButton label="Type" count={typeSel.length} activeClass="border-sky-600 bg-sky-600 text-white" minW="min-w-[86px]" />
        <AnimatePresence>
          {open === "status" && (
            <Popover key="status" left={0} reduced={reduced}>
              {STATUS_OPTIONS.map((o) => {
                const on = statusSel.includes(o.key);
                return (
                  <div key={o.key} className={`flex items-center space-x-2 rounded p-1.5 transition-colors duration-200 ${on ? "bg-gray-100" : ""}`}>
                    <Checkbox on={on} box={o.box} />
                    <span className={`text-sm font-medium ${o.text}`}>{o.count != null ? `${o.label} (${o.count})` : o.label}</span>
                  </div>
                );
              })}
            </Popover>
          )}
          {open === "type" && (
            <Popover key="type" left={226} reduced={reduced}>
              {[
                { k: "Land", box: "border-sky-600 bg-sky-600" },
                { k: "Acquisition", box: "border-sky-600 bg-sky-600" },
              ].map((o) => {
                const on = typeSel.includes(o.k);
                return (
                  <div key={o.k} className={`flex items-center space-x-2 rounded p-1.5 transition-colors duration-200 ${on ? "bg-gray-100" : ""}`}>
                    <Checkbox on={on} box={o.box} />
                    <span className="text-sm font-medium text-sky-700">{o.k}</span>
                  </div>
                );
              })}
            </Popover>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Popover({ left, children, reduced }: { left: number; children: ReactNode; reduced: boolean }) {
  return (
    <m.div
      initial={reduced ? false : { opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      className="absolute top-10 z-30 w-56 rounded-md border border-[hsl(220_13%_91%)] bg-white p-2 shadow-lg"
      style={{ left }}
    >
      {children}
    </m.div>
  );
}

/* ---------- Table ---------- */

const STATUS_SQUARE: Record<DealStatus, { letter: string; cls: string; title: string }> = {
  pursuing: { letter: "P", cls: "bg-green-500 border-green-600 text-white", title: "Pursuing" },
  reviewing: { letter: "R", cls: "bg-yellow-500 border-yellow-600 text-white", title: "Reviewing" },
  passed: { letter: "X", cls: "bg-red-500 border-red-600 text-white", title: "Passed" },
  unclassified: { letter: "?", cls: "bg-gray-100 border-gray-300 text-gray-500", title: "Unclassified" },
};

export function StatusSquare({ status, reduced }: { status: DealStatus; reduced?: boolean }) {
  const s = STATUS_SQUARE[status];
  return (
    <m.span
      key={status}
      initial={reduced ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={`flex h-7 w-7 items-center justify-center rounded-md border-2 text-xs font-bold ${s.cls}`}
    >
      {s.letter}
    </m.span>
  );
}

const TH = "border-r border-gray-200 px-2 py-1 text-left text-[11px] font-semibold text-gray-700";
const TD = "border-r border-gray-200 px-1.5 text-xs text-gray-700";

function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <th className={`${TH} ${className}`}>
      {children && (
        <span className="flex items-center gap-1 whitespace-nowrap">
          {children}
          <ArrowUpDown className="h-3 w-3 text-gray-400" />
        </span>
      )}
    </th>
  );
}

export function AnalystTable({
  rows,
  highlightIds = [],
  selectedId,
  reduced = false,
  hideCols = [],
  footer = true,
}: {
  rows: DemoDeal[];
  highlightIds?: number[];
  selectedId?: number;
  reduced?: boolean;
  hideCols?: ("name" | "broker")[];
  footer?: boolean;
}) {
  const showName = !hideCols.includes("name");
  const showBroker = !hideCols.includes("broker");
  return (
    <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[hsl(220_13%_91%)] bg-white shadow-sm">
      <table className="h-full w-full border-collapse">
        <thead className="border-b-2 border-gray-300 bg-gray-100">
          <tr>
            <th className={`${TH} w-7`}><span className="block h-3.5 w-3.5 rounded-sm border border-gray-400 bg-white" /></th>
            <Th>ID</Th>
            <Th>Status</Th>
            <Th>Priority</Th>
            <Th>Property Address</Th>
            {showName && <Th>Name</Th>}
            <th className={TH} title="AI Reason"><FileText className="h-3.5 w-3.5 text-gray-500" /></th>
            <Th>Type</Th>
            <Th>Price</Th>
            <Th>Acres</Th>
            {showBroker && <Th>Broker Name</Th>}
            <th className="px-2 py-1 text-left text-[11px] font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((r) => {
              const isNew = highlightIds.includes(r.id);
              const isSel = selectedId === r.id;
              return (
                <m.tr
                  key={r.id}
                  layout={reduced ? false : "position"}
                  initial={reduced ? false : { opacity: 0, y: -14, backgroundColor: "rgba(219,234,254,1)" }}
                  animate={{ opacity: 1, y: 0, backgroundColor: isSel ? "rgba(239,246,255,1)" : isNew ? "rgba(239,246,255,1)" : "rgba(255,255,255,1)" }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ ...T_LAYOUT, backgroundColor: { duration: 1.2 } }}
                  className="h-[46px] border-b border-gray-200"
                >
                  <td className={`${TD} w-7`}><span className="mx-auto block h-3.5 w-3.5 rounded-sm border border-gray-300 bg-white" /></td>
                  <td className={TD}><span className="font-mono text-[13px] font-semibold text-blue-600">#{r.id}</span></td>
                  <td className={TD}><StatusSquare status={r.status} reduced={reduced} /></td>
                  <td className={TD}>
                    <span className="flex h-7 w-[46px] items-center justify-between rounded-md border border-[hsl(220_13%_91%)] bg-white px-1.5 text-xs font-bold text-gray-700">
                      {r.priority ?? "—"}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </span>
                  </td>
                  <td className={`${TD} font-medium text-gray-900`}>
                    <span className="flex flex-col leading-tight">
                      <span className="truncate text-blue-600">{r.address}</span>
                      <span className="truncate text-[10px] text-gray-500">{r.city}</span>
                    </span>
                  </td>
                  {showName && <td className={`${TD} max-w-[84px] truncate`}>{r.name}</td>}
                  <td className={`${TD} w-[38px]`}>
                    {r.status === "unclassified" ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-500"><FileText className="h-3.5 w-3.5" /></span>
                    ) : (
                      <m.span
                        initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-white ${r.status === "passed" ? "bg-red-500" : "bg-[#3286C8]"}`}
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </m.span>
                    )}
                  </td>
                  <td className={TD}>
                    <span className="flex flex-wrap gap-1">
                      {r.status === "unclassified" || r.productTypes.length === 0 ? (
                        <span className="text-gray-400">{r.kind}</span>
                      ) : (
                        r.productTypes.map((t) => (
                          <span key={t} className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">{t}</span>
                        ))
                      )}
                    </span>
                  </td>
                  <td className={`${TD} whitespace-nowrap`}>{money(r.price)}</td>
                  <td className={TD}>{r.acres.toFixed(1)}</td>
                  {showBroker && <td className={`${TD} max-w-[110px] truncate`}>{r.broker}</td>}
                  <td className="px-1.5">
                    <span className="flex items-center gap-1">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500 text-emerald-600"><FileSpreadsheet className="h-3.5 w-3.5" /></span>
                      <span className="flex h-7 w-7 items-center justify-center text-red-600 opacity-50"><Trash2 className="h-3.5 w-3.5" /></span>
                    </span>
                  </td>
                </m.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
      {footer && (
        <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
          <span>Showing 1–{rows.length} of {rows.length}</span>
          <span className="flex items-center gap-2">
            <span className="rounded-full border border-[#b8c9d8] px-2.5 py-0.5 text-[#081729]">Previous</span>
            <span className="rounded-full border border-[#b8c9d8] px-2.5 py-0.5 text-[#081729]">Next</span>
            <span>Rows: 25</span>
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------- Deal detail drawer ---------- */

const CLASS_PILL: Record<DealStatus, { label: string; cls: string }> = {
  pursuing: { label: "High Priority", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  reviewing: { label: "Potential", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  passed: { label: "Clear No", cls: "bg-red-100 text-red-600 border-red-200" },
  unclassified: { label: "Unclassified", cls: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function DealDrawer({ deal, aiText, children, reduced }: { deal: DemoDeal; aiText: string; children?: ReactNode; reduced?: boolean }) {
  const pill = CLASS_PILL[deal.status];
  return (
    <>
      <m.div initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 bg-black/30" />
      <m.aside
        initial={reduced ? false : { x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={T_ENTER}
        className="absolute inset-y-0 right-0 z-40 flex w-[400px] flex-col bg-white shadow-2xl"
      >
        <div className="border-b border-gray-200 px-5 py-4">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${pill.cls}`}>{pill.label}</span>
            {deal.targetMarket && <span className="rounded-full border border-blue-200 bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">Target Market</span>}
            <span className="font-mono text-[11px] font-semibold text-blue-600">#{deal.id}</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-[#07172A]">{deal.address}</p>
              <p className="text-sm text-gray-500">{deal.city} · {deal.county}</p>
              {deal.zoning && <p className="mt-0.5 text-xs text-gray-500"><span className="font-medium">Zoning:</span> {deal.zoning}</p>}
            </div>
            <span className="flex items-center gap-1">
              <span className="inline-flex h-7 items-center gap-1 rounded-full border border-[#b8c9d8] px-2.5 text-xs font-semibold text-[#081729]"><Pencil className="h-3 w-3" />Edit</span>
              <span className="p-1 text-gray-400"><X className="h-4 w-4" /></span>
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-hidden px-5 py-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              ["Units", String(deal.units)],
              ["Vintage", deal.vintage ? String(deal.vintage) : "—"],
              ["Acres", deal.acres.toFixed(1)],
              ["Ask Price", `$${(deal.price / 1e6).toFixed(1)}M`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-gray-50 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">{k}</p>
                <p className="text-sm font-bold text-[#07172A]">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Rent Metrics</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Top Rent PSF", deal.rentPsf],
                ["Avg Rent/Unit", deal.avgRentUnit ?? (deal.status === "passed" ? "$1,540" : "$1,812")],
                ["Comps", "3 mi radius"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-blue-50 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-blue-400">{k}</p>
                  <p className="text-sm font-bold text-[#07172A]">{v}</p>
                </div>
              ))}
            </div>
          </div>
          {children}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">AI Analysis</p>
            <div className="min-h-[76px] rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-3 text-xs leading-relaxed text-gray-700">
              {aiText}
              {aiText.length > 0 && aiText.length < 20 && <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-gray-400 align-middle" />}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Broker</p>
            <p className="text-sm text-gray-700">{deal.broker}</p>
          </div>
        </div>
      </m.aside>
    </>
  );
}
