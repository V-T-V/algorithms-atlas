// FNV-1 32位（FNV-1 32-bit）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-fnv1-32',
  categoryId: 'hashing',
  title: { zh: 'FNV-1 32位', en: 'FNV-1 32-bit' },
  summary: {
    zh: 'Fowler-Noll-Vo 非加密哈希：offset basis 异或再乘素数，分布均匀速度快。',
    en: 'Fowler-Noll-Vo non-crypto hash: XOR offset basis then multiply prime; fast, well-distributed.',
  },
  description: {
    zh: 'FNV-1：h=offset_basis，每字节 h=h*prime（用 FNV-1）或 h=(h^byte)*prime（FNV-1a）。32位 prime=0x01000193。',
    en: 'FNV-1: h=offset_basis; per byte h=h*prime (FNV-1) or h=(h^byte)*prime (FNV-1a). 32-bit prime=0x01000193.',
  },
  tags: ['hashing', 'non-cryptographic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
