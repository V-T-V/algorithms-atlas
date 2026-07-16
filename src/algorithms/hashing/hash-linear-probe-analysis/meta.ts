// 线性探查分析（Linear Probing Analysis）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-linear-probe-analysis',
  categoryId: 'hashing',
  title: { zh: '线性探查分析', en: 'Linear Probing Analysis' },
  summary: {
    zh: '分析线性探查下负载因子与平均探查次数的关系。',
    en: 'Analyze the relationship between load factor and expected probe count under linear probing.',
  },
  description: {
    zh: '线性探查：冲突时顺序后移。Knuth 公式：成功查找期望探查 ≈ (1+1/(1-α))/2，α 为负载因子。',
    en: 'Linear probing: on collision move forward. Knuth: successful search probes ≈ (1+1/(1-α))/2.',
  },
  tags: ['hashing', 'hash-table', 'analysis'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
