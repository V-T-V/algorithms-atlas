// Nim 堆游戏 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-nim-heap',
  categoryId: 'game',
  title: { zh: 'Nim 堆游戏（限取）', en: 'Nim Heap Game (Bounded)' },
  summary: {
    zh: '每堆每次最多取 maxTake 颗的 Nim 变种，用取模判定胜负。',
    en: 'A Nim variant with a per-turn maxTake limit per heap; decide winner by modulo sum.',
  },
  description: {
    zh: '当每堆每次最多取 maxTake 颗时，每堆等价于大小 (pile % (maxTake+1))，总和归一后用 0/1 奇偶判定先手胜负。',
    en: 'With a maxTake cap, each heap reduces to pile % (maxTake+1); the winner is decided by parity of the normalized total.',
  },
  tags: ['game', 'combinatorial', 'math'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
