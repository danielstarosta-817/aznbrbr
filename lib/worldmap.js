// Coarse landmass polygons in [lon, lat] pairs, used only to stipple a dot-grid
// world silhouette. Deliberately approximate — the dots blur the imprecision,
// and this is decorative context for the city marks, not a geographic reference.
const LAND = [
  // North America
  [[-168, 65], [-140, 70], [-100, 72], [-80, 70], [-62, 50], [-75, 42], [-80, 25], [-97, 17], [-105, 22], [-125, 40], [-140, 60]],
  // Greenland
  [[-55, 60], [-20, 66], [-22, 80], [-58, 80]],
  // South America
  [[-80, 9], [-60, 10], [-35, -5], [-35, -23], [-55, -35], [-72, -52], [-73, -20], [-81, -4]],
  // Africa
  [[-17, 15], [10, 35], [33, 32], [43, 12], [51, 11], [40, -4], [38, -20], [25, -34], [18, -34], [12, -16], [8, 4], [-8, 5], [-17, 12]],
  // Eurasia
  [[-10, 36], [0, 44], [8, 54], [4, 60], [28, 70], [60, 72], [100, 76], [140, 72], [162, 68], [170, 60], [142, 50], [135, 34], [120, 22], [105, 10], [97, 6], [80, 8], [72, 21], [58, 26], [45, 12], [35, 30], [28, 36], [14, 38], [0, 36]],
  // SE Asia / Indonesia
  [[95, 5], [120, 6], [141, -4], [120, -10], [99, -6]],
  // Australia
  [[113, -22], [130, -11], [143, -11], [151, -25], [146, -38], [135, -35], [115, -34]],
  // Japan
  [[130, 32], [140, 36], [146, 44], [140, 42], [132, 33]],
  // British Isles
  [[-7, 50], [2, 52], [0, 58], [-7, 57]],
];

export const MAP_W = 900;
export const MAP_H = 335;
const LON_MIN = -170;
const LON_MAX = 180;
const LAT_MAX = 76;
const LAT_MIN = -50;

export function project(lon, lat) {
  return {
    x: ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_W,
    y: ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_H,
  };
}

function pointInPolygon(lon, lat, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// Precomputed once at module load — the grid never changes.
export const LAND_DOTS = (() => {
  const dots = [];
  const step = 8;
  for (let y = 5; y < MAP_H; y += step) {
    for (let x = 4; x < MAP_W; x += step) {
      const lon = LON_MIN + (x / MAP_W) * (LON_MAX - LON_MIN);
      const lat = LAT_MAX - (y / MAP_H) * (LAT_MAX - LAT_MIN);
      if (LAND.some((poly) => pointInPolygon(lon, lat, poly))) {
        dots.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
    }
  }
  return dots;
})();

// Real coordinates for the eleven seeded cities.
export const CITY_COORDS = {
  seattle: [-122.33, 47.61],
  nyc: [-74.0, 40.71],
  chicago: [-87.63, 41.88],
  toronto: [-79.38, 43.65],
  london: [-0.13, 51.51],
  paris: [2.35, 48.86],
  berlin: [13.4, 52.52],
  amsterdam: [4.9, 52.37],
  madrid: [-3.7, 40.42],
  lisbon: [-9.14, 38.72],
  sydney: [151.21, -33.87],
};
