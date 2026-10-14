import type { CaseStudyProcess, ProcessStep } from "@/lib/case-studies";

function Step({ step, accent }: { step: ProcessStep; accent: string }) {
  const system = step.kind === "system";
  const decision = step.kind === "decision";
  return (
    <article
      className="border bg-surface p-4"
      style={{
        borderColor: system || decision ? accent : "var(--border)",
        backgroundColor: system ? `${accent}14` : "var(--surface)",
      }}
    >
      <p className="label-caps" style={{ color: accent }}>
        {step.n}
        {decision ? " · Decision" : system ? " · System" : ""}
      </p>
      <h3 className="mt-2 text-sm font-medium text-foreground">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
    </article>
  );
}

function laneColumns(count: number) {
  if (count >= 6) return "sm:grid-cols-2 lg:grid-cols-3";
  if (count === 5) return "sm:grid-cols-2 lg:grid-cols-5";
  if (count === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  if (count === 3) return "sm:grid-cols-3";
  return "sm:grid-cols-2";
}

export function CaseStudyProcess({
  process,
  accent,
}: {
  process: CaseStudyProcess;
  accent: string;
}) {
  const decision = process.decision;
  const flow = process.flow;
  const states = process.states;

  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        {decision ? (
          <section>
            <p className="label-caps" style={{ color: accent }}>
              {decision.kicker}
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {decision.title}
            </h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              <article className="h-full border border-border bg-surface p-5">
                <p className="label-caps text-muted">{decision.before.label}</p>
                <h3 className="mt-3 text-base font-medium text-foreground">{decision.before.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{decision.before.body}</p>
                <ul className="mt-4 space-y-2">
                  {decision.before.points.map((point) => (
                    <li key={point} className="text-sm text-foreground">
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="h-full border p-5" style={{ borderColor: accent }}>
                <p className="label-caps" style={{ color: accent }}>
                  {decision.notes.when}
                </p>
                <div className="mt-4 space-y-4">
                  {decision.notes.lines.map((line) => (
                    <p key={line} className="text-sm leading-relaxed text-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </article>
              <article className="h-full border border-border bg-surface p-5">
                <p className="label-caps text-muted">{decision.after.label}</p>
                <h3 className="mt-3 text-base font-medium text-foreground">{decision.after.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{decision.after.body}</p>
              </article>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {decision.changes.map((change) => (
                <article key={change.title} className="border border-border p-4">
                  <h3 className="text-sm font-medium text-foreground">{change.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{change.body}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {flow ? (
          <section className={decision ? "mt-16" : undefined}>
            <p className="label-caps" style={{ color: accent }}>
              {flow.kicker}
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {flow.title}
            </h2>
            <div className="mt-10 space-y-8">
              {flow.lanes.map((lane) => (
                <div key={lane.label}>
                  <p className="label-caps text-muted">{lane.label}</p>
                  <div className={`mt-3 grid gap-3 ${laneColumns(lane.steps.length)}`}>
                    {lane.steps.map((step) => (
                      <Step key={`${lane.label}-${step.n}`} step={step} accent={accent} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {states ? (
          <section className="mt-16">
            <p className="label-caps" style={{ color: accent }}>
              {states.kicker}
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {states.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{states.lede}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {states.items.map((item) => (
                <article key={item.title} className="border border-border bg-surface p-4">
                  <p className="label-caps" style={{ color: accent }}>
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-sm font-medium text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
