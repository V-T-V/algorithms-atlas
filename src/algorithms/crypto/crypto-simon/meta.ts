// Simon 轻量密码（Simon）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-simon',
  categoryId: 'crypto',
  title: { zh: 'Simon 轻量密码', en: 'Simon' },
  summary: { zh: 'NSA 设计的轻量 Feistel。', en: 'Lightweight Feistel by NSA.' },
  description: {
    zh: 'Simon(NSA)是一族面向硬件的轻量 Feistel 密码，支持多种块/密钥长度，资源占用极小。',
    en: 'Simon (NSA) is a family of hardware-oriented lightweight Feistel ciphers with varied block/key sizes and tiny footprint.',
  },
  tags: ['crypto', 'simon', 'lightweight', 'feistel'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
