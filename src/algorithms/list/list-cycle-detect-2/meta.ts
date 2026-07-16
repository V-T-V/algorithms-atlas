// 快慢判环v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-cycle-detect-2',
  categoryId: 'list',
  title: { zh: '快慢判环v2', en: 'Floyd Cycle Detection v2' },
  summary: {
    zh: '快慢指针判环：快走2步、慢走1步，相遇即有环。',
    en: 'Floyd tortoise/hare: if they meet, a cycle exists.',
  },
  description: {
    zh: 'slow 每次走一步，fast 走两步；若有环必然相遇，否则 fast 到 null。',
    en: 'Slow=1, fast=2; meet iff cycle. O(n), O(1).',
  },
  tags: ['list', 'cycle', 'floyd'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
