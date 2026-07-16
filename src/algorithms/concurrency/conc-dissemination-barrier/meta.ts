// 传播屏障（Dissemination Barrier）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-dissemination-barrier',
  categoryId: 'concurrency',
  title: { zh: '传播屏障', en: 'Dissemination Barrier' },
  summary: { zh: '每轮向固定步长伙伴同步。', en: 'Each round syncs with a fixed-step partner.' },
  description: {
    zh: '传播屏障每线程在第 r 轮与 (i+2^r) mod n 号线程交换感知信号，log n 轮后全部到达，对称无中心节点。',
    en: 'Dissemination barrier has each thread sense-swap with partner (i+2^r) mod n on round r; all arrive after log n rounds, symmetric.',
  },
  tags: ['concurrency', 'barrier', 'dissemination'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
