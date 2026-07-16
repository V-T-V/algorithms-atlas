// BLAKE2bp · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-blake2bp',
  categoryId: 'hashing',
  title: { zh: 'BLAKE2bp', en: 'BLAKE2bp' },
  summary: {
    zh: 'BLAKE2bp：BLAKE2 的并行 4 路变种，针对长输入优化。',
    en: 'BLAKE2bp: 4-way parallel variant of BLAKE2, optimized for long inputs.',
  },
  description: {
    zh: 'BLAKE2bp：把输入拆成 4 路并行 BLAKE2 子哈希再合并。简化 BigInt 教学版。',
    en: 'BLAKE2bp: splits input into 4 parallel BLAKE2 sub-hashes then combines. Simplified BigInt teaching version.',
  },
  tags: ['hashing', 'cryptographic', 'blake'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
