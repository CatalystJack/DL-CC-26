/**
 * Fictional marketing-preview data.
 * Every company, deal, address, person and email in this file is fictional and
 * is used exclusively by the animated product recreations on the marketing
 * site. Do not add real clients, investment companies, brokers or deals here.
 *
 * All demos show the investment-company (client) side of the app. The demo
 * company is the fictional "Northwind Residential".
 */

export const DEMO_COMPANY = "Northwind Residential";
export const DEMO_BROKER = { name: "Alex Rivera", email: "alex@oakridge-land.com", brokerage: "Oakridge Land Partners" };

export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/* ---------- pages/analyst-dashboard.tsx rows ---------- */

/** Status square letters used by the Analyst Dashboard (P / R / X / ?). */
export type DealStatus = "pursuing" | "reviewing" | "passed" | "unclassified";
export type DealKind = "Land" | "Acq";

export interface DemoDeal {
  id: number;
  name: string;
  address: string;
  city: string;
  county: string;
  status: DealStatus;
  priority?: number;
  kind: DealKind;
  productTypes: string[];
  price: number;
  acres: number;
  units: number;
  rentPsf: string;
  broker: string;
  /** "Target Market" pill in the deal drawer */
  targetMarket: boolean;
  /** Year built (existing properties only); drawer shows "—" when absent. */
  vintage?: number;
  /** Average in-place rent per unit shown in the drawer's Rent Metrics. */
  avgRentUnit?: string;
  /** Deal zoning (the app shows it on deal detail; it is not a screening criterion). */
  zoning?: string;
}

export const DEMO_NEW_DEAL: DemoDeal = {
  id: 1042,
  name: "Cedar Ridge Assemblage",
  address: "1840 Green Level Church Rd",
  city: "Cary, NC",
  county: "Wake County",
  status: "reviewing",
  kind: "Land",
  productTypes: ["Garden"],
  price: 3400000,
  acres: 14.2,
  units: 280,
  rentPsf: "$2.31",
  zoning: "RMF Multifamily",
  broker: DEMO_BROKER.name,
  targetMarket: true,
};

export const DEMO_PASSED_DEAL: DemoDeal = {
  id: 1039,
  name: "Pine Hollow Tract",
  address: "7120 McKee Rd",
  city: "Charlotte, NC",
  county: "Mecklenburg County",
  status: "passed",
  kind: "Land",
  productTypes: [],
  price: 1200000,
  acres: 4.1,
  units: 96,
  rentPsf: "$1.94",
  broker: "Jordan Lee",
  targetMarket: true,
};

export const DEMO_DEALS: DemoDeal[] = [
  { id: 1041, name: "Willow Creek Tract", address: "4201 Holly Springs Rd", city: "Apex, NC", county: "Wake County", status: "pursuing", priority: 1, kind: "Land", productTypes: ["Garden"], price: 2900000, acres: 11.6, units: 240, rentPsf: "$2.38", broker: "Sam Ortiz", targetMarket: true },
  { id: 1040, name: "Peachtree Crossing", address: "3150 Camp Creek Pkwy", city: "Atlanta, GA", county: "Fulton County", status: "reviewing", priority: 2, kind: "Acq", productTypes: ["Garden"], price: 5100000, acres: 18.0, units: 320, rentPsf: "$2.05", broker: "Casey Park", targetMarket: false },
  DEMO_PASSED_DEAL,
  { id: 1038, name: "Magnolia Trace", address: "1915 Bees Ferry Rd", city: "Charleston, SC", county: "Charleston County", status: "reviewing", kind: "Land", productTypes: ["Garden", "Townhome"], price: 4000000, acres: 15.3, units: 300, rentPsf: "$2.44", broker: DEMO_BROKER.name, targetMarket: true },
  { id: 1037, name: "Harbor Creek Land", address: "920 Old Hickory Blvd", city: "Nashville, TN", county: "Davidson County", status: "passed", kind: "Land", productTypes: [], price: 2200000, acres: 9.1, units: 190, rentPsf: "$1.92", broker: "Jordan Lee", targetMarket: false },
  { id: 1036, name: "Cypress Grove Site", address: "3600 Glenwood Ave", city: "Raleigh, NC", county: "Wake County", status: "reviewing", priority: 3, kind: "Land", productTypes: ["Townhome"], price: 1850000, acres: 7.4, units: 120, rentPsf: "$2.27", broker: "Sam Ortiz", targetMarket: true },
  { id: 1035, name: "Riverstone Flats", address: "1400 Chatham Pkwy", city: "Savannah, GA", county: "Chatham County", status: "passed", kind: "Acq", productTypes: [], price: 9600000, acres: 6.0, units: 212, rentPsf: "$1.81", broker: "Casey Park", targetMarket: false },
  { id: 1034, name: "Oakview Bend", address: "6250 Jones Bridge Rd", city: "Johns Creek, GA", county: "Fulton County", status: "reviewing", kind: "Land", productTypes: ["Garden"], price: 2650000, acres: 10.9, units: 210, rentPsf: "$2.33", broker: DEMO_BROKER.name, targetMarket: true },
];

/** Status filter counts shown in the Status popover (fictional). */
export const DEMO_STATUS_COUNTS = { unclassified: 4, pursuing: 13, reviewing: 19, passed: 52, pendingAddress: 2 };

/* ---------- pages/developer-criteria-settings.tsx ---------- */

export const DEMO_CRITERIA = {
  states: ["NC", "GA", "SC"],
  counties: ["Wake County, NC", "Fulton County, GA", "Mecklenburg County, NC"],
  radius: 3,
  vintage: 2015,
  minUnits: 150,
  productTypes: [
    { name: "Garden", isDefault: true, minAcres: 8, maxAcres: 20, minPsf: "2.10", minUnit: "1,650" },
    { name: "Townhome", isDefault: false, minAcres: 5, maxAcres: 12, minPsf: "2.25", minUnit: "1,900" },
  ],
};

/** Plain-language AI analysis shown in the deal drawer (fictional). */
export const DEMO_AI_REVIEW =
  "Clears your Garden criteria: 14.2 ac is inside the 8–20 ac range and rent comps average $2.31/SF against your $2.10/SF minimum. Wake County, NC is one of your target markets, so this deal is marked Review.";
export const DEMO_AI_PASSED =
  "Below minimum acreage for every active product type (4.1 ac vs. 5 ac Townhome / 8 ac Garden) and rent comps of $1.94/SF are under your minimums. Marked Passed.";

/* ---------- developer-crm (Company contacts) ---------- */

export interface DemoContact {
  name: string;
  email: string;
  phone: string;
  brokerage: string;
  region: string;
  state: string;
  category: string;
  sourceTags: string[];
  source: "DealLinq" | "Your contact";
  color: string;
}

export const DEMO_CONTACTS: DemoContact[] = [
  { name: "Alex Rivera", email: "alex@oakridge-land.com", phone: "(919) 641-2874", brokerage: "Oakridge Land Partners", region: "Wake County, NC", state: "NC", category: "Broker", sourceTags: ["Land", "Multifamily"], source: "DealLinq", color: "#3286C8" },
  { name: "Morgan Chen", email: "morgan@peachtreeadvisors.com", phone: "(404) 682-3197", brokerage: "Peachtree Property Advisors", region: "Fulton County, GA", state: "GA", category: "Broker", sourceTags: ["Land"], source: "DealLinq", color: "#22a06b" },
  { name: "Priya Shah", email: "priya@queencitycre.com", phone: "(704) 347-8251", brokerage: "Queen City Commercial", region: "Mecklenburg County, NC", state: "NC", category: "Broker", sourceTags: ["Multifamily"], source: "DealLinq", color: "#a855f7" },
  { name: "Jordan Lee", email: "jordan@blueheronrealty.com", phone: "(615) 730-4628", brokerage: "Blue Heron Realty", region: "Davidson County, TN", state: "TN", category: "Broker", sourceTags: ["Land", "BTR"], source: "DealLinq", color: "#f59e0b" },
  { name: "Taylor Brooks", email: "taylor@palmettopropertyco.com", phone: "(843) 619-7382", brokerage: "Palmetto Property Company", region: "Charleston County, SC", state: "SC", category: "Broker", sourceTags: ["Multifamily"], source: "DealLinq", color: "#ef4444" },
  { name: "Sam Ortiz", email: "sam@northwindresidential.com", phone: "(919) 503-1846", brokerage: "Northwind Residential", region: "Wake County, NC", state: "NC", category: "Owner", sourceTags: [], source: "Your contact", color: "#000914" },
];

/* ---------- pages/developer-analytics.tsx (client Analytics Dashboard) ---------- */

export const DEMO_ANALYTICS = {
  totalDeals: 128,
  pipelineValueM: 412.6,
  avgDealM: 3.2,
  conversion: 9.4,
  status: { passed: 71, review: 44, pursuing: 13 },
  messagesSent: 1284,
  brokers: [
    { name: "Alex Rivera", deals: 18, value: "$61.2M", avg: "$3.4M" },
    { name: "Jordan Lee", deals: 14, value: "$38.5M", avg: "$2.8M" },
    { name: "Casey Park", deals: 11, value: "$52.8M", avg: "$4.8M" },
    { name: "Sam Ortiz", deals: 9, value: "$24.3M", avg: "$2.7M" },
  ],
};

/* ---------- Truss (components/developer-assistant-chat.tsx) + live deal feed ---------- */

export const DEMO_FEED_NEW: DemoDeal[] = [
  DEMO_NEW_DEAL,
  { id: 1043, name: "Chatham Parkway Site", address: "64 Chatham Pkwy", city: "Savannah, GA", county: "Chatham County", status: "reviewing", kind: "Land", productTypes: ["Townhome"], price: 2100000, acres: 10.5, units: 168, rentPsf: "$2.29", broker: "Morgan Chen", targetMarket: true },
  { id: 1044, name: "Hickory Hollow Tract", address: "3 Bell Rd", city: "Nashville, TN", county: "Davidson County", status: "passed", kind: "Land", productTypes: [], price: 900000, acres: 3.2, units: 60, rentPsf: "$1.88", broker: "Jordan Lee", targetMarket: false },
];
export const DEMO_FEED_BASE: DemoDeal[] = DEMO_DEALS.slice(0, 5);

export const DEMO_TRUSS = {
  question: "What new deals came in today?",
  answer:
      "3 new deals hit your dashboard today. 1840 Green Level Church Rd (14.2 ac, $2.31/SF comps) and 64 Chatham Pkwy (10.5 ac) meet your criteria and are in Review. 3 Bell Rd was passed: 3.2 acres is below your 5 acre minimum.",
};
