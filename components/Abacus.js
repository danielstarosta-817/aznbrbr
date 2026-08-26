// Scores render on an abacus instead of stars — the rating is the first thing
// anyone looks at, so it may as well carry the product's identity.
//
// Five rods, five beads each. Every bead is worth 0.2, so a whole point fills a
// rod and the remainder shows in fifths on the next one: 3.8 is three full rods
// plus four beads. Counted beads are pushed to the top of the frame and
// coloured; the rest rest at the bottom, faint.
//
// This is a stylisation, not a working suanpan — a real one has a beam with
// heaven beads above and earth beads below, and encodes digits per rod. Two
// earlier versions went that way and both read as clutter at feed size,
// especially repeated down a list. Rods-as-points is the deliberate trade: it
// keeps the object recognisable and the score instantly legible. The numeral
// sits beside it everywhere it appears, so nothing depends on reading beads.

const RODS = 5;
const BEADS_PER_ROD = 5;
const STEP = 22;
const PAD_X = 14;
const BEAD_RX = 8.0;
const BEAD_RY = 5.4;
const GAP = 11.6;
const TOP_IN = 9;

const VIEW_W = PAD_X * 2 + STEP * (RODS - 1);
const VIEW_H = TOP_IN * 2 + GAP * (BEADS_PER_ROD - 1) + BEAD_RY * 2 + 8;
const BOTTOM_IN = VIEW_H - TOP_IN;

export default function Abacus({ score, tone = "good", width = 104, className = "" }) {
  const value = Math.max(0, Math.min(5, score || 0));
  const litTotal = Math.round(value * BEADS_PER_ROD);

  const light = tone === "light";
  const weak = tone === "weak";
  const frameColor = light ? "rgba(247,243,236,0.80)" : "#1E3A32";
  const rodColor = light ? "rgba(247,243,236,0.45)" : "#C9BFA8";
  const litColor = light ? "#F7F3EC" : weak ? "#B0552B" : "#1E3A32";
  const restColor = light ? "rgba(247,243,236,0.22)" : "#DCD3C0";

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={width}
      height={(width * VIEW_H) / VIEW_W}
      className={className}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5`}
      style={{ display: "block" }}
    >
      <rect
        x="1.75"
        y="1.75"
        width={VIEW_W - 3.5}
        height={VIEW_H - 3.5}
        rx="3"
        fill="none"
        stroke={frameColor}
        strokeWidth="3.5"
      />
      {Array.from({ length: RODS }, (_, rod) => {
        const cx = PAD_X + rod * STEP;
        const lit = Math.max(
          0,
          Math.min(BEADS_PER_ROD, litTotal - rod * BEADS_PER_ROD)
        );
        return (
          <g key={rod}>
            <line
              x1={cx}
              y1={TOP_IN - 4}
              x2={cx}
              y2={BOTTOM_IN + 4}
              stroke={rodColor}
              strokeWidth="2"
            />
            {Array.from({ length: BEADS_PER_ROD }, (_, i) => {
              const isLit = i < lit;
              const cy = isLit
                ? TOP_IN + BEAD_RY + i * GAP
                : BOTTOM_IN - BEAD_RY - (BEADS_PER_ROD - 1 - i) * GAP;
              return (
                <ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx={BEAD_RX}
                  ry={BEAD_RY}
                  fill={isLit ? litColor : restColor}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
