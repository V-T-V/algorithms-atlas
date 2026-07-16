// 零窗口搜索（Zero-Window Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-zero-window',
  categoryId: 'ai-search',
  title: { zh: '零窗口搜索', en: 'Zero-Window Search' },
  summary: {
    zh: '零窗口 alpha-beta：α=β−1，必返回上界或下界。',
    en: 'Zero-window alpha-beta: α=β−1 always returns an upper or lower bound.',
  },
  description: {
    zh: '零窗口搜索将 α、β 设为相邻整数（β = α + 1）。alpha-beta 必 fail-high（返回下界 ≥ β）或 fail-low（返回上界 ≤ α）。是 MTD(f)、Negascout 的核心构件。',
    en: 'Zero-window search sets α and β to adjacent integers (β = α + 1). alpha-beta must fail high (return lower bound ≥ β) or fail low (return upper bound ≤ α). It is the building block of MTD(f) and Negascout.',
  },
  tags: ['ai-search', 'zero-window', 'alpha-beta', 'scout'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
