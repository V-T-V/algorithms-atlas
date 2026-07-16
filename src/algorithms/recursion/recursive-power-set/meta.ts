// 递归生成幂集 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'recursive-power-set',
  categoryId: 'recursion',
  title: { zh: '递归生成幂集', en: 'Recursive Power Set' },
  summary: {
    zh: '对每个元素「含/不含」二选一回溯，生成 2^n 个子集。',
    en: 'Take/skip backtrack over each element to enumerate all 2^n subsets.',
  },
  description: {
    zh: '幂集 = 一个集合所有子集的集合（含空集与自身），共 2^n 个。递归地：对第 i 个元素分两条路——包含它（加入 cur 后递归 i+1）或不包含（直接递归 i+1）；当 i == n 时记录当前子集。\n\n- 基例：i === n → 记录 cur\n- 分支一：不选 i，dfs(i+1)\n- 分支二：选 i，cur.push(i) 后 dfs(i+1)，再回溯\n\n叶子数恰为 2^n。',
    en: 'The power set = all subsets of a set (including empty and itself), totaling 2^n. Recursively: for element i branch two ways — include it (add to cur then recurse i+1) or exclude it (recurse i+1); record cur when i == n.\n\n- Base: i === n → record cur\n- Branch 1: skip i, dfs(i+1)\n- Branch 2: take i, cur.push(i), dfs(i+1), then backtrack\n\nExactly 2^n leaves.',
  },
  tags: ['recursion', 'backtracking', 'combinatorics'],
  complexity: { time: 'O(n·2^n)', space: 'O(n)' },
};
