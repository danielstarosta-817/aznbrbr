// Presentational. Split by tag, not by reviewer identity — the core insight
// the whole product rests on. Shows recommend/caution counts per tag rather
// than inventing a fake star number we don't have real data for.
export default function SplitScoreBlock({ scores }) {
  if (!scores || scores.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        No vouches yet — be the first to vouch for this barber.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {scores.map((s) => {
        const total = s.recommend + s.caution;
        const recommendPct = total ? Math.round((s.recommend / total) * 100) : 0;
        return (
          <div key={s.tag} className="flex items-center gap-3">
            <div className="w-40 text-sm font-medium truncate">{s.tag}</div>
            <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-recommend"
                style={{ width: `${recommendPct}%` }}
              />
            </div>
            <div className="text-xs text-neutral-600 whitespace-nowrap w-28 text-right">
              {s.recommend} recommend{s.caution > 0 ? ` · ${s.caution} caution` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
