/**
 * Central brand configuration for the public marketing site.
 *
 * Public marketing labels and demo metadata use one shared brand identity.
 * Tailwind token names (landlinq-blue / landlinq-sky) intentionally stay as-is;
 * only their values matter.
 */
export const BRAND_NAME = "DealLinq";
export const BRAND_DOMAIN = "deallinq.ai";
/** Host shown in the fake browser chrome of the product demos. */
export const BRAND_APP_HOST = `app.${BRAND_DOMAIN}`;
export const BRAND_LOGO = "/assets/deallinq-color-icon.png";
export const BRAND_LOGO_ALT = `${BRAND_NAME} icon`;
export const WORKSPACE_LABEL = `${BRAND_NAME.toUpperCase()} WORKSPACE`;
export const AI_ASSISTANT_NAME = "Truss";
/** Fictional sender shown in outreach mocks. */
export const BRAND_DEMO_SENDER = `demo.owner@${BRAND_DOMAIN}`;

export const pageTitle = (title?: string) => (title ? `${title} | ${BRAND_NAME}` : BRAND_NAME);
