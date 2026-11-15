const base = "press inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--civic)]";
const sizes = { md: "min-h-11 px-5 text-base", sm: "min-h-9 px-3 text-sm" } as const;
const variants = {
  primary: "bg-primary text-primary-foreground",
  secondary: "border border-border bg-card text-foreground",
} as const;

export function btn(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md", extra = "") {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`.trim();
}
