import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function DemoBookingPage() {
  return (
    <div className="min-h-[100dvh] bg-white font-sans text-[#000914]">
      <Navigation hideSubmitDeal />
      <main>
        <section className="relative overflow-hidden bg-[#000914] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10 lg:py-36">
          <div aria-hidden="true" className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-[#3286C8]/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#77b7e9]">DealLinq walkthrough</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">See your acquisition workflow in motion.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              Explore how DealLinq brings deal screening, underwriting, outreach, and relationship tracking into one workspace for your team.
            </p>
            <a href="/contact" className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full border border-[#3286C8] bg-[#3286C8] px-6 text-sm font-semibold text-white transition-all hover:border-[#3286C8] hover:bg-white hover:text-[#3286C8]">
              Book a demo
            </a>
            <p className="mt-5 text-sm text-white/65">
              Prefer email? <a href="mailto:jack@deallinq.ai" className="font-medium text-white underline underline-offset-4">Contact Jack</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
