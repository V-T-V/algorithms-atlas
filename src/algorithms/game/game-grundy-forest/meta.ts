// 森林 Grundy 计算 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-grundy-forest',
  categoryId: 'game',
  title: { zh: '森林 Grundy 计算', en: 'Grundy Number for Game Forest' },
  summary: {
    zh: '把多个独立子游戏视为森林，每棵树求 SG 值再异或合并。',
    en: 'Treat multiple independent subgames as a forest; compute each tree SG then XOR-combine.',
  },
  description: {
    zh: '每个子游戏是一棵"取叶子"博弈树：取走一个节点后其子树分裂。递归 SG(v)=mex{各后继 SG 异或子森林 SG}。',
    en: 'Each subgame is a "leaf-removal" game tree; removing a node splits its subtrees. SG(v)=mex{SG(succ) XOR SG(forest of children)} recursively.',
  },
  tags: ['game', 'sprague-grundy', 'tree'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
