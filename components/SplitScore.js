// The product's central argument, made visible: this shop is excellent at the
// hair it knows and ordinary at hair it doesn't, and no single blended star
// rating can say that. Percentages are per-tag, and the vouch count sits next
// to each one so a 0% built on one opinion doesn't masquerade as a verdict.
export default function SplitScore({ scores }) {
  if (!scores || scores.length === 0) return null;

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {scores.map((s) => {
        const total = s.recommend + s.caution;
        const percent = Math.round((s.recommend / total) * 100);
        const thin = total < 3;
        const weak = percent < 60;

        return (
          <div key={s.tag} className="flex items-baseline gap-4 py-3.5">
            <div
              className={`w-[68px] shrink-0 font-display text-[26px] font-light leading-none ${
                weak ? "text-clay-2" : "text-forest"
              }`}
            >
              {percent}
              <span className="text-[13px]">%</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-display text-[17px] font-light">{s.tag}</div>
              <div className="label mt-0.5">
                {s.recommend} recommend
                {s.caution > 0 && ` · ${s.caution} caution${s.caution > 1 ? "s" : ""}`}
                {thin && " · thin data"}
              </div>
            </div>

            <div className="hidden h-1.5 w-32 shrink-0 overflow-hidden bg-rule sm:block">
              <div
                className={`h-full ${weak ? "bg-clay-2" : "bg-forest"}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
