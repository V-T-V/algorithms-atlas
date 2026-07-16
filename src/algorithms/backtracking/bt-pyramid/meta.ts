// 截断金字塔路径 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-pyramid',
  categoryId: 'backtracking',
  title: { zh: '截断金字塔路径', en: 'Pyramid Transition Matrix' },
  summary: { zh: '判断能否从底串构建到金字塔顶。', en: 'Can build pyramid from bottom to top.' },
  description: {
    zh: '回溯：每对相邻字符尝试允许的上方字符。',
    en: 'Backtrack allowed tops per pair. O(k^n).',
  },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(k^n)', space: 'O(n)' },
};
