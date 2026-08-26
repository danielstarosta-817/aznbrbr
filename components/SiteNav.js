"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeBarberPicker from "./HomeBarberPicker";

export default function SiteNav({ cities, allBarbers }) {
  const pathname = usePathname();
  const totalVouched = allBarbers.filter((b) => b.isConfirmed).length;
  const onLanding = pathname === "/";

  return (
    <header className="flex items-center justify-between border-b border-rule px-8 py-5">
      <Link
        href="/"
        className="font-display text-[19px] font-semibold uppercase tracking-label"
      >
        aznbrbr
</Link>

      <div className="flex items-center gap-7">
        {!onLanding && (
          <Link href="/" className="label transition-colors hover:text-ink">
            All cities
          </Link>
        )}
        <span className="label">
          {cities.length} cities · {totalVouched} vouched shops
        </span>
        <HomeBarberPicker barbers={allBarbers} />
      </div>
    </header>
  );
}
