// 彩票调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-llottery',
  categoryId: 'scheduling',
  title: { zh: '彩票调度', en: 'Lottery Scheduling' },
  summary: {
    zh: '按彩票数概率抽签选进程。',
    en: 'Probabilistically pick process by ticket count.',
  },
  description: {
    zh: '总票数内随机抽，落在某进程区间则选中。',
    en: 'Random within total tickets. O(n) per pick.',
  },
  tags: ['scheduling', 'lottery'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
