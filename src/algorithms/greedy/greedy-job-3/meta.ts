// 作业调度（带截止期） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-job-3',
  categoryId: 'greedy',
  title: { zh: '作业调度（带截止期）', en: 'Job Sequencing with Deadlines' },
  summary: {
    zh: '每个作业有利润和截止期，每个时间槽只能做一个；最大化总利润。',
    en: 'Each job has profit and deadline, one job per slot; maximize total profit.',
  },
  description: {
    zh: '作业调度问题：n 个作业，job i 利润 p_i、截止期 d_i。单位时间完成一个，目标最大化利润。按利润降序，把每个作业放到 ≤ d_i 的最晚空槽。',
    en: 'Job sequencing: n jobs each with profit p_i and deadline d_i; one job per unit time; maximize profit. Sort by profit desc, place each into the latest free slot ≤ d_i.',
  },
  tags: ['greedy', 'scheduling'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
