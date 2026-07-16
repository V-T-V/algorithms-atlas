// 种子扩展（多个独立子流）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-seed-extend',
  categoryId: 'randomized',
  title: { zh: '种子扩展（独立子流）', en: 'Seed Extension (Independent Substreams)' },
  summary: {
    zh: '从一个主种子派生多个独立子流种子，使并行/分块采样互不重叠。',
    en: 'Derive multiple independent substream seeds from a master seed so parallel/block sampling does not overlap.',
  },
  description: {
    zh: '种子扩展：主种子经哈希混合得到 base，每个子流种子 = splitMix(base + i*STRIDE)。子流之间通过跳步（jump）保证状态互不相交。广泛用于并行蒙特卡洛、分块随机化。本实现用 splitMix64 派生。',
    en: 'Seed extension: hash the master seed to a base, then substream i = splitMix(base + i*STRIDE). Strides/jumps keep substream states disjoint. Widely used for parallel Monte Carlo and blocked randomization. We derive via splitMix64.',
  },
  tags: ['randomized', 'seed', 'parallel', 'substream'],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
