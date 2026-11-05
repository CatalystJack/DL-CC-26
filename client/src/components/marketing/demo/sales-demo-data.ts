/**
 * Fictional preview data for the "Sales Teams (outside real estate)" tab.
 * Two fictional general_sales companies: a bookkeeping firm (pipeline demo) and an
 * insurance agency (contacts + outreach demos). Every business, person and number is
 * fictional and located in the Southeast; names and contact details are invented.
 */
import type { DemoBrand } from "./ui-replicas";

export const BOOKKEEPING_BRAND: DemoBrand = { short: "LB", line1: "Ledgerline", line2: "Bookkeeping" };
export const INSURANCE_BRAND: DemoBrand = { short: "HM", line1: "Harbor Mutual", line2: "Insurance" };

/** Stage names are configured per company in the real app (developer-pipeline.tsx); these are invented. */
export const SALES_STAGES = [
  { id: "lead", name: "New lead" },
  { id: "discovery", name: "Discovery call" },
  { id: "proposal", name: "Proposal sent" },
  { id: "won", name: "Signed" },
] as const;
export type SalesStageId = (typeof SALES_STAGES)[number]["id"];

export interface SalesOpportunity {
  id: string;
  title: string;
  contact: string;
  email: string;
  value: number;
  stage: SalesStageId;
  updated: string;
}

/** Bookkeeping firm pipeline: values are annual retainer amounts. */
export const SALES_OPPS: SalesOpportunity[] = [
  { id: "o1", title: "Monthly books – Briarwood Bakehouse", contact: "Omar Reyes", email: "omar@briarwoodbakehouse.com", value: 7200, stage: "lead", updated: "10/22/2026" },
  { id: "o2", title: "Payroll + books – Willow Creek Dental", contact: "Dana Whitfield", email: "dana@willowcreekdental.com", value: 14400, stage: "lead", updated: "10/19/2026" },
  { id: "o3", title: "Catch-up cleanup – Piedmont Auto Works", contact: "Priya Nair", email: "priya@piedmontautoworks.com", value: 9800, stage: "discovery", updated: "10/21/2026" },
  { id: "o4", title: "Quarterly close – Juniper Table Kitchen", contact: "Ben Carter", email: "ben@junipertable.com", value: 6000, stage: "discovery", updated: "10/16/2026" },
  { id: "o5", title: "Full-service books – Red Clay Landscapes", contact: "Maya Lin", email: "maya@redclaylandscapes.com", value: 18600, stage: "proposal", updated: "10/20/2026" },
  { id: "o6", title: "Monthly books – Fern & Field Yoga", contact: "Sam Ortiz", email: "sam@fernfieldyoga.com", value: 5400, stage: "won", updated: "10/14/2026" },
];

export const SALES_NEW_OPP: SalesOpportunity = {
  id: "o7",
  title: "Monthly books – Alder & Oak Coffee",
  contact: "Grace Kim",
  email: "grace@alderoakcoffee.com",
  value: 8400,
  stage: "lead",
  updated: "10/24/2026",
};

/** The card dragged from Discovery call to Proposal sent in the pipeline demo. */
export const SALES_DRAG_ID = "o3";

export interface SalesContact {
  name: string;
  email: string;
  phone: string;
  company: string;
  companySub: string;
  region: string;
  category: string;
  tags: string[];
  color: string;
}

/** Insurance agency contacts (policy prospects and clients). */
export const SALES_CONTACTS: SalesContact[] = [
  { name: "Priya Nair", email: "priya@piedmontautoworks.com", phone: "(919) 627-4381", company: "Piedmont Auto Works", companySub: "Garage liability quote", region: "Raleigh, North Carolina", category: "other", tags: ["Commercial", "Renewal Q4"], color: "#4A90E2" },
  { name: "Omar Reyes", email: "omar@briarwoodbakehouse.com", phone: "(512) 638-2749", company: "Briarwood Bakehouse", companySub: "BOP quote request", region: "Austin, Texas", category: "other", tags: ["Prospect"], color: "#0A2B4A" },
  { name: "Grace Kim", email: "grace@alderoakcoffee.com", phone: "(919) 382-6147", company: "Alder & Oak Coffee", companySub: "Website inquiry", region: "Durham, North Carolina", category: "other", tags: ["Prospect", "Quote sent"], color: "#2f73bb" },
  { name: "Ben Carter", email: "ben@junipertable.com", phone: "(704) 483-9216", company: "Juniper Table Kitchen", companySub: "Client since 2023", region: "Charlotte, North Carolina", category: "other", tags: ["Client"], color: "#7c8fa3" },
  { name: "Maya Lin", email: "maya@redclaylandscapes.com", phone: "(404) 571-3862", company: "Red Clay Landscapes", companySub: "Referral", region: "Atlanta, Georgia", category: "other", tags: ["Commercial", "Renewal Q4"], color: "#3286C8" },
  { name: "Dana Whitfield", email: "dana@willowcreekdental.com", phone: "(615) 462-7193", company: "Willow Creek Dental", companySub: "Inbound call", region: "Nashville, Tennessee", category: "other", tags: ["Prospect"], color: "#081729" },
  { name: "Sam Ortiz", email: "sam@fernfieldyoga.com", phone: "(843) 628-4517", company: "Fern & Field Yoga", companySub: "Client since 2025", region: "Charleston, South Carolina", category: "other", tags: ["Client", "Renewal Q4"], color: "#5f7382" },
];

export const SALES_SENDER = {
  name: "Jordan Lee",
  email: "jordan.lee@harbormutual.co",
  signature: "Jordan Lee · Licensed Agent, Harbor Mutual Insurance",
};

export interface SalesCampaign {
  id: string;
  name: string;
  subject: string;
  status: "active" | "paused";
  triggerTag?: string;
  enrolled: number;
  dayNumber: number;
}

export const SALES_CAMPAIGNS: SalesCampaign[] = [
  { id: "c1", name: "Policy renewal reminder", subject: "Your policy renews soon: let's review coverage", status: "paused", triggerTag: "Renewal Q4", enrolled: 0, dayNumber: 0 },
  { id: "c2", name: "Quote follow-up", subject: "Any questions on your quote?", status: "active", triggerTag: "Quote sent", enrolled: 23, dayNumber: 2 },
  { id: "c3", name: "Small business coverage intro", subject: "Is your business properly covered?", status: "paused", enrolled: 0, dayNumber: 1 },
];

export const SALES_AUDIENCE = 148;
export const SALES_LAUNCH_ENROLLED = 31;

export const SALES_ASSIST_PROMPT = "Make it warmer and keep it under 80 words.";
export const SALES_ASSIST_SUBJECT = "Quick coverage check before your renewal";
export const SALES_ASSIST_BODY =
  "Hi {{firstName}},\n\nYour policy for {{companyName}} renews soon. Before it does, I'd love to spend 15 minutes making sure your coverage still fits how the business runs today. Would next week work?\n\nThanks,\nJordan";

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
