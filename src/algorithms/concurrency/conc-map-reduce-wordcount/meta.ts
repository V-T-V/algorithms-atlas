// MapReduce 词频统计 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-map-reduce-wordcount',
  categoryId: 'concurrency',
  title: { zh: 'MapReduce 词频统计', en: 'MapReduce Word Count' },
  summary: {
    zh: 'map 阶段分片统计局部词频，reduce 阶段按词聚合求和。',
    en: 'Map phase counts words per shard; reduce phase aggregates by word.',
  },
  description: {
    zh: '经典 MapReduce 词频：将文档分片，每个 mapper 输出 (word,1) 或局部计数；reducer 按词分组求和。本实现模拟：mapper 处理一段文本返回 Map<word,count>，reducer 合并所有 mapper 的结果。',
    en: 'Classic MapReduce word count: split the document into shards; each mapper emits (word,1) or local counts; reducers sum per word. This implementation simulates mappers returning Map<word,count> per shard, then a reducer merging them.',
  },
  tags: ['concurrency', 'map-reduce', 'word-count', 'parallel'],
  complexity: { time: 'O(N/W)', space: 'O(V)' },
};
