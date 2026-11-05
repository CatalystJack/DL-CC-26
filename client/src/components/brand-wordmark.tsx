interface BrandWordmarkProps {
  inverse?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  dataTestId?: string;
}

export function BrandWordmark({
  inverse = false,
  className = "",
  iconClassName = "h-8 w-8",
  textClassName = "text-2xl",
  dataTestId,
}: BrandWordmarkProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap font-semibold tracking-tight ${className}`}
      aria-label="DealLinq"
      data-testid={dataTestId}
    >
      <img
        src="/assets/deallinq-color-icon.png"
        alt=""
        aria-hidden="true"
        className={`${iconClassName} shrink-0 object-contain`}
      />
      <span className={`brand-wordmark__text ${textClassName} ${inverse ? "!text-white" : "!text-[#000914]"}`}>DealLinq</span>
    </span>
  );
}
