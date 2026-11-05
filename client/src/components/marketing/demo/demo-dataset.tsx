import { createContext, useContext, type ReactNode } from "react";
import {
  DEMO_AI_REVIEW,
  DEMO_BROKER,
  DEMO_CRITERIA,
  DEMO_DEALS,
  DEMO_FEED_BASE,
  DEMO_FEED_NEW,
  DEMO_NEW_DEAL,
  DEMO_PASSED_DEAL,
  DEMO_TRUSS,
  type DemoDeal,
} from "./demo-data";
import { ACQ_DATASET } from "./acq-demo-data";

/**
 * The homepage audience tabs reuse the same client screens with two fictional datasets:
 *   "land"        Developers (Land Acquisition): the original six demos, unchanged data.
 *   "acquisition" Real Estate Acquisition Groups: existing-property deals (dealType "acquisition").
 * Every value is fictional.
 */
export interface DemoDataset {
  key: "land" | "acquisition";
  broker: { name: string; email: string; brokerage: string };
  newDeal: DemoDeal;
  passedDeal: DemoDeal;
  deals: DemoDeal[];
  feedNew: DemoDeal[];
  feedBase: DemoDeal[];
  truss: { question: string; answer: string };
  aiReview: string;
  email: { subject: string; attachment: string };
  /** Dashboard Type filter option demonstrated ("Land" | "Acquisition") and the row kind it keeps. */
  typeFilter: { label: "Land" | "Acquisition"; kind: DemoDeal["kind"] };
  criteria: {
    states: string[];
    counties: string[];
    radius: number;
    vintage: number;
    minUnits: number;
    rentMetric: "psf" | "per_unit";
    productTypes: { name: string; isDefault: boolean; minAcres: number; maxAcres: number; minPsf: string; minUnit: string }[];
    /** Annotation strings for the screening animation. */
    screeningLine: string;
    marketCheck: string;
    acreageCheck: string;
    rentCheck: string;
    clears: string;
  };
}

export const LAND_DATASET: DemoDataset = {
  key: "land",
  broker: DEMO_BROKER,
  newDeal: DEMO_NEW_DEAL,
  passedDeal: DEMO_PASSED_DEAL,
  deals: DEMO_DEALS,
  feedNew: DEMO_FEED_NEW,
  feedBase: DEMO_FEED_BASE,
  truss: DEMO_TRUSS,
  aiReview: DEMO_AI_REVIEW,
  email: { subject: "Fwd: OM – Cedar Ridge Assemblage, 14.2 ac", attachment: "Cedar_Ridge_Assemblage_OM.pdf" },
  typeFilter: { label: "Land", kind: "Land" },
  criteria: {
    ...DEMO_CRITERIA,
    rentMetric: "psf",
    screeningLine: `${DEMO_NEW_DEAL.address}, ${DEMO_NEW_DEAL.county} · ${DEMO_NEW_DEAL.acres} ac · comps ${DEMO_NEW_DEAL.rentPsf}/SF`,
    marketCheck: "Wake County, NC is a target market",
    acreageCheck: "14.2 ac within 8–20 ac",
    rentCheck: "$2.31/SF ≥ $2.10/SF",
    clears: "Clears Garden → Review",
  },
};

const Ctx = createContext<DemoDataset>(LAND_DATASET);

export function DemoDatasetProvider({ variant, children }: { variant: DemoDataset["key"]; children: ReactNode }) {
  return <Ctx.Provider value={variant === "acquisition" ? ACQ_DATASET : LAND_DATASET}>{children}</Ctx.Provider>;
}

export function useDemoDataset() {
  return useContext(Ctx);
}
