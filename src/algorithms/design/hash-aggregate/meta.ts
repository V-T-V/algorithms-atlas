// 哈希聚合设计 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-aggregate',
  categoryId: 'design',
  title: { zh: '哈希聚合设计', en: 'Hash Aggregate Design' },
  summary: {
    zh: '用哈希表按 key 分组：每组的值用累加器（sum/count/avg/min/max）合并，O(n) 完成。',
    en: 'Group rows by key via a hash map; merge values per group with an accumulator (sum/count/avg/min/max) in O(n).',
  },
  description: {
    zh: '哈希聚合是 SQL `GROUP BY` 的核心实现之一（另一是排序聚合）。流程：\n\n1. 扫描每条记录 (key, value)\n2. 以 key 为哈希键查表：\n   - 未见过 → 插入新累加器（初始值由聚合函数决定）\n   - 已存在 → 用当前 value 更新累加器\n3. 输出 (key, finalAggregate) 对\n\n支持的聚合函数（用统一累加器接口）：\n- count：cnt += 1\n- sum：s += value\n- avg：sum += value；count += 1；结果 = sum/count\n- min/max：比较更新\n\n复杂度：平均 O(n)（哈希良好时），最坏 O(n²)（全部冲突到同一桶，实际实现会扩容/换树兜底）。\n\n本实现展示通用 hashAggregate(rows, keyFn, accFactory) 框架与多种聚合函数实例。',
    en: 'Hash aggregation is one of the two core implementations of SQL `GROUP BY` (the other being sort aggregation). Flow:\n\n1. Scan each record (key, value)\n2. Look up by key in a hash map:\n   - First time → insert a fresh accumulator (initial value depends on the aggregate function)\n   - Exists → update the accumulator with the current value\n3. Output (key, finalAggregate) pairs\n\nSupported aggregates (via a unified accumulator interface):\n- count: cnt += 1\n- sum: s += value\n- avg: sum += value; count += 1; result = sum/count\n- min/max: compare and update\n\nComplexity: average O(n) (with a good hash); worst case O(n²) (all collide into one bucket — real implementations resize / fall back to a tree).\n\nThis implementation shows a generic hashAggregate(rows, keyFn, accFactory) framework and several aggregate-function instances.',
  },
  tags: ['design', 'aggregation', 'hash-map', 'group-by'],
  complexity: { time: 'O(n) avg', space: 'O(g) groups' },
};
