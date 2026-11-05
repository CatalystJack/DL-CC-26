import { Link, useLocation } from "wouter";
import Footer from "@/components/footer";
import AudienceDemo, { type AudienceKey } from "@/components/marketing/audience-demos/AudienceDemo";
import { DesktopPlatformMenu, DesktopSolutionsMenu, MobilePlatformGroup, MobileSolutionsGroup } from "@/components/marketing/solutions-navigation";
import { BrandWordmark } from "@/components/brand-wordmark";
import { SOLUTIONS } from "@/config/solutions";
import { BRAND_NAME } from "@/config/brand";
import { ArrowRight, Check, Clock3, Sparkles } from "lucide-react";
import { useState } from "react";
import "./audience-landing.css";

function getHeadlineParts(headline: string) {
  const sentenceBreak = headline.match(/^(.*?[.!?])\s+(.+)$/);
  if (sentenceBreak) return [sentenceBreak[1], sentenceBreak[2]];

  const words = headline.split(/\s+/);
  const accentWordCount = Math.min(4, Math.max(2, Math.ceil(words.length * 0.32)));
  return [
    words.slice(0, -accentWordCount).join(" "),
    words.slice(-accentWordCount).join(" "),
  ];
}

export default function AudienceLandingPage() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const slug = location.split("?")[0].split("/").filter(Boolean).at(-1);
  const solution = SOLUTIONS.find((item) => item.previewSlug === slug);

  if (!solution) {
    return (
      <main className="ll-solutions-brand ll-audience-landing ll-audience-landing--unavailable grid min-h-screen place-items-center px-6 text-center">
        <div><p className="ll-audience-landing__kicker">Audience preview</p><h1 className="ll-audience-landing__heading mt-4 text-4xl">This page is not available.</h1><Link href="/" className="ll-audience-landing__button ll-audience-landing__button--primary mt-6 inline-flex min-h-12 items-center gap-2 px-5">Back to DealLinq <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>
      </main>
    );
  }

  const [headlineLead, headlineAccent] = getHeadlineParts(solution.headline);

  return (
    <div className="ll-solutions-brand ll-audience-landing min-h-screen overflow-x-clip">
      <header className="ll-audience-landing__header relative z-20 bg-[#000914] text-white">
        <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-7 lg:px-10" aria-label="Main navigation">
          <Link href="/" aria-label={`${BRAND_NAME} home`} className="shrink-0">
            <BrandWordmark inverse iconClassName="h-7 w-7" textClassName="text-[1.35rem]" dataTestId="audience-page-wordmark" />
          </Link>
          <div className="hidden items-center gap-2 lg:gap-3 md:flex">
            <DesktopPlatformMenu />
            <DesktopSolutionsMenu />
            <Link href="/demo" className="ll-audience-landing__button ll-audience-landing__button--primary border-[#3286C8] bg-[#3286C8] px-4 py-2 text-white hover:border-[#3286C8] hover:bg-white hover:text-[#3286C8]">Book a demo</Link>
            <Link href="/login" className="rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-[#3286C8]">Log In</Link>
          </div>
          <button type="button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)} className="ll-audience-landing__mobile-toggle inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden">
            <span className="text-xl leading-none" aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
          </button>
        </nav>
        {mobileMenuOpen && <div className="ll-audience-landing__mobile-panel max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-b-2xl bg-[#000914] px-4 py-3 md:hidden"><MobilePlatformGroup onCloseMenu={() => setMobileMenuOpen(false)} /><MobileSolutionsGroup onCloseMenu={() => setMobileMenuOpen(false)} /><Link href="/demo" className="ll-audience-landing__button ll-audience-landing__button--primary mt-2 min-h-12 border-[#3286C8] bg-[#3286C8] px-4 text-white hover:border-[#3286C8] hover:bg-white hover:text-[#3286C8]">Book a demo</Link><Link href="/login" onClick={() => setMobileMenuOpen(false)} className="mt-2 block min-h-12 rounded-lg border border-white/30 px-3 py-3 text-center text-sm font-semibold text-white">Log In</Link></div>}
      </header>

      <main>
        <section className="ll-audience-landing__hero px-4 pb-14 pt-12 sm:px-7 sm:pb-20 sm:pt-16 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
            <p className="ll-audience-landing__kicker">{solution.label} · DealLinq workflow</p>
            <h1 className="ll-audience-landing__heading mt-5 max-w-5xl text-balance text-[clamp(2.25rem,7vw,5rem)] leading-[0.98]">
              {headlineLead}{" "}
              <span className="ll-audience-landing__headline-accent">{headlineAccent}</span>
            </h1>
            <p className="ll-audience-landing__hero-copy mx-auto mt-5 max-w-2xl text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8">{solution.description}</p>
            <div className="mt-7 flex w-full max-w-md flex-col justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">
              <Link href="/demo" className="ll-audience-landing__button ll-audience-landing__button--primary gap-2 px-6">Book a demo <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
              <a href="#workflow" className="ll-audience-landing__button ll-audience-landing__button--secondary px-6">Explore the workflow</a>
            </div>
            <div className="mt-11 w-full max-w-6xl min-w-0 text-left sm:mt-14">
              <AudienceDemo audience={solution.demoKey as AudienceKey} />
            </div>
          </div>
        </section>

        <section id="workflow" className="ll-audience-landing__workflow px-4 py-16 sm:px-7 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="ll-audience-landing__kicker">One connected workflow</p>
              <h2 className="ll-audience-landing__heading mt-3 text-3xl sm:text-5xl">Connect your own inbox. Keep the next step in view.</h2>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                { title: "Personalize at scale", body: "Use contact and opportunity context to make each outreach message relevant.", icon: Sparkles },
                { title: "Track deals", body: "Keep replies connected to the account or opportunity that started the conversation.", icon: Check },
                { title: "Track pipelines", body: "See what is new, what needs follow-up, and what has moved forward.", icon: Clock3 },
              ].map(({ title, body, icon: Icon }) => (
                <article key={title} className="ll-audience-landing__feature-card p-6">
                  <Icon aria-hidden="true" className="ll-audience-landing__feature-icon h-5 w-5" />
                  <h3 className="ll-audience-landing__feature-title mt-4 text-lg">{title}</h3>
                  <p className="ll-audience-landing__feature-copy mt-2 text-sm leading-6">{body}</p>
                </article>
              ))}
            </div>
            <div className="ll-audience-landing__sample-panel mt-8 flex flex-col items-start justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
              <div>
                <span className="ll-audience-landing__sample-data">Industry workflow</span>
                <p className="ll-audience-landing__sample-copy mt-3 text-sm font-medium">{solution.sample}</p>
              </div>
            </div>
            <div className="ll-audience-landing__cta-band mt-9 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
              <div><p className="ll-audience-landing__kicker">DealLinq for {solution.label.toLowerCase()}</p><h2 className="ll-audience-landing__heading mt-2 text-2xl sm:text-3xl">Bring every opportunity and next step into focus.</h2></div>
              <Link href="/demo" className="ll-audience-landing__button ll-audience-landing__button--primary shrink-0 gap-2 px-5">Book a demo <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <div className="ll-audience-landing__footer"><Footer /></div>
    </div>
  );
}
