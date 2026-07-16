// Peter Pearson 哈希（Pearson Hash）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-peter-pearson',
  categoryId: 'crypto',
  title: { zh: 'Peter Pearson 哈希', en: 'Pearson Hash' },
  summary: { zh: '用 256 字节查找表生成 8 位哈希。', en: '8-bit hash via 256-byte table.' },
  description: {
    zh: 'Pearson 哈希用一张 256 字节随机排列表，逐字节更新哈希，可扩展为 16/32 位，简单快速。',
    en: 'Pearson hash uses a 256-byte permutation table to fold each byte into an 8-bit hash; extensible to 16/32 bits.',
  },
  tags: ['crypto', 'hash', 'pearson'],
  complexity: { time: 'O(n)', space: 'O(256)' },
};
