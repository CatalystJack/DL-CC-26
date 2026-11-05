export type AudienceKey =
  | "real-estate-developers"
  | "real-estate-syndicators"
  | "insurance-brokers"
  | "accountants"
  | "bookkeepers"
  | "lenders"
  | "contractors"
  | "title-companies"
  | "property-managers"
  | "staffing-agencies"
  | "general-sales";

export interface AudienceDemoConfig {
  key: AudienceKey;
  label: string;
  eyebrow: string;
  angle: string;
  mergeFields: { label: string; token: string; value: string }[];
  recipient: string;
  recipientDetail: string;
  sample: string;
  sampleDetail: string;
  subject: string;
  replyFrom: string;
  reply: string;
  stages: [string, string, string, string];
  resultMetrics: [{ value: string; label: string }, { value: string; label: string }, { value: string; label: string }];
}

export const AUDIENCE_DEMOS: Record<AudienceKey, AudienceDemoConfig> = {
  "real-estate-developers": {
    key: "real-estate-developers", label: "Real-estate developers", eyebrow: "Land acquisition",
    angle: "Start land conversations with a real fit signal, then keep every reply attached to the parcel and next step.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Maya" },
      { label: "Target county", token: "{{county}}", value: "Wake County" },
      { label: "Parcel acres", token: "{{acreage}}", value: "18.6 acres" },
      { label: "Acquisition criteria", token: "{{project_type}}", value: "Townhome development" },
    ],
    recipient: "Maya Chen", recipientDetail: "Owner · Cedar Bend Holdings",
    sample: "Wake County land opportunity", sampleDetail: "18.6 acres · matches target criteria",
    subject: "A townhome site near Raleigh", replyFrom: "Maya Chen · property owner",
    reply: "We may consider a sale. The parcel next door could be available too—can you share your timeline?",
    stages: ["New owner", "Replied", "Site review", "Offer discussion"],
    resultMetrics: [{ value: "184", label: "owners contacted" }, { value: "26", label: "replies tracked" }, { value: "8", label: "sites in review" }],
  },
  "real-estate-syndicators": {
    key: "real-estate-syndicators", label: "Real-estate syndicators & acquisition groups", eyebrow: "Investment acquisitions",
    angle: "Bring brokers and off-market opportunities into one follow-up path, tied to the criteria your team is actively buying.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Daniel" },
      { label: "Market", token: "{{market}}", value: "Charlotte, NC" },
      { label: "Asset type", token: "{{asset_type}}", value: "Multifamily" },
      { label: "Unit target", token: "{{unit_range}}", value: "80–140 units" },
    ],
    recipient: "Daniel Ruiz", recipientDetail: "Investment sales · Piedmont Realty",
    sample: "Juniper Court Apartments", sampleDetail: "112 units · Charlotte, NC",
    subject: "Acquisition criteria for Charlotte multifamily", replyFrom: "Daniel Ruiz · investment sales",
    reply: "I have a 112-unit property coming up next month. I can send the overview under NDA.",
    stages: ["Broker lead", "Offering received", "Underwriting", "LOI / diligence"],
    resultMetrics: [{ value: "96", label: "broker contacts" }, { value: "19", label: "opportunities received" }, { value: "5", label: "in underwriting" }],
  },
  "insurance-brokers": {
    key: "insurance-brokers", label: "Insurance brokers", eyebrow: "Commercial coverage",
    angle: "Make renewals and referral outreach specific to the account, policy date, and coverage conversation.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Elena" },
      { label: "Business", token: "{{company}}", value: "Northline Fabrication" },
      { label: "Renewal date", token: "{{renewal_date}}", value: "September 1" },
      { label: "Coverage", token: "{{coverage_type}}", value: "General liability" },
    ],
    recipient: "Elena Brooks", recipientDetail: "Operations director · Northline Fabrication",
    sample: "Commercial policy review", sampleDetail: "General liability · renews September 1",
    subject: "Planning ahead for Northline’s September renewal", replyFrom: "Elena Brooks · Northline Fabrication",
    reply: "Good timing. We have added two locations and should review the limits before renewal.",
    stages: ["Prospect", "Conversation", "Quote prepared", "Bound / renewed"],
    resultMetrics: [{ value: "142", label: "accounts contacted" }, { value: "31", label: "renewal conversations" }, { value: "12", label: "quotes prepared" }],
  },
  accountants: {
    key: "accountants", label: "Accountants", eyebrow: "Client development",
    angle: "Turn introductions and business-owner outreach into a visible pipeline, without losing the context behind each conversation.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Priya" },
      { label: "Business", token: "{{company}}", value: "Harborlight Foods" },
      { label: "Referral source", token: "{{referral_source}}", value: "Mason & Cole" },
      { label: "Service focus", token: "{{service}}", value: "Quarterly reporting" },
    ],
    recipient: "Priya Nair", recipientDetail: "Founder · Harborlight Foods",
    sample: "Quarterly reporting support", sampleDetail: "Referred by Mason & Cole",
    subject: "An introduction from Mason & Cole", replyFrom: "Priya Nair · Harborlight Foods",
    reply: "We are reviewing our reporting process this quarter. Could we compare approaches next week?",
    stages: ["Introduction", "Discovery", "Engagement sent", "Client onboarded"],
    resultMetrics: [{ value: "78", label: "businesses reached" }, { value: "17", label: "discovery calls" }, { value: "6", label: "engagements sent" }],
  },
  bookkeepers: {
    key: "bookkeepers", label: "Bookkeepers", eyebrow: "Small-business outreach",
    angle: "Reach owners with a relevant bookkeeping offer and turn positive replies into clear onboarding follow-through.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Marcus" },
      { label: "Business", token: "{{company}}", value: "Goodfield Studio" },
      { label: "Team size", token: "{{team_size}}", value: "9 employees" },
      { label: "Service fit", token: "{{service_fit}}", value: "Monthly close" },
    ],
    recipient: "Marcus Lee", recipientDetail: "Owner · Goodfield Studio",
    sample: "Monthly close support", sampleDetail: "9-person creative studio",
    subject: "A cleaner month-end for Goodfield", replyFrom: "Marcus Lee · Goodfield Studio",
    reply: "We are behind on reconciliations. Can you outline what you would need to get started?",
    stages: ["Target account", "Replied", "Scope shared", "Onboarding"],
    resultMetrics: [{ value: "126", label: "owners contacted" }, { value: "24", label: "replies received" }, { value: "9", label: "scopes shared" }],
  },
  lenders: {
    key: "lenders", label: "Lenders", eyebrow: "Borrower relationships",
    angle: "Keep borrower and referral-partner follow-up tied to financing need, requested amount, and readiness.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Jordan" },
      { label: "Business", token: "{{company}}", value: "Alder Street Partners" },
      { label: "Financing need", token: "{{loan_purpose}}", value: "Commercial acquisition" },
      { label: "Target amount", token: "{{loan_amount}}", value: "$2.4M" },
    ],
    recipient: "Jordan Patel", recipientDetail: "Managing partner · Alder Street",
    sample: "Commercial acquisition financing", sampleDetail: "$2.4M target · initial inquiry",
    subject: "Financing for Alder Street’s acquisition", replyFrom: "Jordan Patel · Alder Street Partners",
    reply: "We are under contract and need to compare terms this week. I can send the rent roll today.",
    stages: ["New inquiry", "Documents requested", "Terms shared", "Funded"],
    resultMetrics: [{ value: "63", label: "borrowers / partners" }, { value: "14", label: "active inquiries" }, { value: "$8.7M", label: "in financing review" }],
  },
  contractors: {
    key: "contractors", label: "Contractors", eyebrow: "Project opportunities",
    angle: "Follow up with owners and project partners using the actual site, scope, and bid window—not a generic check-in.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Tessa" },
      { label: "Project", token: "{{project_name}}", value: "Riverway Retail" },
      { label: "Scope", token: "{{scope}}", value: "Tenant improvements" },
      { label: "Bid window", token: "{{bid_date}}", value: "June 18" },
    ],
    recipient: "Tessa Morgan", recipientDetail: "Development manager · Riverway Group",
    sample: "Riverway Retail tenant improvements · Charlotte", sampleDetail: "Bid window closes June 18",
    subject: "Riverway Retail bid scope", replyFrom: "Tessa Morgan · Riverway Group",
    reply: "We are still confirming the electrical scope. Please keep your team on the bidder list.",
    stages: ["Project lead", "Walkthrough", "Estimate submitted", "Awarded"],
    resultMetrics: [{ value: "52", label: "project contacts" }, { value: "18", label: "bid invitations" }, { value: "7", label: "estimates active" }],
  },
  "title-companies": {
    key: "title-companies", label: "Title companies", eyebrow: "Referral network",
    angle: "Stay present with agents, lenders, and repeat clients while tracking each referral through the closing process.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Andre" },
      { label: "Company", token: "{{company}}", value: "Oak & Main Realty" },
      { label: "Market", token: "{{market}}", value: "East Nashville" },
      { label: "Close date", token: "{{close_date}}", value: "July 12" },
    ],
    recipient: "Andre Wilson", recipientDetail: "Broker · Oak & Main Realty",
    sample: "East Nashville closing", sampleDetail: "Target close date · July 12",
    subject: "Support for your East Nashville closing", replyFrom: "Andre Wilson · Oak & Main Realty",
    reply: "Thanks. I have another buyer offer likely this week and will send the details over.",
    stages: ["Referral received", "File opened", "Clear to close", "Closed"],
    resultMetrics: [{ value: "88", label: "partners contacted" }, { value: "22", label: "new referrals" }, { value: "15", label: "files in progress" }],
  },
  "property-managers": {
    key: "property-managers", label: "Property managers", eyebrow: "Owner relationships",
    angle: "Build owner conversations around portfolio size, location, and management needs, then keep each lead moving.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Sofia" },
      { label: "Portfolio", token: "{{portfolio}}", value: "34 rental units" },
      { label: "Market", token: "{{market}}", value: "Raleigh, NC" },
      { label: "Need", token: "{{management_need}}", value: "Leasing & maintenance" },
    ],
    recipient: "Sofia Alvarez", recipientDetail: "Owner · Raleigh portfolio",
    sample: "Raleigh rental portfolio · 34 units", sampleDetail: "Leasing and maintenance support",
    subject: "Management support for your Raleigh rentals", replyFrom: "Sofia Alvarez · property owner",
    reply: "I am looking to hand off leasing before the fall turnover. What does your transition look like?",
    stages: ["Owner identified", "Initial call", "Proposal shared", "Managed"],
    resultMetrics: [{ value: "73", label: "owners contacted" }, { value: "16", label: "portfolio calls" }, { value: "5", label: "proposals shared" }],
  },
  "staffing-agencies": {
    key: "staffing-agencies", label: "Staffing agencies", eyebrow: "Hiring relationships",
    angle: "Turn hiring signals into focused employer outreach and track roles from first conversation through placement.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Noah" },
      { label: "Company", token: "{{company}}", value: "Meridian Components" },
      { label: "Open roles", token: "{{roles}}", value: "6 production hires" },
      { label: "Location", token: "{{location}}", value: "Nashville, TN" },
    ],
    recipient: "Noah Bennett", recipientDetail: "People operations · Meridian Components",
    sample: "Six production roles", sampleDetail: "Nashville facility · hiring this quarter",
    subject: "Production hiring support in Nashville", replyFrom: "Noah Bennett · Meridian Components",
    reply: "We need operators on the second shift first. Can you send a few profiles by Friday?",
    stages: ["Hiring signal", "Intake call", "Candidates submitted", "Placement"],
    resultMetrics: [{ value: "94", label: "employers contacted" }, { value: "21", label: "intake conversations" }, { value: "11", label: "roles in progress" }],
  },
  "general-sales": {
    key: "general-sales", label: "General sales", eyebrow: "Opportunity pipeline",
    angle: "Personalize account outreach, capture replies, and give a lean team one practical view of what happens next.",
    mergeFields: [
      { label: "First name", token: "{{first_name}}", value: "Renee" },
      { label: "Company", token: "{{company}}", value: "Fieldstone Supply" },
      { label: "Business need", token: "{{need}}", value: "Regional distribution" },
      { label: "Team owner", token: "{{owner}}", value: "Caleb" },
    ],
    recipient: "Renee Foster", recipientDetail: "Procurement lead · Fieldstone Supply",
    sample: "Regional distribution opportunity", sampleDetail: "Account fit · Southeast expansion",
    subject: "A distribution plan for Fieldstone", replyFrom: "Renee Foster · Fieldstone Supply",
    reply: "We are evaluating two new regions. Could you share coverage and lead times?",
    stages: ["New opportunity", "Qualified", "Proposal sent", "Won"],
    resultMetrics: [{ value: "210", label: "accounts contacted" }, { value: "37", label: "replies tracked" }, { value: "12", label: "opportunities advanced" }],
  },
};

export const AUDIENCE_KEYS = Object.keys(AUDIENCE_DEMOS) as AudienceKey[];
