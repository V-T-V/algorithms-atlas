// Sparse Table · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sparse-table',
  categoryId: 'design',
  title: { zh: '稀疏表', en: 'Sparse Table' },
  summary: {
    zh: '稀疏表预处理 O(n log n)，O(1) 回答静态区间最小值（RMQ）。',
    en: 'Sparse table precomputes in O(n log n) for O(1) static range-minimum queries (RMQ).',
  },
  description: {
    zh: '稀疏表（Sparse Table）是解决**静态 RMQ**（Range Minimum Query）的经典数据结构，基于倍增思想：\n\n- 定义 `st[k][i]` = 从下标 i 起、长度 2^k 的区间的最小值（即 min(a[i..i+2^k-1])）。\n- 预处理：`st[0][i] = a[i]`；`st[k][i] = min(st[k-1][i], st[k-1][i+2^(k-1)])`。共 `⌊log2 n⌋+1` 层。\n- 查询 [l, r]：令 `k = ⌊log2(r-l+1)⌋`，答案 = `min(st[k][l], st[k][r-2^k+1])`。两个区间可重叠，对 min 这种**可重复贡献**（idempotent）运算 O(1) 完成。\n\n关键性质：min/max/gcd/lcm 等「重复参与不影响结果」的运算可用稀疏表，而「区间和」不行（会重复计算）。预处理 O(n log n)，查询 O(1)。',
    en: 'The sparse table is the classic structure for **static RMQ** (Range Minimum Query), based on doubling:\n\n- Define `st[k][i]` = the minimum over the range of length 2^k starting at index i (i.e., min(a[i..i+2^k-1])).\n- Preprocess: `st[0][i] = a[i]`; `st[k][i] = min(st[k-1][i], st[k-1][i+2^(k-1)])`. There are `⌊log2 n⌋+1` levels.\n- Query [l, r]: let `k = ⌊log2(r-l+1)⌋`, answer = `min(st[k][l], st[k][r-2^k+1])`. The two ranges may overlap — for min, an **idempotent** (repeatable) operation, this still gives O(1).\n\nKey: min/max/gcd/lcm are idempotent and work with sparse tables; "range sum" does not (it would double-count). Preprocess O(n log n), query O(1).',
  },
  tags: ['design', 'sparse-table', 'rmq', 'doubling'],
  complexity: { time: 'O(n log n) 预处理 / O(1) 查询', space: 'O(n log n)' },
};
