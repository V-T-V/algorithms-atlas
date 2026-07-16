// 区间调度（活动选择）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'interval-scheduling',
  categoryId: 'scheduling',
  title: { zh: '区间调度（活动选择）', en: 'Interval Scheduling (Activity Selection)' },
  summary: {
    zh: '贪心选最早结束的不相交区间，最大化可选活动数。',
    en: 'Greedy pick the earliest-finishing non-overlapping interval to maximize the number of activities.',
  },
  description: {
    zh: '区间调度问题（活动选择）：给定 n 个活动，每个活动有开始时间 sᵢ 和结束时间 fᵢ，选出一个最大子集，使得子集中任意两活动时间不重叠。\n\n**贪心算法**（按结束时间排序）：\n1. 把所有活动按**结束时间**升序排序（平局按开始时间）。\n2. 维护「上一个选中活动的结束时间」lastEnd = -∞。\n3. 依次扫描：若当前活动的开始时间 ≥ lastEnd，则选中它，更新 lastEnd = 它的结束时间；否则跳过。\n\n**正确性**（交换论证）：设贪心解选 k 个，最优解选 OPT 个。可证明贪心每一步的选择都不会比最优差——用结束更早的活动替换最优解的第一个活动，仍不重叠且不减少数量。归纳得贪心 = 最优。\n\n复杂度：排序 O(n log n) + 扫描 O(n)。这是贪心算法的经典范例。',
    en: 'Interval scheduling (activity selection): given n activities each with start time sᵢ and finish time fᵢ, select a maximum subset of pairwise non-overlapping activities.\n\n**Greedy algorithm** (sort by finish time):\n1. Sort activities by **finish time** ascending (ties by start time).\n2. Maintain "last selected finish time" lastEnd = -∞.\n3. Scan in order: if the current activity\'s start ≥ lastEnd, select it and update lastEnd = its finish; otherwise skip.\n\n**Correctness** (exchange argument): suppose greedy selects k and optimum selects OPT. Each greedy choice is no worse than optimum — replacing the optimum\'s first activity with an earlier-finishing one keeps everything non-overlapping without reducing the count. By induction greedy = optimum.\n\nComplexity: sort O(n log n) + scan O(n). This is the canonical example of a greedy algorithm.',
  },
  tags: ['scheduling', 'greedy', 'interval', 'activity-selection'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
