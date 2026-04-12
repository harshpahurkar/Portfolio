export default function TechTag({ name }: { name: string }) {
  return (
    <span className="px-3 py-1 text-[11px] font-mono text-accent/80 bg-accent/[0.06] border border-accent/10 rounded-full tracking-wide">
      {name}
    </span>
  );
}
