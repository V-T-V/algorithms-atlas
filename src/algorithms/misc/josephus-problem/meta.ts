// Josephus Problem · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'josephus-problem',
  categoryId: 'misc',
  title: { zh: '约瑟夫环', en: 'Josephus Problem' },
  summary: {
    zh: 'n 人围坐一圈，每数到第 k 个出列，求最后幸存者的编号。',
    en: 'n people in a circle, every k-th is eliminated; find the last survivor.',
  },
  description: {
    zh: '约瑟夫问题（Josephus Problem）：编号 0..n-1 的 n 个人围成一圈，从 0 号起从 1 开始报数，每报到第 k 个人就出列，然后从下一位重新报数。求最后剩下的幸存者编号。\n\n两种经典解法：\n- **模拟法**：用数组维护存活者，O(n²)。能顺便给出完整出列顺序。\n- **递推公式**：J(1,k)=0；J(n,k)=(J(n-1,k)+k) mod n。O(n) 时间、O(1) 空间。\n\n本模块两者都提供：`josephus` 用递推算幸存者，`josephusSequence` 用模拟给出出列顺序。',
    en: 'The Josephus Problem: n people numbered 0..n-1 form a circle. Counting from 0 at 1, every k-th person is eliminated and counting resumes. Find the last survivor.\n\nTwo classic solutions:\n- **Simulation**: keep survivors in an array, O(n²). Yields the full elimination order.\n- **Recurrence**: J(1,k)=0; J(n,k)=(J(n-1,k)+k) mod n. O(n) time, O(1) space.\n\nThis module provides both: `josephus` via the recurrence, `josephusSequence` via simulation.',
  },
  tags: ['misc', 'simulation', 'number-theory', 'recurrence'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
