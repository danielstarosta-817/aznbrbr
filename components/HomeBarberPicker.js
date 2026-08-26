"use client";

import { useHomeBarber } from "./HomeBarberContext";

// Stands in for auth: picking a home barber is what makes the personalization
// signal light up on other cities' profiles. In a real build this is derived
// from the account, not a dropdown in the nav.
export default function HomeBarberPicker({ barbers }) {
  const { homeBarberId, setHomeBarberId } = useHomeBarber();
  const confirmed = barbers.filter((b) => b.isConfirmed);

  return (
    <label className="flex items-center gap-2">
      <span className="label">Your barber</span>
      <select
        value={homeBarberId || ""}
        onChange={(e) => setHomeBarberId(e.target.value || null)}
        className="max-w-[190px] cursor-pointer truncate border-none bg-transparent p-0 text-[10px] font-medium uppercase tracking-label text-ink outline-none"
      >
        <option value="">None set</option>
        {confirmed.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name} — {b.cityName}
          </option>
        ))}
      </select>
    </label>
  );
}
