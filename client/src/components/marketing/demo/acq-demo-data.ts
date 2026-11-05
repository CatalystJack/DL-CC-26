/**
 * Fictional preview data for the "Real Estate Acquisition Groups" tab.
 * Fictional existing-property (dealType "acquisition") deals for a fictional buyer.
 * The app classifies acquisition deals with the same rules as land: target market,
 * site acreage range and a minimum rent ($/SF or $/Unit) per product type
 * (server/services/developerClassificationService.ts). It has no cap-rate,
 * price, unit-count or vintage screening rules, so none are shown as criteria.
 */
import type { DemoDeal } from "./demo-data";
import type { DemoDataset } from "./demo-dataset";

const BROKER = { name: "Casey Park", email: "casey@peachtreeadvisors.com", brokerage: "Peachtree Property Advisors" };

const NEW: DemoDeal = {
  id: 2042,
  name: "Brookhaven Grove",
  address: "2400 Briarcliff Rd NE",
  city: "Atlanta, GA",
  county: "DeKalb County",
  status: "reviewing",
  kind: "Acq",
  productTypes: ["Garden"],
  price: 31800000,
  acres: 9.8,
  units: 184,
  rentPsf: "$1.71",
  avgRentUnit: "$1,525",
  vintage: 2016,
  broker: BROKER.name,
  targetMarket: true,
};

const PASSED: DemoDeal = {
  id: 2039,
  name: "Cumberland Oaks",
  address: "6100 River Rd",
  city: "Nashville, TN",
  county: "Davidson County",
  status: "passed",
  kind: "Acq",
  productTypes: [],
  price: 9400000,
  acres: 5.2,
  units: 96,
  rentPsf: "$1.22",
  avgRentUnit: "$1,080",
  vintage: 1984,
  broker: "Jordan Lee",
  targetMarket: false,
};

const DEALS: DemoDeal[] = [
  { id: 2041, name: "Westside Mill Lofts", address: "800 Marietta St NW", city: "Atlanta, GA", county: "Fulton County", status: "pursuing", priority: 1, kind: "Acq", productTypes: ["Garden"], price: 27500000, acres: 8.6, units: 156, rentPsf: "$1.78", avgRentUnit: "$1,590", vintage: 2018, broker: BROKER.name, targetMarket: true },
  { id: 2040, name: "South End Station", address: "15 E Bland St", city: "Charlotte, NC", county: "Mecklenburg County", status: "reviewing", priority: 2, kind: "Acq", productTypes: ["Mid-Rise"], price: 44200000, acres: 3.9, units: 228, rentPsf: "$2.02", avgRentUnit: "$1,710", vintage: 2020, broker: "Morgan Chen", targetMarket: true },
  PASSED,
  { id: 2038, name: "Ashley River Landing", address: "77 Bees Ferry Rd", city: "Charleston, SC", county: "Charleston County", status: "reviewing", kind: "Land", productTypes: ["Garden"], price: 4000000, acres: 15.3, units: 300, rentPsf: "$2.44", broker: "Sam Ortiz", targetMarket: true },
  { id: 2037, name: "Cumberland Creek Villas", address: "1500 Lebanon Pike", city: "Nashville, TN", county: "Davidson County", status: "passed", kind: "Acq", productTypes: [], price: 12100000, acres: 6.8, units: 120, rentPsf: "$1.31", avgRentUnit: "$1,140", vintage: 1991, broker: "Jordan Lee", targetMarket: false },
  { id: 2036, name: "Crabtree Commons", address: "5 Blue Ridge Rd", city: "Raleigh, NC", county: "Wake County", status: "reviewing", priority: 3, kind: "Acq", productTypes: ["Garden"], price: 22600000, acres: 11.2, units: 140, rentPsf: "$1.69", avgRentUnit: "$1,505", vintage: 2014, broker: BROKER.name, targetMarket: true },
  { id: 2035, name: "Savannah Oaks", address: "88 Abercorn St", city: "Savannah, GA", county: "Chatham County", status: "passed", kind: "Acq", productTypes: [], price: 16900000, acres: 2.1, units: 132, rentPsf: "$1.41", avgRentUnit: "$1,210", vintage: 1999, broker: "Morgan Chen", targetMarket: true },
  { id: 2034, name: "Roswell Bend", address: "310 Holcomb Bridge Rd", city: "Roswell, GA", county: "Fulton County", status: "reviewing", kind: "Land", productTypes: ["Garden"], price: 2650000, acres: 10.9, units: 210, rentPsf: "$2.33", broker: "Sam Ortiz", targetMarket: true },
];

const FEED_NEW: DemoDeal[] = [
  NEW,
  { id: 2043, name: "Chatham Place Flats", address: "64 Chatham Pkwy", city: "Savannah, GA", county: "Chatham County", status: "reviewing", kind: "Acq", productTypes: ["Mid-Rise"], price: 38900000, acres: 3.4, units: 204, rentPsf: "$1.98", avgRentUnit: "$1,680", vintage: 2019, broker: "Morgan Chen", targetMarket: true },
  { id: 2044, name: "Hickory Hollow Apartments", address: "3 Bell Rd", city: "Nashville, TN", county: "Davidson County", status: "passed", kind: "Acq", productTypes: [], price: 7300000, acres: 4.4, units: 72, rentPsf: "$1.18", avgRentUnit: "$1,020", vintage: 1979, broker: "Jordan Lee", targetMarket: false },
];

export const ACQ_DATASET: DemoDataset = {
  key: "acquisition",
  broker: BROKER,
  newDeal: NEW,
  passedDeal: PASSED,
  deals: DEALS,
  feedNew: FEED_NEW,
  feedBase: DEALS.slice(0, 5),
  truss: {
    question: "What new deals came in today?",
    answer:
      "3 new deals hit your dashboard today. 2400 Briarcliff Rd NE (184 units, 2016) and 64 Chatham Pkwy (204 units) meet your criteria and are in Review. 3 Bell Rd was passed: Davidson County, TN is outside your target markets.",
  },
  aiReview:
    "Clears your Garden criteria: the 9.8 ac site is inside the 6–25 ac range and rent comps average $1,525/unit against your $1,450/unit minimum. DeKalb County, GA is one of your target markets, so this deal is marked Review.",
  email: { subject: "Fwd: OM – Brookhaven Grove, 184 units", attachment: "Brookhaven_Grove_OM.pdf" },
  typeFilter: { label: "Acquisition", kind: "Acq" },
  criteria: {
    states: ["GA", "NC", "SC"],
    counties: ["DeKalb County, GA", "Chatham County, GA", "Mecklenburg County, NC"],
    radius: 3,
    vintage: 2010,
    minUnits: 100,
    rentMetric: "per_unit",
    productTypes: [
      { name: "Garden", isDefault: true, minAcres: 6, maxAcres: 25, minPsf: "", minUnit: "1,450" },
      { name: "Mid-Rise", isDefault: false, minAcres: 2, maxAcres: 8, minPsf: "", minUnit: "1,600" },
    ],
    screeningLine: `${NEW.address}, ${NEW.county} · ${NEW.units} units · ${NEW.acres} ac site · comps ${NEW.avgRentUnit}/unit`,
    marketCheck: "DeKalb County, GA is a target market",
    acreageCheck: "9.8 ac within 6–25 ac",
    rentCheck: "$1,525/unit ≥ $1,450/unit",
    clears: "Clears Garden → Review",
  },
};
