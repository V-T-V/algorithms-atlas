// 递归生成 C(n,k) 组合 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'combinations-generation',
  categoryId: 'recursion',
  title: { zh: '递归生成组合 C(n,k)', en: 'Recursive Combinations C(n,k)' },
  summary: {
    zh: '经典「选/不选」回溯：对每个元素选或不选，生成所有 k 元子集。',
    en: 'Classic take/skip backtracking: choose or skip each element to enumerate k-subsets.',
  },
  description: {
    zh: '从 n 个元素中选 k 个的所有组合（C(n,k) 个）。递归策略：从第 start 个元素起，对当前元素「选入组合」然后递归，或「跳过」然后递归下一个；当选满 k 个或剩余不足以凑齐时回溯。\n\n- 维护当前组合 cur 与起始下标 start\n- 若 cur.length === k → 记录一个解\n- 否则枚举 i ∈ [start, n-1]，把 i 加入 cur 后递归到 i+1\n\n共产生 C(n,k) 个解。',
    en: 'All k-subsets of n elements (C(n,k) of them). Strategy: from the current start index, either "take" the element then recurse, or "skip" to the next; backtrack when the combination is full or the remainder cannot fill it.\n\n- Maintain current combo cur and start index\n- If cur.length === k → record a solution\n- Otherwise iterate i ∈ [start, n-1], add i to cur and recurse into i+1\n\nProduces C(n,k) solutions in total.',
  },
  tags: ['recursion', 'backtracking', 'combinatorics'],
  complexity: { time: 'O(C(n,k)·k)', space: 'O(k)' },
};
