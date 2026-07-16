// SMA* 简化记忆受限 A*（Simplified Memory-Bounded A*）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-sma-star',
  categoryId: 'ai-search',
  title: { zh: 'SMA* 简化记忆受限 A*', en: 'Simplified Memory-Bounded A*' },
  summary: {
    zh: '内存受限的 A*，超出预算时丢弃最差节点。',
    en: 'Memory-bounded A* that forgets worst node on overflow.',
  },
  description: {
    zh: 'SMA*(Simplified Memory-Bounded A*) 在 A* 基础上限制开放表大小，溢出时回收 f 值最大的叶节点并把其回退值回填父节点。',
    en: 'SMA* caps the open list; on overflow it drops the leaf with largest f, propagating a backup f-value to its parent.',
  },
  tags: ['ai-search', 'sma-star', 'heuristic', 'memory-bounded'],
  complexity: { time: 'O(b^d)', space: 'O(m)' },
};
