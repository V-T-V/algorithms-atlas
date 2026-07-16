// RIPEMD-160（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-ripemd160-impl',
  categoryId: 'hashing',
  title: { zh: 'RIPEMD-160（简化）', en: 'RIPEMD-160 (simplified)' },
  summary: {
    zh: 'RIPEMD-160：160 位强化版，仍用于比特币地址。',
    en: 'RIPEMD-160: strengthened 160-bit version, still used in Bitcoin addresses.',
  },
  description: {
    zh: 'RIPEMD-160：5 字（160 位）输出，两条并行链 + 5 轮混合。简化 256 位教学版。',
    en: 'RIPEMD-160: 5-word (160-bit) output, two parallel chains with 5 rounds. Simplified 256-bit teaching version.',
  },
  tags: ['hashing', 'cryptographic', 'bitcoin'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
