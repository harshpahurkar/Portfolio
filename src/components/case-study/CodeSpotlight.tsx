import { highlightCode } from "@/lib/highlight";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CodeSnippet } from "@/types";

export default async function CodeSpotlight({
  snippet,
}: {
  snippet: CodeSnippet;
}) {
  const html = await highlightCode(snippet.code, snippet.language);

  return (
    <ScrollReveal>
      <section className="mb-20">
        <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-6">
          Code Spotlight
        </h2>
        <div className="rounded-xl overflow-hidden border border-white/[0.06]">
          {snippet.filename && (
            <div className="bg-background-card px-5 py-3 font-mono text-xs text-muted/70 border-b border-white/[0.06] flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/50" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <span className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              {snippet.filename}
            </div>
          )}
          <div
            className="overflow-x-auto text-sm [&>pre]:p-6 [&>pre]:bg-[#0a0a0f]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        <p className="mt-4 text-muted text-sm italic">{snippet.annotation}</p>
      </section>
    </ScrollReveal>
  );
}
