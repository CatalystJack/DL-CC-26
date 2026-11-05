import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { BrandWordmark } from "@/components/brand-wordmark";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return (
    <footer className="bg-primary px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <BrandWordmark inverse iconClassName="h-7 w-7" textClassName="text-[1.35rem]" dataTestId="footer-logo-deallinq" />
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/50">
            Deal flow, outreach and team follow-through in one workspace.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Explore</h3>
          <div className="ll-footer-link-list flex flex-col gap-3 text-sm text-white/70">
            <a href="/#demo" className="transition-colors hover:text-white">Platform</a>
            <a href="/#demo" className="transition-colors hover:text-white">Who it&apos;s for</a>
            <Link href="/company" className="transition-colors hover:text-white">About</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Contact</h3>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <a href="mailto:jack@deallinq.ai" className="transition-colors hover:text-white">jack@deallinq.ai</a>
            <span>deallinq.ai</span>
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-14 max-w-7xl border-t border-white/15 pt-6 text-xs text-white/35"
        data-testid="text-copyright"
      >
        © {new Date().getFullYear()} DealLinq. All rights reserved.
      </div>
    </footer>
  );
}