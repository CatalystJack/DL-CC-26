import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { SOLUTIONS, type Solution } from "@/config/solutions";
import "./solutions-navigation.css";

type SolutionClickHandler = (solution: Solution) => void;

const WHO_ITS_FOR_ORDER = [
  "insurance-brokers", "developers", "syndicators", "lenders",
  "accountants", "bookkeepers", "contractors", "title-companies",
  "property-managers", "staffing-agencies", "general-sales",
];
const WHO_ITS_FOR = WHO_ITS_FOR_ORDER
  .map((id) => SOLUTIONS.find((solution) => solution.id === id))
  .filter((solution): solution is Solution => Boolean(solution));
const PLATFORM_LINKS = [
  { label: "Deal screening", href: "/#journey-screening" },
  { label: "Underwriting", href: "/#journey-auto-yoc" },
  { label: "Outreach", href: "/#journey-drip-campaign" },
  { label: "CRM", href: "/#demo" },
];

export function DesktopPlatformMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        cancelClose();
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      ref={wrapperRef}
      className="ll-solutions-brand ll-solutions-nav relative hidden md:block"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="platform-desktop-menu"
        onClick={() => {
          cancelClose();
          setOpen((value) => !value);
        }}
        className="ll-solutions-nav__desktop-trigger inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-none"
      >
        Platform <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          id="platform-desktop-menu"
          role="menu"
          aria-label="Platform"
          className="ll-solutions-nav__desktop-panel absolute left-0 top-full z-50 mt-2 w-64 p-2"
        >
          {PLATFORM_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => {
                cancelClose();
                setOpen(false);
              }}
              className="ll-solutions-nav__desktop-item flex min-h-10 items-center px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobilePlatformGroup({ onCloseMenu }: { onCloseMenu?: () => void }) {
  return (
    <details className="ll-solutions-brand ll-solutions-nav md:hidden">
      <summary className="ll-solutions-nav__mobile-trigger flex min-h-12 cursor-pointer list-none items-center justify-between rounded-full px-3 text-left text-sm font-semibold transition-colors focus-visible:outline-none">
        Platform <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform" />
      </summary>
      <div className="ll-solutions-nav__mobile-list flex flex-col gap-0.5 pb-2 pl-3">
        {PLATFORM_LINKS.map((item) => (
          <a key={item.href} href={item.href} onClick={onCloseMenu} className="ll-solutions-nav__mobile-item flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-colors">
            {item.label}
          </a>
        ))}
      </div>
    </details>
  );
}

export function DesktopSolutionsMenu({ onNavigate }: { onNavigate?: SolutionClickHandler }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const close = (restoreFocus = false) => {
    cancelClose();
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };
  const openMenu = (focusIndex?: number) => {
    cancelClose();
    setOpen(true);
    if (focusIndex !== undefined) {
      requestAnimationFrame(() => itemRefs.current[focusIndex]?.focus());
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    };
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  const moveFocus = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % WHO_ITS_FOR.length;
    else if (event.key === "ArrowUp") next = (index - 1 + WHO_ITS_FOR.length) % WHO_ITS_FOR.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = SOLUTIONS.length - 1;
    else return;
    event.preventDefault();
    itemRefs.current[next]?.focus();
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, solution: Solution) => {
    onNavigate?.(solution);
    close();
  };

  return (
    <div
      ref={wrapperRef}
      className="ll-solutions-brand ll-solutions-nav relative hidden md:block"
      onMouseEnter={() => openMenu()}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
      aria-controls="who-its-for-desktop-menu"
        onClick={() => open ? close() : openMenu()}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            openMenu(0);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(WHO_ITS_FOR.length - 1);
          } else if (event.key === "Escape" && open) {
            event.preventDefault();
            close(true);
          }
        }}
        className="ll-solutions-nav__desktop-trigger inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-none"
      >
        Who it's for <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          id="who-its-for-desktop-menu"
          role="menu"
          aria-label="Who it's for"
          className="ll-solutions-nav__desktop-panel absolute left-0 top-full z-50 mt-2 w-72 p-2"
          onKeyDown={(event) => {
            const activeIndex = itemRefs.current.findIndex((item) => item === document.activeElement);
            if (activeIndex >= 0) moveFocus(event, activeIndex);
          }}
        >
          {WHO_ITS_FOR.map((solution, index) => (
            <Link
              key={solution.id}
              href={solution.href}
              role="menuitem"
              tabIndex={-1}
              ref={(element: HTMLAnchorElement | null) => { itemRefs.current[index] = element; }}
              onClick={(event) => handleLinkClick(event, solution)}
              className="ll-solutions-nav__desktop-item flex min-h-10 items-center px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none"
            >
              {solution.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileSolutionsGroup({
  onNavigate,
  onCloseMenu,
}: {
  onNavigate?: SolutionClickHandler;
  onCloseMenu?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="ll-solutions-brand ll-solutions-nav md:hidden">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="solutions-mobile-list"
        onClick={() => setExpanded((value) => !value)}
        className="ll-solutions-nav__mobile-trigger flex min-h-12 w-full items-center justify-between rounded-full px-3 text-left text-sm font-semibold transition-colors focus-visible:outline-none"
      >
        Who it's for <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div id="solutions-mobile-list" className="ll-solutions-nav__mobile-list flex flex-col gap-0.5 pb-2 pl-3">
          {WHO_ITS_FOR.map((solution) => (
            <Link
              key={solution.id}
              href={solution.href}
              onClick={() => {
                onNavigate?.(solution);
                onCloseMenu?.();
              }}
              className="ll-solutions-nav__mobile-item flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none"
            >
              {solution.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
