// 快速选择（双轴）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quickselect-dual-pivot',
  categoryId: 'selection',
  title: { zh: '快速选择（双轴）', en: 'Quickselect (Dual-Pivot)' },
  summary: {
    zh: '双轴三分区：把数组分为 <p1 / [p1,p2] / >p2 后只递归目标段。',
    en: 'Dual-pivot 3-way partition into <p1, [p1,p2], >p2 and recurse into the target segment.',
  },
  description: {
    zh: '双轴快速选择借鉴双轴快排：选两个基准 p1 ≤ p2，把数组分成三段：左段 <p1、中段 [p1,p2]、右段 >p2。分区后根据 k 落在哪一段，只递归那一段：\n- k 在左段长度内 → 递归左段\n- k 在左+中段内 → 答案落在中段，若中段非空则 p1 或 p2\n- 否则递归右段（k 减去左+中长度）\n\n- 期望比较次数比单轴略少\n- 期望 O(n)，最坏 O(n²)',
    en: 'Dual-pivot quickselect picks p1 ≤ p2 and partitions into three segments (<p1, [p1,p2], >p2). Recurse only into the segment containing rank-k. Expected O(n), worst O(n²).',
  },
  tags: ['selection', 'quickselect', 'dual-pivot', 'divide-and-conquer'],
  complexity: { time: 'O(n) 期望', space: 'O(log n)' },
};
