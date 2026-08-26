"use client";

import { useHomeBarber } from "./HomeBarberContext";
import { getHomeBarberVouch } from "../lib/data";

// The differentiator: not the aggregate count, but "the barber you already
// trust vouches for this one." Given its own band so it reads before anything
// else on the page.
export default function HomeBarberVouchBanner({ barberId }) {
  const { homeBarberId } = useHomeBarber();
  const vouch = getHomeBarberVouch(barberId, homeBarberId);
  if (!vouch) return null;

  return (
    <div className="border-b border-rule bg-paper-2 px-8 py-7">
      <div className="mb-3 text-[9.5px] font-medium uppercase tracking-label text-clay">
        Your barber vouches — {vouch.voucherName}
        {vouch.voucherCity ? `, ${vouch.voucherCity}` : ""}
      </div>
      <p className="font-display text-[22px] font-light italic leading-[1.4]">
        &ldquo;{vouch.quote}&rdquo;
      </p>
    </div>
  );
}
