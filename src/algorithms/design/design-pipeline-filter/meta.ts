// 管道-过滤器（Pipes and Filters）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-pipeline-filter',
  categoryId: 'design',
  title: { zh: '管道-过滤器', en: 'Pipes and Filters' },
  summary: { zh: '过滤器经管道串联处理流。', en: 'Filters chained via pipes process a stream.' },
  description: {
    zh: '管道-过滤器架构把处理拆成独立过滤器，用管道连接，数据单向流动，每个过滤器可独立替换/并行，编译器常见。',
    en: 'The Pipes and Filters architecture splits processing into independent filters connected by pipes; data flows one way, each filter replaceable/parallelizable (compilers).',
  },
  tags: ['design', 'pattern', 'pipes-filters', 'architectural'],
  complexity: { time: 'O(n*f)', space: 'O(n)' },
};
