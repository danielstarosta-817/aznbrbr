// Design-only placeholder for direct booking (see spec: Deferred: direct
// booking). Deliberately NOT a disabled button — a greyed-out button with a
// hover tooltip is invisible on touch, and reads as broken. A quiet status
// line is honest and never looks like a dead tap target.
export default function BookingButton() {
  return (
    <div className="flex items-center gap-2 text-muted-2">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </svg>
      <span className="label">Direct booking — coming soon</span>
    </div>
  );
}
