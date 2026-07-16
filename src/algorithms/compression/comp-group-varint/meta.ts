// Group-Varint 编码（Group-Varint）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-group-varint',
  categoryId: 'compression',
  title: { zh: 'Group-Varint 编码', en: 'Group-Varint' },
  summary: { zh: '4 个整数共用 1 字节位宽标记。', en: '4 ints share 1-byte width tag.' },
  description: {
    zh: 'Group-Varint(Dean)每 4 个整数共用 1 字节指示每个的位宽(1-4 字节)，减少 varint 的逐字节判断开销，数据库常用。',
    en: 'Group-Varint (Dean) shares 1 tag byte indicating each of 4 ints widths (1-4 bytes), cutting per-byte overhead.',
  },
  tags: ['compression', 'varint', 'group'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
