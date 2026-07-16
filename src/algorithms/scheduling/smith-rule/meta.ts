// Smith 比例规则（最小化 ΣwjCj）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'smith-rule',
  categoryId: 'scheduling',
  title: { zh: 'Smith 规则（最小化 ΣwjCj）', en: "Smith's Rule (Minimize ΣwjCj)" },
  summary: {
    zh: '单机带权总完工：按 wj/pj 降序（WSPT）调度最优。',
    en: 'Single-machine weighted completion: order by wj/pj descending (WSPT) is optimal.',
  },
  description: {
    zh: '问题：单机、n 个作业，每个作业 j 有处理时间 pj 和权重 wj，目标最小化加权总完工时间 Σwj·Cj。Smith 规则（又称 WSPT, Weighted Shortest Processing Time）证明：按 wj/pj（权重/处理时间）降序排序后顺序执行即最优。\n\n- wj/pj 越大（单位时间收益高）越应先做\n- 当所有 wj=1 时退化为 SPT（最短处理时间优先）\n- 非抢占式单机最优，复杂度 O(n log n)\n\n本实现假设所有作业 t=0 同时就绪。',
    en: "On a single machine with n jobs (processing time pj, weight wj), minimizing Σwj·Cj is solved optimally by Smith's rule (WSPT): order by wj/pj descending. Larger ratio (more value per unit time) goes first. When all wj=1 it reduces to SPT. Optimal for non-preemptive single machine, all released at t=0.",
  },
  tags: ['scheduling', 'smith-rule', 'wspt', 'optimization', 'single-machine'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
