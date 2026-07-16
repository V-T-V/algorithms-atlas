// 24点游戏 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-calc-24',
  categoryId: 'backtracking',
  title: { zh: '24点游戏', en: '24 Game' },
  summary: {
    zh: '判断 4 张牌能否通过 + - * / 得到 24。',
    en: 'Can 4 cards reach 24 via + - * / ?',
  },
  description: { zh: '回溯两两合并。', en: 'Backtrack merging two numbers. O(1).' },
  tags: ['backtracking', 'arithmetic'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
