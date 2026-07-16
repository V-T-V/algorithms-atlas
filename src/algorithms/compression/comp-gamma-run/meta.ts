// Gamma + RLE 混合 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-gamma-run',
  categoryId: 'compression',
  title: { zh: 'Gamma 与 RLE 混合', en: 'Gamma + RLE Hybrid' },
  summary: {
    zh: '先做游程编码，再对游程长度用 Elias gamma 编码，压缩稀疏重复数据。',
    en: 'Apply run-length encoding first, then Elias-gamma encode the run lengths, compressing sparse repetitions.',
  },
  description: {
    zh: 'Gamma+RLE 混合编码：\n\n- 第一阶段：RLE，把连续相同符号压成 (符号, 长度) 序列。\n- 第二阶段：长度值用 Elias gamma 编码（小数高频，gamma 较省）。\n- 适合「大量小游程」的稀疏数据（如位图行）。',
    en: 'Gamma+RLE hybrid:\n\n- Stage 1: RLE compresses runs of identical symbols into (symbol, length) pairs.\n- Stage 2: lengths are Elias-gamma encoded (small lengths are frequent, gamma is efficient).\n- Ideal for sparse data with many small runs (e.g. bitmap rows).',
  },
  tags: ['compression', 'rle', 'entropy'],
  complexity: { time: 'O(n)', space: 'O(R)' },
};
