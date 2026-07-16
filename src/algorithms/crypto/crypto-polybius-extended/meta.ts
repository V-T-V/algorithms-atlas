// 扩展波利比奥斯方阵 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-polybius-extended',
  categoryId: 'crypto',
  title: { zh: '扩展波利比奥斯方阵', en: 'Extended Polybius Square' },
  summary: {
    zh: '5×5 方阵把字母映射为两位坐标（I/J 合并），可自定义关键字打乱布局。',
    en: '5×5 square maps each letter to a two-digit coordinate (I/J merged), optionally scrambled by a keyword.',
  },
  description: {
    zh: '默认按字母序填表；提供关键字则先填去重后的关键字。每个字母 → (行,列) 1..5。',
    en: 'Default fills alphabetically; a keyword is deduped and placed first. Each letter → (row,col) in 1..5.',
  },
  tags: ['crypto', 'substitution', 'classical'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
