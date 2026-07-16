// =============================================================================
// 球面距离（Haversine）· 纯算法实现
// =============================================================================

export interface LatLng {
  lat: number;
  lng: number;
}

export interface HaversineHooks {
  /** 计算中间量 a 后调用（用于可视化）。 */
  onTerm?: (a: number) => void;
}

export const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Haversine 公式：返回球面两点（lat/lng，度）的大圆距离（km）。
 * 地球半径取 6371 km。
 */
export function haversine(p1: LatLng, p2: LatLng, hooks: HaversineHooks = {}): number {
  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  hooks.onTerm?.(a);
  const c = 2 * Math.asin(Math.min(1, Math.sqrt(a)));
  return EARTH_RADIUS_KM * c;
}
