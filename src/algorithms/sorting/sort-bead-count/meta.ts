// 珠排序（计数实现） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-bead-count',
  categoryId: 'sorting',
  title: { zh: '珠排序（计数实现）', en: 'Bead Sort (Counting Implementation)' },
  summary: {
    zh: '用「珠子层数」模拟重力下落：每列珠数即为该值的排序后位置计数。',
    en: 'Simulate beads falling under gravity; the per-column bead count gives the sorted order.',
  },
  description: {
    zh: '珠排序（Bead Sort / Gravity Sort）用物理直觉：把每个数 v 想象成一根杆上有 v 颗珠子，所有杆并排，让珠子在重力下下落。最终每列（每一层）的珠子数从下到上递减，按列数读取即得非降序结果。本实现用计数数组模拟：对每个值 v，给前 v 个「层」各 +1，最后倒序收集层数。仅适用于非负整数。O(n*max) 时间。',
    en: "Bead sort (gravity sort) is physical: imagine each value v as a rod with v beads; all rods side by side, let beads fall under gravity. The final per-column (per-level) bead counts decrease from bottom to top; reading column counts gives non-decreasing order. This implementation simulates with a counting array: for each value v, increment the first v 'levels', then collect level counts in reverse. Non-negative integers only. O(n*max) time.",
  },
  tags: ['sorting', 'non-comparison', 'integer', 'natural'],
  complexity: { time: 'O(n*max)', space: 'O(n+max)' },
};
