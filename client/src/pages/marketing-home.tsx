import { useEffect, useRef, useState, type ReactNode } from "react";
import "./marketing-home-brand.css";
import { Link } from "wouter";
import {
  CheckCircle2,
  ChevronDown,
  Download,
  List,
  Mail,
  Map,
  MessageSquare,
  Menu,
  Pause,
  Plus,
  Play,
  Rocket,
  Search,
  Send,
  Sparkles,
  Table2,
  Tag,
  Users,
  X,
} from "lucide-react";
import Footer from "@/components/footer";
import MarketingHeroStats from "@/components/marketing/hero-stats";
import { BRAND_DEMO_SENDER, BRAND_NAME, WORKSPACE_LABEL } from "@/config/brand";
import { BrandWordmark } from "@/components/brand-wordmark";
import IntakeToPipelineDemo from "@/components/marketing/demo/IntakeToPipelineDemo";
import CriteriaScreeningDemo from "@/components/marketing/demo/CriteriaScreeningDemo";
import DashboardFilterDemo from "@/components/marketing/demo/DashboardFilterDemo";
import TrussStreamDemo from "@/components/marketing/demo/TrussStreamDemo";
import DemoSectionTabs from "@/components/marketing/demo/DemoSectionTabs";
import { DemoDatasetProvider } from "@/components/marketing/demo/demo-dataset";
import AutoYocDemo from "@/components/marketing/demo/AutoYocDemo";
import SalesContactsDemo from "@/components/marketing/demo/SalesContactsDemo";
import SalesOutreachDemo from "@/components/marketing/demo/SalesOutreachDemo";
import SalesPipelineDemo from "@/components/marketing/demo/SalesPipelineDemo";
import OutreachAnalyticsDemo from "@/components/marketing/demo/OutreachAnalyticsDemo";
import { DesktopPlatformMenu, DesktopSolutionsMenu, MobilePlatformGroup, MobileSolutionsGroup } from "@/components/marketing/solutions-navigation";
import type { Solution } from "@/config/solutions";
import { MockWindow, ScaleToFit } from "@/components/marketing/demo/MockWindow";
import { ClientShell } from "@/components/marketing/demo/DealDashboardParts";

const DEMO_TABS = [
  { id: "developers", label: "Developers (Land Acquisition)" },
  { id: "acquisitions", label: "Real Estate Acquisition Groups" },
  { id: "sales", label: "Sales Teams (outside real estate)" },
];
const DEMO_TAB_INTRO: Record<string, { eyebrow: string; body: string }> = {
  developers: {
    eyebrow: "FOR DEVELOPERS · LAND ACQUISITION",
    body: "Find land sites that fit your acquisition criteria. Every parcel is screened on market, acreage and rent, and deal review, relationships, outreach and performance stay connected for your team.",
  },
  acquisitions: {
    eyebrow: "FOR REAL ESTATE ACQUISITION GROUPS",
    body: "Bring existing-property deals into the same workspace. Offering memorandums become dashboard rows, and each one is screened against your markets, site size and rent per unit.",
  },
  sales: {
    eyebrow: "FOR SALES TEAMS OUTSIDE REAL ESTATE",
    body: "Bookkeepers, insurance agencies and other sales teams get a General Sales workspace: an opportunity pipeline, a company CRM and Outlook campaigns, without real-estate deal screening.",
  },
};
function usePreviewMotion<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallScreen = window.matchMedia("(max-width: 768px)");
    let isInView = false;

    const updateMotion = () => {
      setShouldAnimate(
        isInView &&
          !reducedMotion.matches &&
          !smallScreen.matches &&
          document.visibilityState === "visible",
      );
    };

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          isInView = entry.isIntersecting;
          updateMotion();
        }, { rootMargin: "120px 0px" })
      : null;

    if (observer) {
      observer.observe(element);
    } else {
      isInView = true;
      updateMotion();
    }

    reducedMotion.addEventListener("change", updateMotion);
    smallScreen.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateMotion);

    return () => {
      observer?.disconnect();
      reducedMotion.removeEventListener("change", updateMotion);
      smallScreen.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateMotion);
    };
  }, []);

  return { ref, shouldAnimate };
}

const faqs = [
  [`What is ${BRAND_NAME}?`, `${BRAND_NAME} is operating leverage for lean acquisitions teams. It handles sourcing, screening, outreach, and tracking in the background so your people can focus on the deals most likely to succeed.`],
  [`Who is ${BRAND_NAME} for?`, `${BRAND_NAME} is built for real estate investment companies and sales teams in any industry that need to cover more ground without adding operational overhead.`],
  ["How does deal classification work?", `${BRAND_NAME} evaluates incoming opportunities against the acquisition criteria your team defines, then organizes the results so the strongest fits are ready for human review.`],
  ["Is my data private from other companies on the platform?", "Yes. Your data, criteria, contacts, and deal activity remain private to your organization."],
  [`Can I use ${BRAND_NAME} for outreach outside real estate?`, "Yes. The pipeline and outreach workflow can support sales teams in any industry, wherever opportunity screening and follow-up matter."],
  [`How much of the work does ${BRAND_NAME} take off my team?`, `${BRAND_NAME} handles sourcing, screening, and outreach automatically, so your team spends its time only on the deals that clear your criteria.`],
];

function Button({ children, href = "/contact", dark = false }: { children: ReactNode; href?: string; dark?: boolean }) {
  return (
    <a href={href} className={`inline-flex min-h-12 items-center justify-center rounded-full border px-5 text-sm font-semibold transition-all duration-300 ${dark ? "ll-home-primary-inverse" : "ll-home-primary"}`}>
      {children}
    </a>
  );
}

function OutreachCampaignsMockup() {
  const campaigns = [
    {
      name: "Broker introduction",
      subject: "Land site inquiry, {{targetMarket}}",
      audience: "Interested Broker",
      enrolled: "184 enrolled",
      status: "Active",
    },
    {
      name: "Staying top of mind",
      subject: "Still actively acquiring in {{targetMarket}}",
      audience: "Warm pipeline contacts",
      enrolled: "96 enrolled",
      status: "Paused",
    },
  ];

  return (
    <div className="ll-app-frame ll-outreach-campaigns">
      <div className="ll-outreach-campaigns-head">
        <div>
          <small>RELATIONSHIP WORKSPACE</small>
          <h3 className="font-serif">Campaigns</h3>
          <p>Build follow-up from your connected Outlook account.</p>
        </div>
        <button type="button"><Plus /> New campaign</button>
      </div>
      <div className="ll-outreach-campaigns-summary">
        <div className="ll-outreach-card ll-outreach-sender">
          <div className="ll-outreach-card-title"><span><Mail /></span><b>Sending account</b></div>
          <strong>Connected Outlook</strong>
          <small>{BRAND_DEMO_SENDER}</small>
          <em><CheckCircle2 /> Ready to send</em>
        </div>
        <div className="ll-outreach-card ll-outreach-ai">
          <div className="ll-outreach-card-title"><span><Sparkles /></span><b>Generate with AI</b></div>
          <p>Answer a few questions and generate a complete multi-step sequence.</p>
          <strong><Rocket /> Build a sequence</strong>
        </div>
      </div>
      <div className="ll-outreach-list-head"><b><Send /> Your campaigns</b><span>2 campaigns</span></div>
      <div className="ll-outreach-campaign-list">
        {campaigns.map((campaign) => (
          <article className="ll-outreach-card ll-outreach-campaign" key={campaign.name}>
            <div className="ll-outreach-campaign-icon"><Mail /></div>
            <div className="ll-outreach-campaign-copy">
              <div><b>{campaign.name}</b><em className={campaign.status === "Active" ? "is-active" : ""}>{campaign.status}</em></div>
              <p>{campaign.subject}</p>
              <small><Users /> {campaign.enrolled} <Tag /> {campaign.audience}</small>
            </div>
            <div className="ll-outreach-campaign-actions">
              <button type="button"><MessageSquare /> Steps</button>
              <button type="button" className="is-primary"><Rocket /> Launch</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function DripCampaignBuilderMockup() {
  const [activeStep, setActiveStep] = useState(1);
  const { ref: previewRef, shouldAnimate } = usePreviewMotion<HTMLDivElement>();
  const steps = [
    ["1", "Audience", "184 eligible contacts"],
    ["2", "Sequence", "3 email steps"],
    ["3", "Review & launch", "Ready to send"],
  ];

  useEffect(() => {
    if (!shouldAnimate) return;
    const interval = window.setInterval(() => setActiveStep((current) => (current + 1) % steps.length), 2800);
    return () => window.clearInterval(interval);
  }, [shouldAnimate, steps.length]);

  return (
    <ScaleToFit>
      <MockWindow path="/developer/outreach">
        <div ref={previewRef} className="ll-drip-builder ll-drip-fullscreen">
          <ClientShell active="Outreach Setup" expanded>
            <div className="ll-drip-screen">
              <header className="ll-drip-head">
                <div><small>OUTREACH SETUP / NEW CAMPAIGN</small><b>Build a drip campaign</b></div>
                <span>Draft <i>●</i></span>
              </header>
              <div className="ll-drip-tabs" role="tablist" aria-label="Campaign setup steps">
                {steps.map(([number, title, detail], index) => (
                  <button type="button" role="tab" aria-selected={activeStep === index} key={title} className={activeStep === index ? "is-active" : ""} onClick={() => setActiveStep(index)}>
                    <b>{number}</b><span>{title}<small>{detail}</small></span>
                  </button>
                ))}
              </div>
              <div className="ll-drip-content">
                <div className="ll-drip-primary-column">
                  <section className={`ll-drip-panel ${activeStep === 0 ? "is-current" : ""}`}>
                    <div className="ll-drip-panel-heading"><span className="ll-drip-number">1</span><div><small>TARGET AUDIENCE</small><h3>Who should receive this sequence?</h3></div></div>
                    <div className="ll-drip-audience-grid">
                      <div className="ll-drip-audience"><b>Interested Broker</b><span>CRM tag · North Carolina</span><strong>184 contacts eligible</strong></div>
                      <div className="ll-drip-audience"><b>Atlanta acquisition brokers</b><span>Saved geography · Georgia</span><strong>96 contacts eligible</strong></div>
                    </div>
                  </section>
                  <section className={`ll-drip-panel ll-drip-sequence-panel ${activeStep === 1 ? "is-current" : ""}`}>
                    <div className="ll-drip-panel-heading"><span className="ll-drip-number">2</span><div><small>SEQUENCE EDITOR</small><h3>Southeast Broker Introduction</h3></div><button type="button" className="ll-drip-add-step">+ Add step</button></div>
                    <div className="ll-drip-email-steps">
                      <article><div><b>STEP 1</b><span>Send immediately</span></div><label>Subject line<input value="A quick introduction to your Raleigh acquisitions" readOnly /></label><strong>Introduction and acquisition criteria</strong><p>Hi Marcus, I’m reaching out about our current search across the Triangle. We’re focused on well-located land and garden multifamily opportunities.</p></article>
                      <article><div><b>STEP 2</b><span>Wait 3 days</span></div><label>Subject line<input value="What we are looking for across the Triangle" readOnly /></label><strong>Share current acquisition focus</strong><p>Our team is reviewing sites in Raleigh, Durham, and nearby markets. I’d be glad to share our current size and location criteria.</p></article>
                      <article><div><b>STEP 3</b><span>Wait 7 days</span></div><label>Subject line<input value="Any upcoming opportunities in your pipeline?" readOnly /></label><strong>Ask about upcoming opportunities</strong><p>If you have a suitable property coming to market, send over the details and we can review it promptly with our acquisitions team.</p></article>
                    </div>
                  </section>
                </div>
                <aside className="ll-drip-settings-column">
                  <section className={`ll-drip-panel ${activeStep === 2 ? "is-current" : ""}`}>
                    <div className="ll-drip-panel-heading"><span className="ll-drip-number">3</span><div><small>SCHEDULE</small><h3>Delivery settings</h3></div></div>
                    <div className="ll-drip-setting-row"><span>Send window</span><b>Weekdays · 9:00 AM–4:00 PM</b></div>
                    <div className="ll-drip-setting-row"><span>Recipient time zone</span><b>Contact’s local time</b></div>
                    <div className="ll-drip-setting-row"><span>Stop on reply</span><b className="ll-drip-on">On</b></div>
                    <div className="ll-drip-setting-row"><span>Sequence duration</span><b>10 days · 3 messages</b></div>
                  </section>
                  <section className="ll-drip-panel ll-drip-sender-panel">
                    <div className="ll-drip-panel-heading"><span className="ll-drip-sender-check">✓</span><div><small>CONNECTED SENDER</small><h3>Outlook mailbox</h3></div></div>
                    <div className="ll-drip-sender"><i>MH</i><span><b>Morgan Hayes</b><small>{BRAND_DEMO_SENDER}</small></span><strong>Connected</strong></div>
                  </section>
                  <section className="ll-drip-launch-panel">
                    <div><b>Ready to launch</b><span>184 contacts · 3 emails · 10 days</span></div>
                    <button type="button" className="ll-drip-launch">Launch campaign <span>→</span></button>
                    <small>Campaign sends during the selected weekday window.</small>
                  </section>
                </aside>
              </div>
              <div className="ll-drip-window-foot"><span><i /> Connected Outlook account</span><b>Autosaved just now</b></div>
            </div>
          </ClientShell>
        </div>
      </MockWindow>
    </ScaleToFit>
  );
}

function AIAssistantMockup() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [isThinking, setIsThinking] = useState(false);
  const { ref: previewRef, shouldAnimate } = usePreviewMotion<HTMLDivElement>();

  const featuredQuestion = "Which Raleigh-area opportunities have projected YOC above 8% and the strongest rent comps, and what should I review next?";
  const featuredAnswer = "Cedar Ridge Assemblage in Wake County leads at 9.0% projected YOC and a $2.41 top rent PSF. South End Station in Mecklenburg County follows at 8.6% and $2.34. Cedar Ridge is ready for review, so I’d prioritize it for committee review and model the 280-unit plan next.";

  useEffect(() => {
    if (!shouldAnimate) {
      setMessages((current) => current.length ? current : [
        { role: "user", text: featuredQuestion },
        { role: "assistant", text: featuredAnswer },
      ]);
      setIsThinking(false);
      return;
    }

    let answerTimer: number | undefined;
    const playFeaturedAnswer = () => {
      setMessages([{ role: "user", text: featuredQuestion }]);
      setIsThinking(true);
      answerTimer = window.setTimeout(() => {
        setMessages([
          { role: "user", text: featuredQuestion },
          { role: "assistant", text: featuredAnswer },
        ]);
        setIsThinking(false);
      }, 1700);
    };

    const startTimer = window.setTimeout(playFeaturedAnswer, 700);
    const cycleTimer = window.setInterval(playFeaturedAnswer, 8200);
    return () => {
      window.clearTimeout(startTimer);
      if (answerTimer) window.clearTimeout(answerTimer);
      window.clearInterval(cycleTimer);
    };
  }, [featuredAnswer, featuredQuestion, shouldAnimate]);

  const submitQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmedQuestion },
      { role: "assistant", text: "I can help you find that across your deal pipeline." },
    ]);
    setQuestion("");
  };

  return (
    <div ref={previewRef} className="ll-ai-assistant" aria-label="Truss AI assistant preview">
      <div className="ll-ai-assistant-head">
        <div className="ll-ai-assistant-title">
          <span><b>Truss</b><small>Your multifamily development copilot</small></span>
        </div>
        <span className="ll-ai-assistant-close" aria-hidden="true"><X /></span>
      </div>
      <div className="ll-ai-assistant-messages" aria-live="polite">
        {messages.map((message, index) => (
          <div className={`ll-ai-message ${message.role === "user" ? "is-user" : "is-assistant"}`} key={`${message.role}-${index}`}>
            {message.text}
          </div>
        ))}
        {isThinking && (
          <div className="ll-ai-thinking" aria-label="Truss is reviewing the deal pipeline">
            <span /><span /><span />
          </div>
        )}
      </div>
      <form className="ll-ai-assistant-input" onSubmit={submitQuestion}>
        <input
          aria-label="Ask Truss a question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question..."
        />
        <button type="submit" aria-label="Send question"><Send /></button>
      </form>
    </div>
  );
}

function DashboardMockup({ compact = false }: { compact?: boolean }) {
  const [activeFilter, setActiveFilter] = useState("STATUS");
  const { ref: previewRef, shouldAnimate } = usePreviewMotion<HTMLDivElement>();
  useEffect(() => {
    if (!shouldAnimate) return;
    const filters = ["STATUS", "PRIORITY", "TYPE", "NEXT"];
    const interval = window.setInterval(() => {
      setActiveFilter((current) => filters[(filters.indexOf(current) + 1) % filters.length]);
    }, 3200);
    return () => window.clearInterval(interval);
  }, [shouldAnimate]);
  const columns = ["ID", "Status", "Priority", "Property Address", "Name", "YOC", "Deal", "Type", "Analyst Notes", "Summary", "Dev Notes", "Broker Notes", "Top Rent/Unit", "Top Rent PSF", "OCC T."];
  const rows = [
    ["#84", "Review", "High", "Cedar Ridge Assemblage|Raleigh-Cary, NC", "Cedar Ridge Assemblage", "7.8%", "Land", "Affordable", "Preliminary site plan received", "Strong infill opportunity", "Review density", "Seller timing noted", "$1,845", "$2.18", "YES"],
    ["#83", "Qualified", "High", "South End Station|Charlotte, NC", "South End Station", "8.6%", "Acquisition", "BTR", "Utility capacity confirmed", "Strong submarket demand", "Advance to review", "Offer due Friday", "$2,120", "$2.34", "YES"],
    ["#82", "Review", "Medium", "Ashley River Landing|Charleston, SC", "Ashley River Landing", "7.4%", "Land", "Conventional", "Traffic study pending", "Walkable mixed-use setting", "Confirm access", "Survey shared", "$1,765", "$2.06", "YES"],
    ["#81", "Qualified", "High", "Brookhaven Grove|Atlanta, GA", "Brookhaven Grove", "9.0%", "Acquisition", "Student", "Zoning verified", "Strong university demand", "Model 280 units", "Title review started", "$1,980", "$2.41", "YES"],
    ["#80", "Review", "Medium", "Crabtree Commons|Raleigh-Cary, NC", "Crabtree Commons", "7.1%", "Land", "Affordable", "Seller status confirmed", "Transit-oriented site", "Check assumptions", "Flexible close date", "$1,690", "$1.98", "YES"],
    ["#79", "Qualified", "Medium", "Peachtree Crossing|Atlanta, GA", "Peachtree Crossing", "8.3%", "Land", "Active Adult", "Demographic study complete", "Strong age-qualified demand", "Begin concept plan", "Offering package received", "$1,725", "$2.09", "YES"],
    ["#78", "Review", "Low", "Ashley River Landing|Charleston, SC", "Ashley River Landing", "7.0%", "Land", "BTR", "Environmental report added", "Coastal growth corridor", "Review flood map", "Current pricing confirmed", "$1,860", "$2.22", "YES"],
    ["#77", "Qualified", "High", "Westside Mill Lofts|Atlanta, GA", "Westside Mill Lofts", "8.8%", "Acquisition", "Conventional", "Comparable set refreshed", "Growing employment district", "Schedule review", "Financing terms available", "$1,925", "$2.27", "YES"],
    ["#76", "Review", "Medium", "South End Station|Charlotte, NC", "South End Station", "7.6%", "Land", "Student", "Enrollment data added", "University-area demand", "Verify unit mix", "Offering package uploaded", "$1,995", "$2.38", "YES"],
    ["#75", "Qualified", "High", "Cedar Ridge Assemblage|Raleigh-Cary, NC", "Cedar Ridge Assemblage", "9.1%", "Land", "Conventional", "Road access verified", "Strong commuter location", "Prepare initial terms", "Seller prefers a certain close", "$2,180", "$2.46", "YES"],
    ["#74", "Review", "Medium", "Savannah Oaks|Savannah, GA", "Savannah Oaks", "7.9%", "Acquisition", "Affordable", "Current rents modeled", "Established employment node", "Confirm assumptions", "Property report available", "$1,640", "$1.94", "YES"],
    ["#73", "Qualified", "Low", "Cumberland Creek Villas|Nashville, TN", "Cumberland Creek Villas", "8.1%", "Acquisition", "Active Adult", "Site plan reviewed", "Attractive basis", "Order property study", "Flexible diligence window", "$1,575", "$1.87", "YES"],
  ];
  return (
    <div ref={previewRef} className={`ll-window ll-analyst-real relative overflow-hidden rounded-[1.1rem] border border-white/15 bg-[#f7f9fa] text-[#182b3e] shadow-2xl ${compact ? "ll-dashboard-compact min-h-[280px]" : "min-h-[430px]"}`}>
      <div className="ll-analyst-head">
        <div><h3>Analyst Dashboard</h3><p>Review, analyze, and manage incoming land deals with AI-powered insights</p></div>
        <div className="ll-analyst-actions"><button type="button"><Plus /> Add New Deal</button><button type="button"><Download /> Export CSV</button></div>
      </div>
      <div className="ll-analyst-workspace">
        <div className="ll-analyst-toolbar">
          <label className="ll-analyst-search"><Search /><input aria-label="Search deals" placeholder="Search deals, brokers, locations..." /></label>
          <div className="ll-analyst-views"><button type="button" className="is-selected"><Table2 /> Table</button><button type="button"><List /> Pipeline</button><button type="button"><Map /> Map</button></div>
          <button type="button" className="ll-analyst-columns">Columns <b>29/40</b></button>
          {["STATUS", "PRIORITY", "TYPE", "NEXT"].map((filter) => <button type="button" key={filter} onClick={() => setActiveFilter(filter)} className={`ll-analyst-filter ${activeFilter === filter ? "is-active" : ""}`}>{filter}</button>)}
        </div>
        <div className="ll-analyst-table-scroll">
           <table className="ll-analyst-table"><thead><tr>{columns.map((column) => <th key={column}>{column}{column !== "ID" && <small>↕</small>}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`ll-cell-${index}`}>{index === 1 ? <b className={`ll-status ll-status-dot ${cell === "Qualified" ? "is-green" : "is-yellow"}`} aria-label={cell} title={cell}><span className="sr-only">{cell}</span></b> : index === 7 ? <b className="ll-type">{cell}</b> : index === 8 ? <b className="ll-notes">{cell}</b> : cell.includes("|") ? cell.split("|").map((line, i) => <span key={line} className={i === 0 ? "ll-address" : "ll-subaddress"}>{line}</span>) : cell}</td>)}</tr>)}</tbody></table>
        </div>
      </div>
    </div>
  );
}

function PipelineWorkspaceMockup() {
  const stages = [
    { name: "New", count: "14", cards: [["Cedar Ridge Assemblage", "Raleigh-Cary, NC", "9.0%", "High"], ["South End Station", "Charlotte, NC", "7.1%", "Medium"]] },
    { name: "Qualified", count: "8", cards: [["Ashley River Landing", "Charleston, SC", "9.0%", "Review"], ["Brookhaven Grove", "Atlanta, GA", "8.6%", "Strong fit"]] },
    { name: "Due Diligence", count: "5", cards: [["Crabtree Commons", "Raleigh-Cary, NC", "9.1%", "Survey due"]] },
    { name: "Closing", count: "2", cards: [["Westside Mill Lofts", "Atlanta, GA", "8.8%", "Terms sent"]] },
  ];

  return (
    <div className="ll-demo-page ll-pipeline-page">
      <div className="ll-demo-page-head">
        <div><small>SALES WORKSPACE</small><h3>Pipeline</h3><p>Track opportunities from first contact through close.</p></div>
        <button type="button">+ NEW OPPORTUNITY</button>
      </div>
      <div className="ll-pipeline-summary"><span><b>29</b> active opportunities</span><span><b>$43.8M</b> weighted pipeline</span><span><b>68%</b> in motion this month</span></div>
      <div className="ll-pipeline-board">
        {stages.map((stage) => (
          <div className="ll-pipeline-column" key={stage.name}>
            <div className="ll-pipeline-column-head"><b>{stage.name}</b><span>{stage.count}</span></div>
            {stage.cards.map(([title, location, yoc, note]) => (
              <div className="ll-pipeline-opportunity" key={title}>
                <strong>{title}</strong><small>{location}</small><div><b>{yoc} YOC</b><em>{note}</em></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function OutreachWorkspaceMockup() {
  const campaigns = [
    ["Southeast Broker Introduction", "184 contacts", "72%", "Due today"],
    ["Q3 Relationship Follow-up", "96 contacts", "48%", "12 queued"],
    ["Multifamily Deal Flow", "63 contacts", "31%", "Healthy"],
  ];

  return (
    <div className="ll-demo-page ll-outreach-page">
      <div className="ll-demo-page-head">
        <div><small>RELATIONSHIP WORKSPACE</small><h3>Outreach</h3><p>Keep follow-up moving without losing the deal context.</p></div>
        <button type="button">+ NEW CAMPAIGN</button>
      </div>
      <div className="ll-demo-tabs"><b>Campaigns</b><span>Sequences</span><span>Senders</span><span>Templates</span></div>
      <div className="ll-outreach-list">
        <div className="ll-outreach-list-head"><span>CAMPAIGN</span><span>AUDIENCE</span><span>PROGRESS</span><span>NEXT ACTION</span><span>STATUS</span></div>
        {campaigns.map(([name, audience, progress, next], index) => (
          <div className="ll-outreach-row" key={name}>
            <strong>{name}<small>{index === 0 ? "Broker relationships" : index === 1 ? "Warm pipeline contacts" : "New deal alerts"}</small></strong>
            <span>{audience}</span>
            <span className="ll-outreach-progress"><i style={{ width: progress }} /><b>{progress}</b></span>
            <span>{next}</span>
            <em>ACTIVE</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataHubMockup() {
  const sources = [
    ["HelloData", "Market comparables", "1,284 comps", "Synced 8 min ago", "LIVE"],
    ["HUD", "Affordable housing data", "12,406 records", "Synced today", "LIVE"],
    ["Census + FRED", "Market and economic signals", "48 indicators", "Synced today", "LIVE"],
  ];

  return (
    <div className="ll-demo-page ll-datahub-page">
      <div className="ll-demo-page-head">
        <div><small>PROPRIETARY INTELLIGENCE</small><h3>Data Hub</h3><p>Bring market, property, and deal signals into one decision layer.</p></div>
        <button type="button">REFRESH SOURCES</button>
      </div>
      <div className="ll-datahub-metrics"><div><small>ACTIVE SOURCES</small><b>8</b></div><div><small>LAST SYNC</small><b>8 min</b></div><div><small>RECORDS INDEXED</small><b>1.8M</b></div><div><small>HEALTH</small><b className="is-good">99.8%</b></div></div>
      <div className="ll-datahub-sources">
        {sources.map(([name, description, records, sync, status]) => (
          <div className="ll-datahub-source" key={name}><span className="ll-datahub-source-icon">◈</span><div><strong>{name}</strong><small>{description}</small></div><span><b>{records}</b><small>{sync}</small></span><em>{status}</em></div>
        ))}
      </div>
    </div>
  );
}

function ICMemoMockup() {
  return (
    <div className="ll-demo-page ll-memo-page">
      <div className="ll-memo-toolbar"><span><b>IC MEMO</b> / Cedar Ridge Assemblage</span><span><em>READY FOR REVIEW</em><button type="button">EXPORT PDF</button><button type="button">SHARE WITH IC</button></span></div>
      <div className="ll-memo-document">
        <div className="ll-memo-cover">
          <div className="ll-memo-brand"><span>NR</span><b>Northwind Residential</b><i /> <small>INVESTMENT SUMMARY</small></div>
          <div className="ll-memo-cover-line"><div><small>MULTIFAMILY ACQUISITION OPPORTUNITY</small><h3>Cedar Ridge Assemblage</h3><p>Wake County <i>◆</i> Raleigh, NC <i>◆</i> Raleigh-Cary MSA</p></div><span>Prepared for <b>Investment Committee</b><small>September 16, 2026</small></span></div>
        </div>
        <div className="ll-memo-metrics"><div><small>PRODUCT TYPE</small><b>3-Story<br />Garden</b><span>Surface-Parked</span></div><div><small>UNITS / NET<br />DENSITY</small><b>240</b><span>30.0 DU/A</span></div><div><small>TOTAL DEV. COST</small><b>$55.9M</b><span>$232,870 / unit</span></div><div><small>AUTO YIELD-ON-<br />COST</small><b className="is-gold">6.71%</b><span>Year-1 stabilized</span></div><div><small>AUTO IRR (5-YR<br />HOLD)</small><b className="is-gold">14.4%</b><span>5.25% exit cap</span></div><div><small>FEASIBILITY READ</small><b className="is-green">● PURSUING</b></div></div>
        <div className="ll-memo-grid">
          <div>
            <section className="ll-memo-block"><h4><i>01</i> PROPERTY &amp; PROGRAM</h4><dl><div><dt>Gross / Net Acres</dt><dd>10.5 / 8.0</dd></div><div><dt>Zoning</dt><dd>CR (Conditional Rezoning)</dd></div><div><dt>Proposed Units</dt><dd>240</dd></div><div><dt>Buildings / Stories</dt><dd>10 / 3-story</dd></div><div><dt>Parking (surface)</dt><dd>~408 spaces (1.7 / unit)</dd></div><div><dt>Land Basis (assumed)</dt><dd>$25,000 / unit (inland)</dd></div></dl></section>
            <section className="ll-memo-block"><h4><i>02</i> UNIT MIX</h4><table><thead><tr><th>TYPE</th><th>% MIX</th><th>AVG SF</th><th>ASKING RENT</th></tr></thead><tbody><tr><td>1 Bed / 1 Bath</td><td>60%</td><td>800</td><td>$1,600</td></tr><tr><td>2 Bed / 2 Bath</td><td>40%</td><td>1,050</td><td>$2,200</td></tr><tr className="is-total"><td>Blended</td><td>100%</td><td>905</td><td>$1,853</td></tr></tbody></table></section>
            <section className="ll-memo-block"><h4><i>03</i> DEVELOPMENT COST SUMMARY</h4><table><thead><tr><th>CATEGORY</th><th>TOTAL</th><th>/ UNIT</th></tr></thead><tbody><tr><td>Land Basis</td><td>$6,000,000</td><td>$25,000</td></tr><tr><td>Hard Cost</td><td>$39,360,000</td><td>$164,000</td></tr><tr><td>Soft Costs (15%)</td><td>$5,904,000</td><td>$24,600</td></tr><tr><td>Financing &amp; Carry</td><td>$2,361,600</td><td>$9,840</td></tr><tr><td>Fees &amp; Contingency</td><td>$2,263,200</td><td>$9,430</td></tr><tr className="is-total"><td>Total Development Cost</td><td>$55,888,800</td><td>$232,870</td></tr></tbody></table></section>
            <section className="ll-memo-block"><h4><i>04</i> CAPITAL STACK (ILLUSTRATIVE)</h4><table><thead><tr><th>SOURCE</th><th>%</th><th>AMOUNT</th></tr></thead><tbody><tr><td>Senior Construction Loan</td><td>65%</td><td>$36,327,720</td></tr><tr><td>LP / Sponsor Equity</td><td>35%</td><td>$19,561,080</td></tr><tr className="is-total"><td>Total Capitalization</td><td>100%</td><td>$55,888,800</td></tr></tbody></table></section>
          </div>
          <div>
            <section className="ll-memo-block"><h4><i>05</i> YEAR-1 PRO FORMA</h4><dl><div><dt>Gross Potential Rent</dt><dd>$5,299,200</dd></div><div><dt>Other Income</dt><dd>$570,240</dd></div><div><dt>Vacancy (5.0%) / LTL (1.0%) / Concessions (1.0%)</dt><dd className="is-loss">−$370,944</dd></div><div><dt>Effective Gross Income</dt><dd>$5,498,496</dd></div><div><dt>Fixed Operating Expenses</dt><dd>$1,464,240</dd></div><div><dt>Insurance (inland)</dt><dd>$132,000</dd></div><div><dt>Management Fee (2.75%)</dt><dd>$151,208</dd></div><div className="is-total"><dt>Year-1 Net Operating Income</dt><dd>$3,751,047</dd></div></dl></section>
            <section className="ll-memo-block"><h4><i>06</i> RETURN ASSUMPTIONS &amp; AUTO IRR</h4><div className="ll-memo-assumptions"><span>Rent growth <b>3.00%</b>/yr</span><span>Other income growth <b>3.00%</b>/yr</span><span>Expense growth <b>2.75%</b>/yr</span><span>Hold period <b>5 yrs</b></span><span>Exit cap rate <b>5.25%</b></span></div><div className="ll-memo-irr"><small>5-YEAR AUTO IRR</small><strong>14.4%</strong><span>NOI growth + reversion at exit</span><em>Year-5 NOI: <b>$4.24M</b> · Reversion: <b>$83.3M</b></em></div></section>
            <section className="ll-memo-block"><h4><i>07</i> MARKET SNAPSHOT</h4><dl><div><dt>Submarket</dt><dd>West Cary / Wake County</dd></div><div><dt>3-mi population growth (’19–’24)</dt><dd>+14.2%</dd></div><div><dt>Median HH income (submarket)</dt><dd>$84,300</dd></div><div><dt>Comp set avg. asking rent / SF</dt><dd>$2.04</dd></div><div><dt>Competing pipeline (3 mi)</dt><dd>1 project, 180 units</dd></div></dl></section>
          </div>
        </div>
        <section className="ll-memo-thesis"><h4><i>08</i> INVESTMENT THESIS</h4><p>Cedar Ridge Assemblage pairs an illustrative rezoning scenario with strong Raleigh-Cary demand, underwriting to a Year-1 Auto-YOC of 6.71% and a 5-year Auto-IRR of 14.4% at a 5.25% exit cap.</p></section>
        <div className="ll-memo-powered">Powered by <b>{BRAND_NAME}</b></div>
      </div>
    </div>
  );
}

function SecureWorkspaceMockup() {
  const controls = [
    ["Deal criteria", "Private to Investment Company", "LOCKED"],
    ["Contacts & relationships", "Visible to your team only", "LOCKED"],
    ["Outreach activity", "Scoped to your workspace", "PROTECTED"],
  ];

  return (
    <div className="ll-security-visual" aria-label="Private Investment Company workspace preview">
      <div className="ll-security-visual-head">
        <div><span className="ll-security-lock">⌑</span><b>{`${BRAND_NAME.toUpperCase()} / WORKSPACE CONTROL`}</b></div>
        <span className="ll-security-live"><i /> PRIVATE BY DEFAULT</span>
      </div>
      <div className="ll-security-visual-body">
        <div className="ll-security-workspace-card">
          <small>YOUR ORGANIZATION</small>
          <div><span className="ll-security-org-mark">◈</span><div><b>Investment Company</b><span>Acquisitions workspace</span></div><strong>ACTIVE</strong></div>
        </div>
        <div className="ll-security-control-list">
          {controls.map(([title, detail, status]) => <div key={title}><span className="ll-security-check">✓</span><div><b>{title}</b><small>{detail}</small></div><em>{status}</em></div>)}
        </div>
        <div className="ll-security-visual-foot"><span>Workspace boundary</span><b>Only your team can view and act on this data</b><i>↗</i></div>
      </div>
    </div>
  );
}

function SharedWorkspaceMockup() {
  return (
    <div className="ll-shared-workspace-visual" aria-label={`Shared ${BRAND_NAME} workspace product preview`}>
      <div className="ll-shared-workspace-topbar">
        <div><span className="ll-shared-workspace-mark">◈</span><b>INVESTMENT COMPANY</b><small>{WORKSPACE_LABEL}</small></div>
        <span className="ll-shared-workspace-user">MH <i /></span>
      </div>
      <div className="ll-shared-workspace-content">
        <aside>
          <small>WORKSPACE</small>
          <b className="is-active">◫ Deal Dashboard</b>
          <span>▦ Pipeline</span>
          <span>♧ Contacts</span>
          <span>⌁ Outreach</span>
          <span>◈ Data Hub</span>
          <div className="ll-shared-workspace-aside-note"><small>TEAM ACTIVITY</small><b>18 deals reviewed</b><span>this week</span></div>
        </aside>
        <main>
          <div className="ll-shared-workspace-heading"><div><small>DEAL DASHBOARD</small><h3>Good decisions, in one view.</h3></div><button type="button">+ ADD DEAL</button></div>
          <div className="ll-shared-workspace-metrics"><div><small>ACTIVE DEALS</small><b>29</b><span>+6 this month</span></div><div><small>QUALIFIED</small><b>8</b><span>Ready for review</span></div><div><small>PROJECTED YOC</small><b>8.6%</b><span>Portfolio average</span></div></div>
          <div className="ll-shared-workspace-table"><div><span>OPPORTUNITY</span><span>OWNER</span><span>STATUS</span><span>YOC</span></div><div><b>Cedar Ridge Assemblage<small>Raleigh-Cary, NC · 280 units</small></b><span>MH</span><em>Qualified</em><strong>9.0%</strong></div><div><b>South End Station<small>Charlotte, NC · 216 units</small></b><span>MH</span><em>Review</em><strong>8.6%</strong></div><div><b>Ashley River Landing<small>Charleston, SC · 184 units</small></b><span>MH</span><em>New</em><strong>7.8%</strong></div></div>
        </main>
      </div>
    </div>
  );
}

function DealOpsMachine() {
  return (
    <div className="ll-machine" data-testid="hero-demo">
      <IntakeToPipelineDemo />
    </div>
  );
}

export default function MarketingHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [demoTab, setDemoTab] = useState("developers");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactError, setContactError] = useState("");
  const handleSolutionNavigation = (solution: Solution) => {
    if (!solution.homepageTab) return;
    setDemoTab(solution.homepageTab);
    requestAnimationFrame(() => {
      document.getElementById("demo")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  };
  useEffect(() => {
    const audienceToTab: Record<string, string> = {
      developers: "developers",
      "acquisition-groups": "acquisitions",
      "sales-teams": "sales",
    };
    const audience = new URLSearchParams(window.location.search).get("audience");
    const tab = audience ? audienceToTab[audience] : undefined;
    if (!tab) return;
    setDemoTab(tab);
    if (window.location.hash === "#demo") {
      requestAnimationFrame(() => {
        document.getElementById("demo")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  }, []);
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <div id="landlinq-home" className="min-h-[100dvh] overflow-hidden bg-white text-[#000914]">
      <header className="absolute inset-x-0 top-0 z-30">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10" aria-label="Main navigation">
          <a href="/" aria-label={`${BRAND_NAME} home`}><BrandWordmark inverse iconClassName="h-9 w-9" textClassName="text-[1.35rem]" /></a>
          <div className="hidden items-center gap-2 lg:gap-3 md:flex">
            <DesktopPlatformMenu />
            <DesktopSolutionsMenu onNavigate={handleSolutionNavigation} />
            <Link href="/demo" className="ll-marketing-demo-link inline-flex min-h-11 items-center rounded-full border border-[#3286C8] bg-[#3286C8] px-4 text-sm font-semibold text-white transition-all hover:border-[#3286C8] hover:bg-white hover:text-[#3286C8]">Book a demo</Link>
            <Link href="/login" className="inline-flex items-center rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-landlinq-blue transition-all duration-300 hover:bg-transparent hover:text-white">Log In</Link>
          </div>
           <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="ll-mobile-menu-button inline-flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground md:hidden">{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
                {menuOpen && <div className="ll-mobile-menu-panel absolute inset-x-4 top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-white/15 bg-primary p-4 shadow-xl md:hidden"><div className="flex flex-col gap-1"><MobilePlatformGroup onCloseMenu={() => setMenuOpen(false)} /><MobileSolutionsGroup onNavigate={handleSolutionNavigation} onCloseMenu={() => setMenuOpen(false)} /><Link href="/demo" onClick={() => setMenuOpen(false)} className="ll-marketing-demo-link inline-flex min-h-12 items-center justify-center rounded-lg border border-[#3286C8] bg-[#3286C8] px-3 text-center text-sm font-semibold text-white transition-all hover:border-[#3286C8] hover:bg-white hover:text-[#3286C8]">Book a demo</Link><Link href="/login" onClick={() => setMenuOpen(false)} className="ll-mobile-menu-login inline-flex min-h-12 items-center justify-center rounded-lg border border-white bg-white px-3 py-3 text-center text-sm font-semibold text-landlinq-blue transition-all duration-300 hover:bg-transparent hover:text-white">Log In</Link></div></div>}
        </nav>
      </header>

      <main>
         <section className="relative bg-primary px-4 pb-12 pt-24 text-primary-foreground sm:px-8 sm:pb-24 sm:pt-32 lg:px-10">
          <div className="relative mx-auto max-w-7xl">
             <div className="flex flex-col items-center gap-8 sm:gap-10 lg:gap-12">
              <div className="max-w-5xl text-center">
                  <h1 className="ll-reveal text-balance text-[clamp(2rem,9vw,3.75rem)] font-semibold leading-[0.96] tracking-[-0.06em] sm:text-7xl lg:text-[4.5rem]">Your&nbsp;<span className="whitespace-nowrap">supercharged</span><br /><span className="text-[#55C3E9]">acquisitions operating system.</span></h1>
                 <p className="ll-reveal ll-delay-2 mx-auto mt-5 max-w-lg text-base leading-6 text-white/68 sm:mt-6 sm:text-lg sm:leading-7">{BRAND_NAME} opens the lead funnel wide, screens opportunities against your criteria, and keeps outreach moving, so lean teams can do more with less.</p>
                 <div className="ll-reveal ll-delay-3 mt-6 flex w-full max-w-xs flex-col justify-center gap-3 sm:mt-7 sm:max-w-none sm:flex-row"><Button dark>Get in touch</Button><Link href="/login" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-landlinq-blue">Log In</Link></div>
              </div>
               <div className="ll-reveal ll-delay-2 ll-hero-dashboard relative w-full max-w-[1120px]">
                <DealOpsMachine />
              </div>
            </div>
          </div>
        </section>

        <MarketingHeroStats />

        <section
          aria-labelledby="acquisitions-autopilot-title"
          data-reveal
          data-testid="section-acquisitions-autopilot"
          className="ll-scroll-reveal border-b border-[#B8C4CF]/60 bg-[#EAF5FB] px-4 py-16 sm:px-8 sm:py-20 lg:px-10"
        >
          <div className="mx-auto grid max-w-7xl gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
            <div className="max-w-xl">
              <span className="ll-eyebrow">ACQUISITIONS ON AUTOPILOT</span>
              <h2
                id="acquisitions-autopilot-title"
                className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl"
              >
                You get a bigger acquisitions team without the headcount.
              </h2>
            </div>
            <div className="max-w-2xl space-y-4 text-base leading-7 text-[#5B6B79] sm:text-lg sm:leading-8">
              <p>
                {BRAND_NAME} plugs into your inbox and runs your acquisitions outreach on autopilot. It sends
                personalized drip campaigns to every broker in the states you pick, and to anyone else you
                want to stay top of mind with: GCs, engineers, architects.
              </p>
              <p>
                When deals come back in, it screens them right away against your criteria, like county,
                minimum acreage and minimum rents, so your team only spends time on the ones that fit.
              </p>
            </div>
          </div>
        </section>

         <section id="demo" className="ll-journey scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36" aria-labelledby="platform-journey-title">
           <div className="mx-auto max-w-7xl">
             <div className="ll-journey-intro">
               <div>
                 <span className="ll-eyebrow">{DEMO_TAB_INTRO[demoTab].eyebrow}</span>
                 <h2 id="platform-journey-title" className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">One system from first look to next move.</h2>
               </div>
                <p className="max-w-sm text-sm leading-7 text-[#000914] sm:text-base">{DEMO_TAB_INTRO[demoTab].body}</p>
             </div>
             <div className="mb-12 sm:mb-16">
               <DemoSectionTabs tabs={DEMO_TABS} value={demoTab} onChange={setDemoTab} idBase="platform-demo" />
             </div>
             {demoTab === "developers" && (
             <div role="tabpanel" id="platform-demo-panel-developers" aria-labelledby="platform-demo-tab-developers" className="ll-journey-route">
                  <article id="journey-deal-dashboard" className="ll-journey-step">
                 <div className="ll-step-copy">
                   <span className="ll-eyebrow">DEAL DASHBOARD</span>
                   <h3>See every opportunity clearly.</h3>
                   <p>Screen incoming land deals, compare the signals that matter, and move the strongest opportunities forward.</p>
                 </div>
                 <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><DashboardFilterDemo /></div>
               </article>
                  <article id="journey-screening" className="ll-journey-step" data-testid="journey-screening">
                 <div className="ll-step-copy">
                   <span className="ll-eyebrow">SCREENING</span>
                   <h3>Every deal checked against every partner.</h3>
                   <p>Market, acreage and rent rules run the moment a deal lands, so each partner sees a clear Pursuing, Review or Passed with the reason attached.</p>
                 </div>
                 <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><CriteriaScreeningDemo /></div>
               </article>
                 <article id="journey-auto-yoc" className="ll-journey-step">
                  <div className="ll-step-copy">
                    <span className="ll-eyebrow">AUTO YOC</span>
                    <h3>Underwrite a deal with your assumptions.</h3>
                    <p>Set product-specific costs, operating assumptions, unit mix, and exit inputs so every opportunity is measured against the way your team invests.</p>
                  </div>
                  <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><AutoYocDemo /></div>
                </article>
                <article id="journey-drip-campaign" className="ll-journey-step">
                  <div className="ll-step-copy">
                    <span className="ll-eyebrow">DRIP CAMPAIGNS</span>
                    <h3>Build follow-up once. Keep it moving.</h3>
                    <p>Choose an audience, write a multi-step sequence, and launch automatic follow-up from your connected Outlook account.</p>
                  </div>
                  <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><DripCampaignBuilderMockup /></div>
                </article>
                <article className="ll-journey-step ll-step-chat">
                  <div className="ll-step-copy">
                    <span className="ll-eyebrow">AI ASSISTANT</span>
                    <h3>Ask the workspace what matters next.</h3>
                    <p>Use Truss to ask questions about your deals and get a direct answer without leaving the Investment Company workspace.</p>
                  </div>
                  <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><TrussStreamDemo /></div>
                </article>
             </div>
             )}
             {demoTab === "acquisitions" && (
             <DemoDatasetProvider variant="acquisition">
             <div role="tabpanel" id="platform-demo-panel-acquisitions" aria-labelledby="platform-demo-tab-acquisitions" className="ll-journey-route">
               <article className="ll-journey-step" data-testid="journey-acq-dashboard">
                 <div className="ll-step-copy">
                   <span className="ll-eyebrow">DEAL DASHBOARD</span>
                    <h3>See every opportunity clearly.</h3>
                    <p>Screen incoming land deals, compare the signals that matter, and move the strongest opportunities forward.</p>
                 </div>
                 <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><DashboardFilterDemo /></div>
               </article>
               <article className="ll-journey-step" data-testid="journey-acq-screening">
                 <div className="ll-step-copy">
                   <span className="ll-eyebrow">SCREENING</span>
                    <h3>Every deal checked against your criteria.</h3>
                    <p>Market, acreage and rent rules run the moment a deal lands, so each opportunity is marked Pursuing, Review or Passed with the reason attached.</p>
                 </div>
                 <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><CriteriaScreeningDemo /></div>
               </article>
                <article className="ll-journey-step" data-testid="journey-acq-auto-yoc">
                 <div className="ll-step-copy">
                    <span className="ll-eyebrow">AUTO YOC</span>
                    <h3>Underwrite a deal with your assumptions.</h3>
                    <p>Set product-specific costs, operating assumptions, unit mix, and exit inputs so every opportunity is measured against the way your team invests.</p>
                 </div>
                  <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><AutoYocDemo /></div>
                </article>
                <article className="ll-journey-step" data-testid="journey-acq-drip-campaign">
                  <div className="ll-step-copy">
                    <span className="ll-eyebrow">DRIP CAMPAIGNS</span>
                    <h3>Build follow-up once. Keep it moving.</h3>
                    <p>Choose an audience, write a multi-step sequence, and launch automatic follow-up from your connected Outlook account.</p>
                  </div>
                  <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><DripCampaignBuilderMockup /></div>
               </article>
               <article className="ll-journey-step" data-testid="journey-acq-truss">
                 <div className="ll-step-copy">
                   <span className="ll-eyebrow">AI ASSISTANT</span>
                   <h3>Ask what came in today.</h3>
                   <p>Ask Truss about new deals and get a direct summary of which properties fit and why others were passed.</p>
                 </div>
                 <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><TrussStreamDemo /></div>
               </article>
             </div>
             </DemoDatasetProvider>
             )}
              {demoTab === "sales" && (
                <div role="tabpanel" id="platform-demo-panel-sales" aria-labelledby="platform-demo-tab-sales" className="ll-journey-route">
                  <article className="ll-journey-step" data-testid="journey-sales-lead-finder">
                    <div className="ll-step-copy">
                      <span className="ll-eyebrow">LEAD FINDER</span>
                      <h3>Find prospects and bring the right people into your pipeline.</h3>
                      <p>Search company and contact records, review qualified leads, and keep every follow-up tied to the team CRM.</p>
                    </div>
                    <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><SalesContactsDemo /></div>
                  </article>
                  <article className="ll-journey-step" data-testid="journey-sales-ai-drip">
                    <div className="ll-step-copy">
                      <span className="ll-eyebrow">AI-WRITTEN DRIP EMAILS</span>
                      <h3>Write a tailored sequence and keep every next step visible.</h3>
                      <p>Draft follow-up for each audience, review the message, and include a booking link for the next conversation.</p>
                    </div>
                    <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><SalesOutreachDemo /></div>
                  </article>
                  <article className="ll-journey-step" data-testid="journey-sales-booking-link">
                    <div className="ll-step-copy">
                      <span className="ll-eyebrow">BOOKING LINK</span>
                      <h3>Give interested leads a clear way to book time.</h3>
                      <p>Share a branded scheduling link in the email sequence and route booked conversations to the right owner.</p>
                    </div>
                    <div className="ll-step-surface ll-surface-paper ll-step-surface--demo">
                      <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Scheduling link</div>
                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-sm font-semibold text-slate-900">Intro call with Jordan</div>
                          <div className="mt-1 text-xs text-slate-500">30 minutes · Choose an available time</div>
                          <div className="mt-4 break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-sky-800">deallinq.ai/book/jordan</div>
                        </div>
                        <div className="mt-3 text-xs text-slate-500">Example link shown for this product demo.</div>
                      </div>
                    </div>
                  </article>
                  <article className="ll-journey-step" data-testid="journey-sales-results">
                    <div className="ll-step-copy">
                      <span className="ll-eyebrow">RESULTS DASHBOARD</span>
                      <h3>See replies, bookings and campaign results together.</h3>
                      <p>Track outreach activity and team outcomes, then use the results to plan the next round of follow-up.</p>
                    </div>
                    <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><OutreachAnalyticsDemo /></div>
                  </article>
                  <article className="ll-journey-step" data-testid="journey-sales-crm-pipeline">
                    <div className="ll-step-copy">
                      <span className="ll-eyebrow">BUILT-IN CRM PIPELINE</span>
                      <h3>Move company opportunities from first contact to close.</h3>
                      <p>Keep contacts, owners, stages and next actions in one shared pipeline.</p>
                    </div>
                    <div className="ll-step-surface ll-surface-paper ll-step-surface--demo"><SalesPipelineDemo /></div>
                  </article>
                </div>
              )}
           </div>
         </section>

          <section id="company" data-reveal className="ll-scroll-reveal bg-background px-4 py-16 sm:px-8 sm:py-32 lg:px-10 lg:py-40"><div id="resources" className="mx-auto max-w-3xl scroll-mt-24"><div className="mb-10 sm:mb-14"><h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Know what you're getting.</h2></div><div className="divide-y divide-border border-y border-border">{faqs.map(([question, answer], i) => <div key={question}><button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold sm:gap-5 sm:py-6 sm:text-lg"><span>{question}</span><ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} /></button><div className={`grid transition-[grid-template-rows,opacity] duration-300 ${openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><p className="max-w-2xl pb-6 leading-7 text-muted-foreground">{answer}</p></div></div></div>)}</div></div></section>

          <section id="contact" data-reveal className="ll-scroll-reveal bg-muted/40 px-4 py-12 sm:px-8 sm:py-20 lg:px-10">
            <div className="mx-auto max-w-7xl rounded-3xl bg-primary p-5 text-primary-foreground sm:p-10 lg:p-12">
             <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
              <div>
                  <h2 className="max-w-2xl text-[clamp(2.25rem,8vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.05em]">See what a supercharged acquisitions team looks like.</h2>
                  <p className="mt-5 max-w-xl text-base leading-7 text-white/65">Tell us a little about what your team is trying to solve. We’ll be in touch.</p>
              </div>
               <form onSubmit={async (event) => {
                event.preventDefault();
                setContactStatus("sending");
                setContactError("");
                try {
                  const response = await fetch("/api/contact-inquiry", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(contactForm),
                  });
                  const result = await response.json().catch(() => ({}));
                  if (!response.ok) throw new Error(result.error || "We could not send your message.");
                  setContactStatus("success");
                } catch (error) {
                  setContactStatus("error");
                  setContactError(error instanceof Error ? error.message : "We could not send your message.");
                }
                }} className="ll-contact-form w-full max-w-[680px] justify-self-end rounded-3xl border border-white/20 p-5 sm:p-6">
                {contactStatus === "success" ? <p className="text-lg font-semibold text-white">Thanks — we’ll be in touch.</p> : <>
                   <div className="grid gap-4 sm:grid-cols-2">
                     <input aria-label="Your name" required value={contactForm.name} onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })} placeholder="Your name" className="h-14 rounded-full border border-white/25 bg-transparent px-6 text-base text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/60" />
                     <input aria-label="Your email" type="email" required value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} placeholder="you@company.com" className="h-14 rounded-full border border-white/25 bg-transparent px-6 text-base text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/60" />
                  </div>
                    <textarea aria-label="Your message" required rows={5} value={contactForm.message} onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })} placeholder="How can we help?" className="mt-4 min-h-[150px] w-full resize-none rounded-3xl border border-white/25 bg-transparent p-5 text-base leading-7 text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/60" />
                    <button type="submit" disabled={contactStatus === "sending"} className="ll-message-submit mt-4 inline-flex h-12 items-center rounded-full border border-transparent bg-white px-7 text-sm font-semibold text-primary transition-all disabled:opacity-60">{contactStatus === "sending" ? "Sending…" : "Send message"}</button>
                  {contactStatus === "error" && <p role="alert" className="mt-3 text-sm text-red-200">{contactError}</p>}
                </>}
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}