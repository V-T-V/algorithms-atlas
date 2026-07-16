// 自适应反馈调度 (Adaptive Feedback) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-multi-level-feedback-2',
  categoryId: 'scheduling',
  title: { zh: '自适应反馈调度 (Adaptive Quantum)', en: 'Adaptive Feedback Scheduling' },
  summary: {
    zh: '反馈式变体：根据进程近期 CPU 使用行为动态调整其时间片大小。',
    en: 'Feedback variant: dynamically tune each process quantum based on its recent CPU-usage behavior.',
  },
  description: {
    zh: '自适应反馈调度是 MLFQ 思想的另一种实现：不维护多个固定优先级队列，而是为每个进程维护一个动态时间片。若进程连续用满时间片（CPU 密集），其时间片增大（减少切换开销）；若频繁提前让出（交互式），时间片减小（保证响应）。使用 EMA（指数移动平均）平滑估计进程的「CPU 倾向」，据此调整 quantum。',
    en: 'Adaptive Feedback Scheduling is another realization of the MLFQ idea: instead of multiple fixed-priority queues, each process carries a dynamic quantum. If a process keeps using its full slice (CPU-bound) its quantum grows (fewer switches); if it yields early (interactive) its quantum shrinks (better response). An EMA (exponential moving average) estimates each process CPU tendency to drive the quantum.',
  },
  tags: ['scheduling', 'feedback', 'adaptive', 'quantum-tuning'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
