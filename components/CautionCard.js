// A rule-marked passage, not a warning box. Cautions are scoped to one service
// and sit alongside what the shop IS recommended for — the visual weight should
// match that, rather than screaming.
export default function CautionCard({ vouch }) {
  return (
    <div className="border-l-2 border-clay-2 py-0.5 pl-[18px]">
      <div className="mb-2 text-[9.5px] font-medium uppercase tracking-label text-clay-2">
        Caution — {vouch.tag} only
      </div>
      <p className="text-sm leading-[1.6] text-ink-2">{vouch.quote}</p>
      <div className="label mt-2">{vouch.voucherId}</div>
    </div>
  );
}
