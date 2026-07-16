// 滑动窗口去重计数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sliding-window-distinct',
  categoryId: 'design',
  title: { zh: '滑动窗口去重计数', en: 'Sliding Window Distinct Count' },
  summary: {
    zh: '用哈希计数表维护窗口内各值频次，新增/移除时增减计数，O(1) 维护不同元素个数。',
    en: 'A hash frequency map over the window increments/decrements counts, maintaining distinct count in O(1).',
  },
  description: {
    zh: '求每个大小为 k 的滑动窗口中不同元素的个数。朴素法每窗口用 Set 重建 O(n·k)；哈希计数法 O(n)：\n\n- 维护 `freq: Map<value, count>` 与计数 `distinct`\n- 入窗元素 v：freq[v] 从 0→1 时 distinct++，freq[v]++\n- 出窗元素 u：freq[u]--，freq[u] 从 1→0 时 distinct--\n- 每窗口记录当前 distinct\n\n这是「数据流基数估计」的最简形式（精确而非近似），展示了「频次表 + 增量维护」的设计范式。',
    en: 'Count the number of distinct elements in each size-k sliding window. Naively O(n·k) rebuilding a Set each window; the frequency-map approach is O(n):\n\n- Maintain `freq: Map<value, count>` and a counter `distinct`\n- On adding v: distinct++ when freq[v] goes 0→1, then freq[v]++\n- On removing u: freq[u]--; distinct-- when freq[u] goes 1→0\n- Record `distinct` per window\n\nThis is the simplest exact (not approximate) form of stream cardinality estimation, illustrating the "frequency map + incremental maintenance" design pattern.',
  },
  tags: ['design', 'sliding-window', 'hash-map', 'frequency'],
  complexity: { time: 'O(n)', space: 'O(k)' },
};
