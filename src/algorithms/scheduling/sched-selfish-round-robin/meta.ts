// 自私轮转调度 (Selfish RR) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-selfish-round-robin',
  categoryId: 'scheduling',
  title: { zh: '自私轮转调度 (Selfish RR)', en: 'Selfish Round Robin' },
  summary: {
    zh: 'RR 变体：新到达进程排队尾等待「老」进程接纳，接纳后进入轮转池。',
    en: 'RR variant: newly arrived processes wait in a holding queue until accepted by the active pool.',
  },
  description: {
    zh: '自私轮转调度（Selfish Round Robin）是普通 RR 的一种变体思想：已经进入「轮转池」的进程不愿被新进程打断，新到达的进程先进入一个等待队列；只有当池中进程主动让出（完成或时间片耗尽且池大小未达上限）时才接纳等待队列中的进程。这样老进程保持较高响应速度，新进程需排队。本实现用「门槛」模拟：池中进程数达到阈值前不接纳新进程。',
    en: 'Selfish Round Robin is a variant idea of plain RR: processes already in the rotation pool resist interruption by newcomers, which first enter a holding queue. A waiting process is admitted only when a pool member yields (completes or its quantum expires) and the pool is below capacity. This keeps older processes responsive while newcomers queue. This implementation models the rule via an admission threshold.',
  },
  tags: ['scheduling', 'round-robin', 'selfish', 'admission'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
