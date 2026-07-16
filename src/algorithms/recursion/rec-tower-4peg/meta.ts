// 4柱汉诺塔 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-tower-4peg',
  categoryId: 'recursion',
  title: { zh: '4柱汉诺塔', en: "Reve's Puzzle (4 pegs)" },
  summary: {
    zh: '4柱汉诺塔（Reve 难题）：Frame-Stewart 算法，比 2^n−1 更少步数。',
    en: '4-peg Hanoi (Reve puzzle): Frame-Stewart algorithm uses fewer moves than 2^n−1.',
  },
  description: {
    zh: '四柱汉诺塔：用 Frame-Stewart 启发式，把盘子分成两部分，借助多出的柱子降低步数上限。',
    en: 'Four-peg Hanoi: Frame-Stewart heuristic splits disks to exploit the extra peg and reduce move count.',
  },
  tags: ['recursion', 'classic', 'hanoi', 'frame-stewart'],
  complexity: { time: 'O(2^(√n))', space: 'O(n)' },
};
