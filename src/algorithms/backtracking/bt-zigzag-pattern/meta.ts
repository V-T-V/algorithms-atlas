// 之字形变换 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-zigzag-pattern',
  categoryId: 'backtracking',
  title: { zh: '之字形变换', en: 'Zigzag Conversion' },
  summary: {
    zh: '把字符串按之字形排列后按行读出。',
    en: 'Convert string to zigzag rows then read row by row.',
  },
  description: { zh: '模拟行号增减。', en: 'Simulate row up/down. O(n).' },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
