// 3柱汉诺塔 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-tower-3peg',
  categoryId: 'recursion',
  title: { zh: '3柱汉诺塔', en: 'Tower of Hanoi (3 pegs)' },
  summary: {
    zh: '经典汉诺塔：T(n)=2·T(n−1)+1，最少 2^n−1 步。',
    en: 'Classic Hanoi: T(n)=2·T(n−1)+1, minimum 2^n−1 moves.',
  },
  description: {
    zh: '三柱汉诺塔：递归把 n−1 个盘搬到辅助柱，最大盘搬到目标柱，再把 n−1 个盘搬过来。',
    en: 'Three-peg Hanoi: recursively move n−1 disks to aux, largest to target, then n−1 from aux to target.',
  },
  tags: ['recursion', 'classic', 'hanoi'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
