import LandingExplorer from "../components/LandingExplorer";
import { getCities, getConfirmedBarbersByCity, getAllHairTags } from "../lib/data";

export default function HomePage() {
  const cities = getCities();
  const counts = {};
  for (const city of cities) {
    counts[city.slug] = getConfirmedBarbersByCity(city.slug).length;
  }

  return (
    <LandingExplorer cities={cities} counts={counts} hairTags={getAllHairTags()} />
  );
}
