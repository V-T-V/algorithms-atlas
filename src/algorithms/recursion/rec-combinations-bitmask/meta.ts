// 位掩码生成组合 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-combinations-bitmask',
  categoryId: 'recursion',
  title: { zh: '位掩码生成组合', en: 'Combination Generation (Bitmask)' },
  summary: {
    zh: '递归枚举 C(n,k)：维护已选个数与起始下标，选满 k 个即记录一个组合。',
    en: 'Recursively enumerate C(n,k): track chosen count and a start index; record a combination once k are chosen.',
  },
  description: {
    zh: '生成从 n 个元素中选 k 个的所有组合（C(n,k)）。递归回溯：维护当前组合 cur、已选个数、起始下标 start。每层从 start 到 n-(还需选的个数) 枚举下一个元素，选入 cur 后递归；当 cur 长度等于 k 时记录。共 C(n,k) 个组合。也可用位掩码枚举所有 n 位中恰好有 k 个 1 的掩码。',
    en: 'Generate all combinations of choosing k from n elements (C(n,k)). Recursive backtracking: keep the current combination cur, the chosen count, and a start index. At each level enumerate the next element from start to n-(remaining needed), add it to cur and recurse; when cur length reaches k, record it. There are C(n,k) combinations in total. Equivalently, enumerate all n-bit masks with exactly k ones.',
  },
  tags: ['recursion', 'backtracking', 'combination', 'bitmask', 'n-choose-k'],
  complexity: { time: 'O(C(n,k)·k)', space: 'O(k)' },
};
