// Mersenne Twister · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mersenne-twister',
  categoryId: 'randomized',
  title: { zh: '梅森旋转 MT19937', en: 'Mersenne Twister (MT19937)' },
  summary: {
    zh: '事实标准的伪随机数生成器，周期 2¹⁹⁹³⁷−1，分布优良。',
    en: 'The de-facto standard PRNG with period 2¹⁹⁹³⁷−1 and excellent distribution.',
  },
  description: {
    zh: '梅森旋转（Mersenne Twister, MT19937）由松本真・西村拓士于 1997 年提出，因其巨大周期（2¹⁹⁹³⁷−1，梅森素数）、良好的均匀分布、以及高达 623 维的 k-分布性而成为众多语言（Python、Ruby、PHP）random 模块的默认实现。\n\n算法分两阶段：\n- **初始化（init）**：用线性同余将种子展开为 624 个 32 位状态字。\n- **抽取（extract）**：状态耗尽时用「扭曲（twist）」递推刷新 624 字；每次输出再经「回火（tempering）」4 步位移混合以改善低位统计。\n\n本实现 `MersenneTwister` 提供 `next()`（无符号 32 位）、`nextFloat()`（[0,1)）、`nextInt(max)`。同一种子完全可复现。',
    en: 'The Mersenne Twister (MT19937), devised by Makoto Matsumoto and Takuji Nishimura in 1997, became the default PRNG in many languages (Python, Ruby, PHP) thanks to its enormous period (2¹⁹⁹³⁷−1, a Mersenne prime), good uniformity, and k-distribution up to dimension 623.\n\nThe algorithm has two stages:\n- **Initialization**: a linear congruence expands the seed into 624 32-bit state words.\n- **Extraction**: when the state is exhausted, a "twist" recurrence refreshes all 624 words; each output is then passed through a four-shift "tempering" step to improve low-bit statistics.\n\nThis `MersenneTwister` implementation provides `next()` (unsigned 32-bit), `nextFloat()` ([0,1)), and `nextInt(max)`. The same seed is fully reproducible.',
  },
  tags: ['randomized', 'prng', 'simulation', 'number-theory'],
  complexity: { time: 'O(1) amortized per draw', space: 'O(624)' },
};
