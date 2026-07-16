// 花朵授粉算法（Flower Pollination Algorithm）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-flower-pollin',
  categoryId: 'ai-search',
  title: { zh: '花朵授粉算法', en: 'Flower Pollination Algorithm' },
  summary: {
    zh: '异花授粉（全局 Lévy 飞行）与自花授粉（局部扰动）切换。',
    en: 'Switch between cross-pollination (global Lévy flight) and self-pollination (local).',
  },
  description: {
    zh: '花朵授粉算法（Yang 2012）：以概率 p 走全局授粉 x = x + L·(x − x*)，L 为 Lévy 步长；否则局部自花授粉 x = x + ε·(xj − xk)。本实现最小化 Sphere。',
    en: 'FPA (Yang 2012): with probability p do global pollination x = x + L·(x − x*), L is a Lévy step; otherwise local self-pollination x = x + ε·(xj − xk). Minimizes Sphere.',
  },
  tags: ['ai-search', 'nature', 'optimization', 'flower'],
  complexity: { time: 'O(iter × flowers × d)', space: 'O(flowers × d)' },
};
