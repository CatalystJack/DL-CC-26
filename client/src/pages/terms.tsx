// Public legal page for /terms. Generated from legal_content.py; no login required.
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

// ---- Legal page values ----
const LEGAL_ENTITY_NAME = "DealLinq";
const SUPPORT_EMAIL = "help@landlinq.ai";
const EFFECTIVE_DATE = "October 27, 2026";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#081526]">
      <Navigation />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#455467]">Legal</p>
          <h1
            className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#081526] sm:text-5xl"
            data-testid="text-terms-title"
          >
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-[#455467]">Effective date: {EFFECTIVE_DATE}</p>

          <div className="mt-10 space-y-10 rounded-3xl border border-[#E5EAF0] bg-white p-6 text-[15px] leading-7 text-[#455467] shadow-sm sm:p-10">
          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Acceptance of Terms</h2>
            <div className="mt-3 space-y-4">
              <p>These Terms of Service are an agreement between you and {LEGAL_ENTITY_NAME} ("DealLinq," "we," "us"). By accessing or using DealLinq at deallinq.ai (the "Platform"), you agree to these terms. If you use the Platform on behalf of an organization, you represent that you have authority to bind that organization.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Description of Service</h2>
            <div className="mt-3 space-y-4">
              <p>DealLinq provides a platform for real estate deal sourcing and screening, customer relationship management (CRM), outreach messaging, and sales pipeline tracking. It is used by real estate investment companies for acquisition workflows and by other business teams for CRM, outreach, and pipeline management. Deals and property information may be submitted directly, forwarded by email, or identified through automated processing of inbound communications.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Accounts and Access</h2>
            <div className="mt-3 space-y-4">
              <p>You are responsible for keeping your account credentials confidential and for all activity under your account. Investment Company and organization accounts may include multiple users, each bound by these terms. You may sign in with Google or Microsoft; doing so lets us confirm your name and email address and does not give DealLinq access to your mailbox.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Connected Email Accounts and Outreach</h2>
            <div className="mt-3 space-y-4">
              <p>You may connect your own Google (Gmail) or Microsoft (Outlook / Microsoft 365) mailbox so DealLinq can send outreach messages from your address. When you connect, you grant send-only permission (Google gmail.send or Microsoft Mail.Send). DealLinq uses that permission only to send the messages you create, schedule, or approve in the Platform, and cannot read, search, change, or delete your mail. Our <a href="/privacy" className="font-medium text-[#081526] underline underline-offset-2 hover:text-[#455467]">Privacy Policy</a> explains how we handle these tokens, including our Google API Services Limited Use commitments.</p>
              <p>You are solely responsible for the content of messages sent through your connected account, for having a lawful basis to contact each recipient, and for complying with applicable law, including the CAN-SPAM Act, and with Google's and Microsoft's terms and sending limits. You may disconnect a mailbox at any time in Outreach Setup or through your Google or Microsoft account settings; sending through it stops immediately.</p>
              <p>If you connect a mailbox owned by your employer or another organization, you confirm you are allowed to do so. That organization's administrator may require approval before you can connect, and may revoke DealLinq's access at any time.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Property and Deal Submissions</h2>
            <div className="mt-3 space-y-4">
              <p>By submitting property or deal information, whether directly, by forwarding an email, or by any other means on the Platform, you represent that you have the right to submit it and that it is accurate to the best of your knowledge.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Automated Processing and AI-Generated Information</h2>
            <div className="mt-3 space-y-4">
              <p>The Platform uses automated tools, including artificial intelligence, to extract, classify, and screen property and deal information. Automated results are a screening aid only and may contain errors or omissions. DealLinq does not guarantee the accuracy, completeness, or reliability of automatically extracted or classified information, and you are solely responsible for verifying it before relying on it for any business, financial, or transactional decision.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Commission Structure and Brokerage Services</h2>
            <div className="mt-3 space-y-4">
              <p>Where applicable, real estate brokerage services in connection with deals identified through the Platform are provided by Apex Residential, LLC, a licensed real estate brokerage, under separate commission and brokerage agreements. Commission rates and terms are governed by those agreements and are not changed by these terms.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Data and Content Ownership</h2>
            <div className="mt-3 space-y-4">
              <p>As between you and DealLinq, you keep ownership of the acquisition criteria, contact lists, and other content you upload. You grant DealLinq a license to use that content only as needed to provide the Platform to you. DealLinq owns the Platform, including its technology, classification systems, and branding.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Acceptable Use</h2>
            <div className="mt-3 space-y-4">
              <p>Use the Platform only for lawful purposes. You may not use it to send unsolicited bulk or unlawful messages, to send from a mailbox you are not authorized to use, to access another user's or organization's data without authorization, or to interfere with the Platform's operation or security. We may pause sending from any connected mailbox to protect recipients, deliverability, or the Platform.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Termination</h2>
            <div className="mt-3 space-y-4">
              <p>DealLinq may suspend or terminate your access for violation of these terms or for other reasonable business purposes. You may stop using the Platform and request account deletion at any time. On termination we delete connected-mailbox tokens as described in the Privacy Policy. Provisions that by their nature should survive termination will survive.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Disclaimer of Warranties</h2>
            <div className="mt-3 space-y-4">
              <p>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. DEALLINQ DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED OR ERROR-FREE, THAT ANY MESSAGE WILL BE DELIVERED, OR THAT ANY DEAL OR MARKET DATA IS ACCURATE OR COMPLETE.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Limitation of Liability</h2>
            <div className="mt-3 space-y-4">
              <p>To the maximum extent permitted by law, DealLinq is not liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, arising from your use of the Platform, including reliance on automatically classified or AI-generated information.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Indemnification</h2>
            <div className="mt-3 space-y-4">
              <p>You agree to indemnify and hold DealLinq harmless from claims, damages, or expenses arising from your use of the Platform, your violation of these terms, or content you submit or send through the Platform, including outreach messages sent through your connected email account.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Governing Law</h2>
            <div className="mt-3 space-y-4">
              <p>These terms are governed by the laws of the State of North Carolina, without regard to conflict of law principles.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Changes to These Terms</h2>
            <div className="mt-3 space-y-4">
              <p>We may update these terms from time to time and will update the effective date above. Continued use of the Platform after changes take effect means you accept the revised terms.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Contact Information</h2>
            <div className="mt-3 space-y-4">
              <p>{LEGAL_ENTITY_NAME}. Email: {SUPPORT_EMAIL}.</p>
            </div>
          </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
