// 最小公倍数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lcm-calc',
  categoryId: 'misc',
  title: { zh: '最小公倍数', en: 'Least Common Multiple' },
  summary: {
    zh: 'LCM(a,b) = a·b / GCD(a,b)；先求最大公约数再除，避免大数溢出。',
    en: 'LCM(a,b) = a·b / GCD(a,b); compute GCD first then divide to avoid overflow.',
  },
  description: {
    zh: '最小公倍数（Least Common Multiple, LCM）是同时被 a 和 b 整除的最小正整数。核心恒等式：LCM(a,b) · GCD(a,b) = a · b，因此 LCM(a,b) = a·b / GCD(a,b)。为避免 a·b 直接相乘溢出（尤其在大数下），应先算 GCD 再做 a/GCD·b（先除后乘）。实现步骤：用欧几里得算法求 g = GCD(a,b)；若 a、b 中有 0，则 LCM = 0；否则 LCM = (a / g) · b，结果取绝对值。LCM 是分数加减（通分）、周期对齐（如两事件周期分别为 a、b，求下次同时发生时间）、信号同步等的基础。本实现展示「求 GCD → 先除后乘」过程，并支持多个数的 LCM 折叠。',
    en: 'The Least Common Multiple (LCM) is the smallest positive integer divisible by both a and b. The key identity: LCM(a,b) · GCD(a,b) = a · b, so LCM(a,b) = a·b / GCD(a,b). To avoid overflow from multiplying a·b directly (especially for large numbers), one computes GCD first then does (a/GCD)·b (divide before multiply). Procedure: use the Euclidean algorithm to get g = GCD(a,b); if either is 0 the LCM is 0; otherwise LCM = (a / g) · b, taking the absolute value. LCM underpins fraction addition (common denominators), cycle alignment (two events with periods a and b — when they next coincide), and signal synchronisation. This implementation visualises the "compute GCD, then divide-before-multiply" process and supports folding LCM over multiple numbers.',
  },
  tags: ['misc', 'number-theory', 'lcm'],
  complexity: { time: 'O(log min(a,b))', space: 'O(1)' },
};
