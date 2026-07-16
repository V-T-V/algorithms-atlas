// SHA-3 / Keccak · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sha3-keccak',
  categoryId: 'crypto',
  title: { zh: 'SHA-3 / Keccak 海绵', en: 'SHA-3 / Keccak Sponge' },
  summary: {
    zh: 'Keccak 海绵结构：吸收 + 挤出，简化教学版。',
    en: 'Keccak sponge construction: absorb + squeeze (simplified teaching version).',
  },
  description: {
    zh: 'SHA-3 基于 Keccak 的「海绵结构」：状态是一个位数组，先「吸收」(absorb) 输入分块（异或进状态后做置换），再「挤出」(squeeze) 所需长度的摘要。本实现用简化的可逆线性/非线性混合演示海绵框架，输出 256 位十六进制摘要（非密码学安全）。',
    en: 'SHA-3 is based on Keccak\'s sponge construction: the state is a bit array that first "absorbs" input blocks (XOR into state, then permute) and then "squeezes" out a digest of the desired length. This implementation uses a simplified reversible linear/nonlinear mix to illustrate the sponge framework, outputting a 256-bit hex digest (NOT cryptographically secure).',
  },
  tags: ['crypto', 'hash', 'sponge'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
