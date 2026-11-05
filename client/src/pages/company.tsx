import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEO from "@/components/SEO";
import MarketingHeroStats from "@/components/marketing/hero-stats";

export default function CompanyPage() {
  return (
      <div className="min-h-[100dvh] bg-white font-sans text-[#000914]">
      <SEO
        title="Company"
        description="DealLinq helps real estate acquisition teams manage deal flow, market intelligence, and broker relationships."
        url="https://deallinq.ai/company"
      />
      <Navigation hideSubmitDeal />

      <main>
        <section className="bg-primary px-4 pb-12 pt-2 text-primary-foreground sm:px-8 sm:pb-14 sm:pt-10 lg:px-10">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mx-auto max-w-5xl">
              <span className="ll-eyebrow-light">ABOUT DEAL-LINQ</span>
              <h1 className="mt-5 text-balance text-[clamp(2rem,9vw,3.75rem)] font-semibold leading-[0.96] tracking-[-0.06em] sm:text-7xl lg:text-[4.5rem]">
                Built by investors, <span className="text-[#55C3E9]">not developers watching from the outside.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[640px] text-base leading-6 text-white/68 sm:mt-6 sm:text-lg sm:leading-7">
                DealLinq helps acquisition teams improve deal flow, evaluate opportunities, and maintain broker relationships.
              </p>
            </div>
          </div>
        </section>

        <MarketingHeroStats />

        <section className="bg-[#EAF5FB] px-4 py-12 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-3xl bg-primary p-5 text-primary-foreground sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
              <div>
                <h2 className="max-w-2xl text-[clamp(2.25rem,8vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.05em]">
                  See what a supercharged acquisitions team looks like.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/65">Tell us a little about what your team is trying to solve. We’ll be in touch.</p>
              </div>
              <div className="lg:justify-self-end">
                <a href="/contact" className="inline-flex h-12 items-center rounded-full border border-transparent bg-white px-7 text-sm font-semibold text-primary transition-all hover:border-white hover:bg-transparent hover:text-white">
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}