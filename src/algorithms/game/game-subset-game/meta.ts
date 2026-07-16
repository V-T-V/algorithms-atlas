// 子集游戏 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-subset-game',
  categoryId: 'game',
  title: { zh: '子集游戏', en: 'Subset Game' },
  summary: {
    zh: '每堆石子只能取属于给定子集 S 的颗数，求 SG 值与先手胜负。',
    en: 'From each heap take only a count in set S; compute SG values and first-player win.',
  },
  description: {
    zh: '经典 Subtraction Game：可取数量为有限集合 S。SG(0)=0，SG(x)=mex{SG(x-s) : s∈S, s≤x}。多堆异或。',
    en: 'Subtraction game: removable counts form a finite set S. SG(0)=0, SG(x)=mex{SG(x-s):s∈S}. XOR across heaps.',
  },
  tags: ['game', 'sprague-grundy', 'math'],
  complexity: { time: 'O(maxPile·|S|)', space: 'O(maxPile)' },
};
