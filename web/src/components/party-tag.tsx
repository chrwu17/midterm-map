const TINT: Record<string, string> = {
  Democratic: "var(--party-d)",
  Republican: "var(--party-r)",
};

export function PartyTag({ party, label }: { party: string; label?: string }) {
  const text = party === "Other" && label ? label : party;
  return (
    <span
      className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground"
      style={{ background: TINT[party] ?? "var(--party-o)" }}
    >
      {text}
    </span>
  );
}
