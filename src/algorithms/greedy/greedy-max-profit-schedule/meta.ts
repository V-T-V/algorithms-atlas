// 最大利润计划 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-max-profit-schedule',
  categoryId: 'greedy',
  title: { zh: '最大利润计划', en: 'Maximum Profit in Job Scheduling' },
  summary: {
    zh: '在时间不重叠约束下，选择工作使总利润最大（带权区间调度）。',
    en: 'Choose non-overlapping jobs to maximize total profit (weighted interval scheduling).',
  },
  description: {
    zh: '按结束时间排序，DP+二分：dp[i]=max(不选i, 利润i+dp[上一个不冲突])。',
    en: 'Sort by end time; DP + binary search: dp[i]=max(skip i, profit[i]+dp[prev non-conflicting]).',
  },
  tags: ['greedy', 'dp', 'interval', 'binary-search'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
