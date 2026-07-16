// 哈希随机混合器 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-hash-mixer',
  categoryId: 'randomized',
  title: { zh: '哈希随机混合器 (SplitMix)', en: 'Hash Random Mixer (SplitMix)' },
  summary: {
    zh: '用整数混合函数（如 splitmix64 的 γ 乘法 + 位移）把种子变换为均匀分布的伪随机数。',
    en: 'Use an integer mixing function (e.g. splitmix64 gamma-multiply + shifts) to transform a seed into uniformly distributed pseudo-random values.',
  },
  description: {
    zh: '哈希混合器把任意 64 位输入映射为看似随机的 64 位输出。splitmix64 用 gamma = 0x9E3779B97F4A7C15（黄金分割常数）做乘法，再 xorshift27/xorshift17 右移混合，最后乘以另一个常数。输出通过 Avalanche 测试（每位翻转概率 50%）。常用于种子扩展、哈希表扰动。',
    en: 'A hash mixer maps any 64-bit input to an apparently random 64-bit output. splitmix64 multiplies by gamma = 0x9E3779B97F4A7C15 (golden-ratio constant), then mixes with xorshift27/xorshift17 right shifts, and multiplies by another constant. Output passes the Avalanche test (each bit flips 50%). Used for seed extension and hash-table perturbation.',
  },
  tags: ['randomized', 'prng', 'hash', 'splitmix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
