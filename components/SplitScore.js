import Abacus from "./Abacus";

// The product's central argument, made visible: this shop is excellent at the
// hair it knows and ordinary at hair it doesn't, and no single blended rating
// can say that. Scored per tag out of 5.0, with the vouch count beside it so a
// low score built on one opinion doesn't masquerade as a verdict.
export default function SplitScore({ scores }) {
  if (!scores || scores.length === 0) return null;

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {scores.map((s) => {
        const weak = s.score < 3;
        const thin = s.total < 3;

        return (
          <div key={s.tag} className="flex items-center gap-5 py-4">
            <Abacus score={s.score} tone={weak ? "weak" : "good"} height={44} />

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2.5">
                <span
                  className={`font-display text-[26px] font-light leading-none ${
                    weak ? "text-clay-2" : "text-forest"
                  }`}
                >
                  {s.score.toFixed(1)}
                </span>
                <span className="font-display text-[17px] font-light">{s.tag}</span>
              </div>
              <div className="label mt-1.5">
                {s.recommend} recommend
                {s.caution > 0 && ` · ${s.caution} caution${s.caution > 1 ? "s" : ""}`}
                {thin && " · thin data"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
