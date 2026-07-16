// 区间异或 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-xor-range',
  categoryId: 'bitwise',
  title: { zh: '区间异或', en: 'Range XOR' },
  summary: {
    zh: '用 xor(1..n) 的 O(1) 公式求 [lo,hi] 上所有整数的异或和。',
    en: 'Compute XOR of all integers in [lo,hi] via the O(1) xor(1..n) formula.',
  },
  description: {
    zh:
      '区间异或（Range XOR）：求 `lo ^ (lo+1) ^ ... ^ hi`。' +
      '\n利用「前缀异或」的 O(1) 公式：' +
      '\n`xor(1..n)` 按 n mod 4 取值：' +
      '\n- n ≡ 0 (mod 4) → n' +
      '\n- n ≡ 1 (mod 4) → 1' +
      '\n- n ≡ 2 (mod 4) → n + 1' +
      '\n- n ≡ 3 (mod 4) → 0' +
      '\n故 `xor(lo..hi) = xor(1..hi) ^ xor(1..lo-1)`，整体 `O(1)`。',
    en:
      'Range XOR: compute lo ^ (lo+1) ^ ... ^ hi. ' +
      '\nUsing the O(1) prefix-xor formula: ' +
      '\nxor(1..n) by n mod 4: ' +
      '\n- n ≡ 0 → n; n ≡ 1 → 1; n ≡ 2 → n+1; n ≡ 3 → 0. ' +
      '\nSo xor(lo..hi) = xor(1..hi) ⊕ xor(1..lo−1); overall O(1).',
  },
  tags: ['bitwise', 'xor', 'range', 'math', 'O(1)'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
