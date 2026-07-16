// 灯泡开关 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-bulb-2',
  categoryId: 'misc',
  title: { zh: '灯泡开关', en: 'Bulb Switcher' },
  summary: {
    zh: 'n 个灯泡每个轮 toggle；最终亮的 = ⌊√n⌋（只完全平方数位置亮）。',
    en: 'Each round toggles bulbs; final lit count = ⌊√n⌋ (only perfect-square positions stay on).',
  },
  description: {
    zh: 'LeetCode 319 灯泡开关：第 i 轮切换编号是 i 倍数的灯。最终亮灯数 = ⌊√n⌋。',
    en: 'LeetCode 319 Bulb Switcher: round i toggles multiples of i. Lit count = ⌊√n⌋.',
  },
  tags: ['misc', 'math', 'leetcode'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
