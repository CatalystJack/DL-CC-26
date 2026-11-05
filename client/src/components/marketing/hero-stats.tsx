import { useEffect, useRef, useState } from "react";

const heroStats = [
  { value: 18000, format: (value: number) => `${Math.round(value).toLocaleString()}+`, label: "Units developed" },
  { value: 1.5, format: (value: number) => `$${value.toFixed(1)}B`, label: "In development" },
  { value: 3.5, format: (value: number) => `$${value.toFixed(1)}B`, label: "In multifamily transaction experience" },
];

export default function MarketingHeroStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 768px)").matches
    ) {
      setProgress(1);
      return;
    }

    let animationFrame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const startedAt = performance.now();
      const duration = 1800;

      const animate = (now: number) => {
        const elapsed = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        setProgress(eased);
        if (elapsed < 1) animationFrame = requestAnimationFrame(animate);
      };

      animationFrame = requestAnimationFrame(animate);
    }, { threshold: 0.25 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="ll-hero-stats" aria-label="DealLinq development statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
        {heroStats.map((stat) => (
          <div className="ll-hero-stat" key={stat.label}>
            <strong className="font-serif" style={{ transform: `scale(${0.94 + progress * 0.06})` }}>
              {stat.format(stat.value * progress)}
            </strong>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
