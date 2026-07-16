// 球面距离（Haversine）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-spherical-distance',
  categoryId: 'geometry',
  title: { zh: '球面距离（Haversine）', en: 'Spherical Distance (Haversine)' },
  summary: {
    zh: 'Haversine 公式计算地球表面两经纬度点间的大圆距离。',
    en: 'Haversine formula for the great-circle distance between two lat/long points.',
  },
  description: {
    zh: 'Haversine 公式计算球面上两点（经纬度）的大圆距离：\n```\na = sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlon/2)\nc = 2·asin(√a)\nd = R · c\n```\n\nR 取地球平均半径 6371 km。Haversine 对小距离数值稳定性好（避免余弦公式在小角度时精度损失）。\n\n复杂度 O(1)。广泛用于地理信息系统（GIS）、导航。',
    en: 'The Haversine formula computes the great-circle distance between two points (lat/long) on a sphere: a = sin²(Δlat/2)+cos(lat1)·cos(lat2)·sin²(Δlon/2); c = 2·asin(√a); d = R·c. R = 6371 km. Numerically stable for small distances. Used in GIS and navigation. O(1).',
  },
  tags: ['geometry', 'haversine', 'spherical', 'gis', 'great-circle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
