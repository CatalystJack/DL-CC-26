// Public legal page for /privacy. Generated from legal_content.py; no login required.
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

// ---- Legal page values ----
const LEGAL_ENTITY_NAME = "DealLinq";
const SUPPORT_EMAIL = "help@landlinq.ai";
const PRIVACY_EMAIL = "help@landlinq.ai";
const EFFECTIVE_DATE = "October 27, 2026";
const TOKEN_RETENTION = "30 days";
const LOG_RETENTION = "12 months";
const ACCOUNT_DELETION_DAYS = "30 days";
const BACKUP_RETENTION = "35 days";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#081526]">
      <Navigation />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#455467]">Legal</p>
          <h1
            className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#081526] sm:text-5xl"
            data-testid="text-privacy-title"
          >
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-[#455467]">Effective date: {EFFECTIVE_DATE}</p>

          <div className="mt-10 space-y-10 rounded-3xl border border-[#E5EAF0] bg-white p-6 text-[15px] leading-7 text-[#455467] shadow-sm sm:p-10">
          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Overview</h2>
            <div className="mt-3 space-y-4">
              <p>This Privacy Policy describes how {LEGAL_ENTITY_NAME} ("DealLinq," "we," "us") collects, uses, shares, and protects information in connection with the DealLinq platform at deallinq.ai, which provides deal sourcing, screening, CRM, outreach, and pipeline management tools for real estate investment companies and other business teams.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Information We Collect</h2>
            <div className="mt-3 space-y-4">
              <p><strong className="font-semibold text-[#081526]">Information you provide directly.</strong> When you create an account, we collect your name, email address, phone number, and role. Investment Companies and other organizations using the platform provide additional information, including acquisition criteria, target markets, branding assets, and contact lists they upload for use in the platform's CRM and outreach tools.</p>
              <p><strong className="font-semibold text-[#081526]">Information about third parties you provide to us.</strong> If you upload contacts (such as brokers, architects, contractors, or property owners) into the platform's CRM, that information may include names, email addresses, phone numbers, and business affiliations of people who are not DealLinq users. If you are one of these people, see "Your Rights and Choices" below.</p>
              <p><strong className="font-semibold text-[#081526]">Deal and property information.</strong> We collect property details, financial information, and related documents submitted through the platform, forwarded by email, or obtained through automated processing of emails sent to our deal-intake address (deals@deallinq.ai).</p>
              <p><strong className="font-semibold text-[#081526]">Sign-in with Google or Microsoft.</strong> If you sign in with Google or Microsoft, we receive your name, email address, and an account identifier from that provider (the openid, email, profile, and User.Read permissions). We use this only to create and sign in to your DealLinq account.</p>
              <p><strong className="font-semibold text-[#081526]">Connected email accounts.</strong> If you connect a Google (Gmail) or Microsoft (Outlook / Microsoft 365) mailbox to use outreach features, we receive and store OAuth access and refresh tokens for that connection, plus the email address and account identifier of the mailbox. See "Connected Email Accounts" below for exactly what these permissions allow.</p>
              <p><strong className="font-semibold text-[#081526]">Usage and technical information.</strong> We automatically collect certain technical information, including IP address, browser type, device information, and how you interact with the platform.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Connected Email Accounts: What We Can and Cannot Do</h2>
            <div className="mt-3 space-y-4">
              <p>DealLinq asks for <strong className="font-semibold text-[#081526]">send-only</strong> access to your mailbox. We do not request, and cannot use, any permission that reads, searches, modifies, or deletes the messages in your mailbox.</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-[#9AA8B8]">
                <li><strong className="font-semibold text-[#081526]">Google: https://www.googleapis.com/auth/gmail.send</strong> ("Send email on your behalf"). Used only to send the outreach emails you create, schedule, or approve in DealLinq (for example, introduction and follow-up emails to brokers in a campaign you set up) from your own Gmail address. We also request <strong className="font-semibold text-[#081526]">openid</strong> and <strong className="font-semibold text-[#081526]">email</strong> to confirm which Google account you connected.</li>
                <li><strong className="font-semibold text-[#081526]">Microsoft: Mail.Send</strong> (delegated, "Send mail as you"). Used only to send the outreach emails you create, schedule, or approve in DealLinq from your own Outlook / Microsoft 365 address. We also request <strong className="font-semibold text-[#081526]">openid</strong>, <strong className="font-semibold text-[#081526]">profile</strong>, <strong className="font-semibold text-[#081526]">email</strong>, and <strong className="font-semibold text-[#081526]">User.Read</strong> to confirm which Microsoft account you connected, and <strong className="font-semibold text-[#081526]">offline_access</strong> so scheduled emails in your campaigns can still send when you are not signed in.</li>
                <li><strong className="font-semibold text-[#081526]">What we cannot do:</strong> read your inbox, sent items, drafts, contacts, or calendar; search your mail; delete or change messages; or change mailbox settings. Google and Microsoft normally keep a copy of each message you send in your own Sent folder; DealLinq does not read that folder.</li>
              </ul>
              <p>We send a message through your account only when it is part of an outreach campaign or a test message you started in DealLinq. Each message is subject to the sending limits and pause controls in your Outreach Setup.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Google API Services: Limited Use Disclosure</h2>
            <div className="mt-3 space-y-4">
              <p>DealLinq's use and transfer of information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="font-medium text-[#081526] underline underline-offset-2 hover:text-[#455467]" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
              <p>Specifically, for data we obtain through Google APIs (including the gmail.send permission):</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-[#9AA8B8]">
                <li>We use it only to provide or improve the user-facing outreach feature you asked for: sending emails from your own Gmail account.</li>
                <li>We do not transfer it to others except as needed to provide or improve that feature, to comply with applicable law, or as part of a merger, acquisition, or sale of assets with notice to you.</li>
                <li>We do not use or transfer it for serving advertisements, including retargeting, personalized, or interest-based advertising.</li>
                <li>We do not sell it, and we do not use or transfer it to determine credit-worthiness or for lending purposes.</li>
                <li>No person at DealLinq reads it unless you give us affirmative permission for specific messages (for example, for support), it is necessary for security purposes such as investigating abuse, it is necessary to comply with applicable law, or the data has been aggregated and anonymized for internal operations.</li>
                <li>We do not use it to develop, improve, or train generalized or non-personalized AI or machine-learning models.</li>
                <li>DealLinq never reads, stores, or shares the content of your Gmail mailbox. From Google we keep only the OAuth token and the address of the account you connected, which we use to send the emails you write or approve in DealLinq.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">How We Use Your Information</h2>
            <div className="mt-3 space-y-4">
              <p>We use collected information to provide and improve our services, including to:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-[#9AA8B8]">
                <li>Create and manage accounts and Investment Company profiles</li>
                <li>Automatically extract and classify property and deal information from submitted or forwarded emails, including through artificial intelligence and automated parsing tools. Automated results are a screening aid and not a final determination; see our Terms of Service.</li>
                <li>Match rent and market comparable data to properties</li>
                <li>Send outreach messages you set up, through your connected email account</li>
                <li>Communicate with you about your account, deals, or platform updates</li>
                <li>Maintain platform security and prevent misuse</li>
                <li>Analyze and improve platform performance</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Information Sharing</h2>
            <div className="mt-3 space-y-4">
              <p>We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-[#9AA8B8]">
                <li><strong className="font-semibold text-[#081526]">Service providers</strong> who help us operate the platform, such as hosting, database, email delivery, AI-based email and document processing, property and market data, and geocoding providers. They may use information only to provide services to us. OAuth tokens and data received from Google or Microsoft are not shared with AI processing providers.</li>
                <li><strong className="font-semibold text-[#081526]">Google or Microsoft</strong>, when we send a message through your connected account at your direction.</li>
                <li><strong className="font-semibold text-[#081526]">Other DealLinq team members</strong>, for deal evaluation, platform administration, and support.</li>
                <li><strong className="font-semibold text-[#081526]">Legal and safety purposes</strong>, where required by law, subpoena, or other legal process, or to protect the rights, property, or safety of DealLinq, our users, or others.</li>
              </ul>
              <p><strong className="font-semibold text-[#081526]">Investment Company data isolation.</strong> Information associated with one Investment Company's account, including acquisition criteria, contacts, connected mailboxes, and outreach activity, is kept isolated from other Investment Companies and is not shared between them.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Cookies and Tracking Technologies</h2>
            <div className="mt-3 space-y-4">
              <p>We use cookies and similar technologies to maintain login sessions, remember preferences, and understand platform usage. Outreach emails sent through the platform may include technologies that show whether a message was opened or a link was clicked, used to give delivery and engagement analytics to the sending Investment Company. Outreach emails can include an unsubscribe link, and recipients who unsubscribe are not emailed again by that sender.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Data Retention and Deletion</h2>
            <div className="mt-3 space-y-4">
              <ul className="list-disc space-y-2 pl-5 marker:text-[#9AA8B8]">
                <li><strong className="font-semibold text-[#081526]">OAuth tokens</strong> for a connected mailbox are kept, encrypted, only while the mailbox is connected. When you disconnect, we revoke the token with the provider where the provider supports it and delete it from our database immediately. Tokens that stop working (for example, after you revoke access with Google or Microsoft) are deleted within {TOKEN_RETENTION}.</li>
                <li><strong className="font-semibold text-[#081526]">Outreach send records</strong> (recipient, subject, time sent, delivery and engagement status) are kept while your account is active so you can see campaign history, and deleted with your account.</li>
                <li><strong className="font-semibold text-[#081526]">Server and security logs</strong> are kept for {LOG_RETENTION}.</li>
                <li><strong className="font-semibold text-[#081526]">Account data.</strong> If you ask us to delete your account, we delete your account data, connected-mailbox tokens, and outreach records within {ACCOUNT_DELETION_DAYS}, except where we must keep something to comply with law, resolve disputes, or enforce our agreements. Encrypted backups roll off within {BACKUP_RETENTION}.</li>
              </ul>
              <p>To request deletion, email {PRIVACY_EMAIL} from the address on your account.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">How to Disconnect or Revoke Access</h2>
            <div className="mt-3 space-y-4">
              <p>You can stop DealLinq's access to your mailbox at any time, in any of these ways:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-[#9AA8B8]">
                <li><strong className="font-semibold text-[#081526]">In DealLinq:</strong> go to Outreach Setup and choose Disconnect next to the connected mailbox. This deletes the stored tokens and stops all sending through that mailbox.</li>
                <li><strong className="font-semibold text-[#081526]">Google:</strong> visit <a href="https://myaccount.google.com/permissions" className="font-medium text-[#081526] underline underline-offset-2 hover:text-[#455467]" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>, select DealLinq, and remove access.</li>
                <li><strong className="font-semibold text-[#081526]">Microsoft work or school account:</strong> visit <a href="https://myapps.microsoft.com" className="font-medium text-[#081526] underline underline-offset-2 hover:text-[#455467]" target="_blank" rel="noopener noreferrer">myapps.microsoft.com</a>, open the app permissions for DealLinq, and revoke them. Your organization's administrator can also remove DealLinq from Enterprise applications in Microsoft Entra.</li>
                <li><strong className="font-semibold text-[#081526]">Personal Microsoft account:</strong> visit <a href="https://account.live.com/consent/Manage" className="font-medium text-[#081526] underline underline-offset-2 hover:text-[#455467]" target="_blank" rel="noopener noreferrer">account.live.com/consent/Manage</a> and remove DealLinq.</li>
              </ul>
              <p>After you revoke access with Google or Microsoft, DealLinq can no longer send email from that mailbox. Any campaign steps that would have used it are paused.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Your Rights and Choices</h2>
            <div className="mt-3 space-y-4">
              <p>Depending on your location and relationship to DealLinq, you may have the right to request access to, correction of, or deletion of your personal information. If your information was uploaded to the platform by an Investment Company or other organization as part of their contact list, contact us at {SUPPORT_EMAIL} and we will work with that organization to address your request. You can opt out of outreach and other non-essential email using the unsubscribe link in those messages.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Data Security</h2>
            <div className="mt-3 space-y-4">
              <p>We use reasonable administrative, technical, and physical safeguards to protect personal information. OAuth tokens are encrypted at rest and sent only over TLS. Access to production systems is limited to personnel who need it. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Children's Privacy</h2>
            <div className="mt-3 space-y-4">
              <p>DealLinq is not directed to individuals under the age of 18, and we do not knowingly collect personal information from children.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Changes to This Policy</h2>
            <div className="mt-3 space-y-4">
              <p>We may update this Privacy Policy from time to time. We will update the effective date above and communicate material changes as appropriate. If we ever want to use Google or Microsoft data in a way not described here, we will ask for your consent first.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#081526]">Contact Us</h2>
            <div className="mt-3 space-y-4">
              <p>{LEGAL_ENTITY_NAME}. Email: {SUPPORT_EMAIL} for privacy questions, data deletion requests, and support.</p>
            </div>
          </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
