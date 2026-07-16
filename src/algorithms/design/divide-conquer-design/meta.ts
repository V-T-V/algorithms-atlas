// 分治设计范式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'divide-conquer-design',
  categoryId: 'design',
  title: { zh: '分治设计范式', en: 'Divide and Conquer Paradigm' },
  summary: {
    zh: '把问题拆成独立子问题递归求解再合并：分、治、合三步，常由主定理给出复杂度。',
    en: 'Split a problem into independent subproblems, solve recursively, then combine — divide, conquer, combine; master theorem bounds cost.',
  },
  description: {
    zh: '分治（Divide and Conquer）是最基本的设计范式之一：\n\n1. **分（Divide）**：把输入分成规模相近的若干子问题\n2. **治（Conquer）**：递归求解子问题（足够小则直接解）\n3. **合（Combine）**：合并子问题的解\n\n适用条件：\n- 子问题相互独立（无重叠，否则用 DP/记忆化）\n- 子问题与原问题同构\n- 合并代价不致过高\n\n典型实例：归并排序 T(n)=2T(n/2)+O(n)=O(n log n)；快速排序 T(n)=T(k)+T(n-k-1)+O(n)（平均 O(n log n)）；二分查找 T(n)=T(n/2)+O(1)=O(log n)；最近点对 T(n)=2T(n/2)+O(n)=O(n log n)。\n\n复杂度通常用主定理：T(n)=aT(n/b)+O(n^d)，比较 a 与 b^d。\n\n本实现以归并排序为载体展示分/治/合三步，并把递归调用树绘制出来。',
    en: 'Divide and Conquer is one of the most fundamental design paradigms:\n\n1. **Divide**: split the input into several subproblems of similar size\n2. **Conquer**: solve subproblems recursively (solve directly when small enough)\n3. **Combine**: merge the subproblem solutions\n\nApplicability:\n- Subproblems are independent (no overlap — otherwise use DP/memoization)\n- Subproblems are structurally identical to the original\n- The combine cost is not too high\n\nCanonical instances: merge sort T(n)=2T(n/2)+O(n)=O(n log n); quick sort T(n)=T(k)+T(n-k-1)+O(n) (avg O(n log n)); binary search T(n)=T(n/2)+O(1)=O(log n); closest pair T(n)=2T(n/2)+O(n)=O(n log n).\n\nComplexity usually follows the master theorem: T(n)=aT(n/b)+O(n^d), comparing a with b^d.\n\nThis implementation uses merge sort to illustrate the three steps and draws the recursion tree.',
  },
  tags: ['design', 'paradigm', 'recursive', 'merge-sort'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
