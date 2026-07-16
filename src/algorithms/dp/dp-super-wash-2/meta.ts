import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-super-wash-2',
  categoryId: 'dp',
  title: { zh: '超级洗衣机', en: 'Super Washing Machines' },
  summary: {
    zh: '每次每台机器可向相邻移动一件衣服，求让所有机器衣服数相同的最少操作轮数。',
    en: 'Move one dress per machine per step to an adjacent machine; minimize steps to equalize.',
  },
  description: {
    zh: 'LeetCode 517。先求平均值 avg，对每台机器 i 累计流量 gain（左侧缺/多）。答案 = max over i of max(|left flow|, max(0, machines[i]-avg))。本质是贪心。',
    en: 'LC 517. Compute average, then per machine track cumulative flow; answer is max of |flow| and surplus at each step.',
  },
  tags: ['dp', 'greedy', 'flow'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
