type BrandLogoProps = {
  variant?: "light" | "primary" | "mark";
  className?: string;
};

export function BrandLogo({ variant = "light", className = "" }: BrandLogoProps) {
  const src =
    variant === "mark"
      ? "/brand/kydos-academy-mark.svg"
      : variant === "primary"
        ? "/brand/kydos-academy-logo-primary.svg"
        : "/brand/kydos-academy-logo-light.svg";

  return (
    <img
      className={["academy-logo", variant === "mark" ? "academy-logo-mark" : "academy-logo-full", className].filter(Boolean).join(" ")}
      src={src}
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  );
}
