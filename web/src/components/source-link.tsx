import { sourcePublisher } from "@/lib/publisher";

export function SourceLink({ href, n, website }: { href?: string | null; n?: number; website?: string | null }) {
  if (!href) return null;
  const pub = sourcePublisher(href, website);
  if (!pub) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="source-link ml-1.5 inline-block align-baseline text-[0.72rem] text-muted-foreground underline decoration-dotted hover:text-primary"
      title={`Source: ${pub.host}`}
    >
      {pub.name}
      {n ? ` ${n}` : ""}
      <span className="sr-only"> ({pub.host}, opens in new tab)</span>
    </a>
  );
}
