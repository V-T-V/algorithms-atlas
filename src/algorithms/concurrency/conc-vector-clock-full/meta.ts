// 向量时钟（完整）（Vector Clock (Full)）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-vector-clock-full',
  categoryId: 'concurrency',
  title: { zh: '向量时钟（完整）', en: 'Vector Clock (Full)' },
  summary: { zh: '每进程维护所有进程时钟数组。', en: 'Each process keeps a clock array.' },
  description: {
    zh: '向量时钟(Mattern/Fidge)每进程持有长度 n 的时钟数组，本地事件自增、消息携带并取逐项 max，可判定因果并发。',
    en: 'Vector clock (Mattern/Fidge) keeps an array of length n per process, incrementing locally and merging via max on messages.',
  },
  tags: ['concurrency', 'vector-clock', 'causality'],
  complexity: { time: 'O(n) per event', space: 'O(n^2)' },
};
