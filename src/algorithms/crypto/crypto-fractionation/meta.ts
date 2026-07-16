// 分馏密码（Morbit）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-fractionation',
  categoryId: 'crypto',
  title: { zh: '分馏密码（Morbit）', en: 'Fractionation Cipher (Morbit)' },
  summary: {
    zh: '把字母转成摩尔斯电码，再把每对点划重新映射为单字符，实现强扩散。',
    en: 'Convert letters to Morse, then map each dot/dash pair to a single character for strong diffusion.',
  },
  description: {
    zh: '步骤1：字母→摩尔斯；步骤2：每两个电码符号（·/-/分隔）按 9 种组合重映射。',
    en: 'Step 1: letters → Morse. Step 2: each pair of symbols (·/-/sep) remapped via 9 combinations.',
  },
  tags: ['crypto', 'fractionation', 'morse'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
