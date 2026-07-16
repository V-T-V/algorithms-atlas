// 电话号码字母组合 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-letter-combos',
  categoryId: 'backtracking',
  title: { zh: '电话号码字母组合', en: 'Letter Combinations of Phone' },
  summary: {
    zh: '按键数字串对应的所有字母组合。',
    en: 'All letter combos for a phone digit string.',
  },
  description: { zh: '回溯：每位映射 3-4 字母。', en: 'Backtrack per digit. O(4^n).' },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(4^n)', space: 'O(n)' },
};
