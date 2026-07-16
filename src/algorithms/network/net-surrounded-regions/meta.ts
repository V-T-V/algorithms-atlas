// 被围绕的区域 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-surrounded-regions',
  categoryId: 'network',
  title: { zh: '被围绕的区域', en: 'Surrounded Regions' },
  summary: {
    zh: '把被 X 完全围绕的 O 翻转为 X（边界相连的 O 保留）。',
    en: 'Flip O to X if fully surrounded (border-connected Os kept).',
  },
  description: {
    zh: '从边界 O 做 DFS 标记，其余 O 翻 X。',
    en: 'DFS from border Os, flip rest. O(R*C).',
  },
  tags: ['network', 'grid', 'dfs'],
  complexity: { time: 'O(R*C)', space: 'O(R*C)' },
};
