// Scores render on a soroban rather than a progress bar — the rating is the
// one thing every visitor looks at, so it may as well carry the product's
// identity instead of looking like every other directory.
//
// Real soroban notation, not decoration: each rod has one heaven bead above the
// beam worth 5, and four earth beads below worth 1 each. A bead counts when
// it's pushed toward the beam. Two rods here — units and tenths — so 4.2 reads
// as four earth beads up on the left rod, two on the right.
//
// It's paired with the numeral everywhere it appears, so nobody has to know how
// to read an abacus to know the score.

const BEAD_W = 8.5;
const BEAD_H = 4.6;
const BEAM_Y = 26;
const TOP = 5;
const BOTTOM = 71;

function Bead({ cx, cy, fill }) {
  const pts = [
    `${cx - BEAD_W},${cy}`,
    `${cx},${cy - BEAD_H}`,
    `${cx + BEAD_W},${cy}`,
    `${cx},${cy + BEAD_H}`,
  ].join(" ");
  return <polygon points={pts} fill={fill} />;
}

function Rod({ x, digit, active, idle }) {
  const heavenOn = digit >= 5;
  const earthOn = digit % 5;

  const beads = [];

  // Heaven bead: rests at the top, drops to the beam when it counts.
  beads.push(
    <Bead
      key="h"
      cx={x}
      cy={heavenOn ? BEAM_Y - 7 : TOP + 6}
      fill={heavenOn ? active : idle}
    />
  );

  // Earth beads: rest at the bottom, rise to the beam when they count.
  for (let i = 0; i < 4; i++) {
    const on = i < earthOn;
    const cy = on
      ? BEAM_Y + 8 + i * 10
      : BOTTOM - 6 - (3 - i) * 10;
    beads.push(<Bead key={`e${i}`} cx={x} cy={cy} fill={on ? active : idle} />);
  }

  return (
    <g>
      <line x1={x} y1={TOP} x2={x} y2={BOTTOM} stroke={idle} strokeWidth="1" />
      {beads}
    </g>
  );
}

export default function Abacus({ score, tone = "good", height = 46, className = "" }) {
  const clamped = Math.max(0, Math.min(5, score || 0));
  const units = Math.floor(clamped);
  const tenths = Math.round((clamped - units) * 10);

  // "light" is for the profile masthead, which sits on deep forest — the
  // dark-on-cream palette would vanish there.
  const light = tone === "light";
  const active = light ? "#F7F3EC" : tone === "weak" ? "#B0552B" : "#1E3A32";
  const idle = light ? "rgba(247,243,236,0.28)" : "#DCD3C0";
  const frame = light ? "rgba(247,243,236,0.75)" : tone === "weak" ? "#B0552B" : "#1E3A32";

  const W = 62;
  const H = 76;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      height={height}
      width={(height * W) / H}
      className={className}
      role="img"
      aria-label={`${clamped.toFixed(1)} out of 5`}
      style={{ display: "block" }}
    >
      <rect
        x="1"
        y="1"
        width={W - 2}
        height={H - 2}
        rx="2"
        fill="none"
        stroke={frame}
        strokeWidth="1.5"
      />
      <line x1="1" y1={BEAM_Y} x2={W - 1} y2={BEAM_Y} stroke={frame} strokeWidth="1.5" />
      {/* Unit-rod marker, as on a real soroban. */}
      <circle cx="20" cy={BEAM_Y} r="1.4" fill={frame} />
      <Rod x={20} digit={units} active={active} idle={idle} />
      <Rod x={42} digit={tenths} active={active} idle={idle} />
    </svg>
  );
}
