// SuperFastHash · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-superfast',
  categoryId: 'hashing',
  title: { zh: 'SuperFastHash', en: 'SuperFastHash' },
  summary: {
    zh: 'Paul Hsieh SuperFastHash 的别名实现（与 paul-hsieh 算法同源）。',
    en: 'An alias-family implementation of Paul Hsieh SuperFastHash (same source as paul-hsieh).',
  },
  description: {
    zh: 'SuperFastHash 是 Paul Hsieh 提出的高速 32 位非加密哈希。此实现与 hash-paul-hsieh 同源，但以块大小 8 重新参数化以便对比。',
    en: 'SuperFastHash is Paul Hsieh high-speed 32-bit non-crypto hash. Same family as hash-paul-hsieh, re-parameterized here for comparison.',
  },
  tags: ['hashing', 'non-crypto'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
