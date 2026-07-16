// 砖块排序（奇偶排序） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'brick-sort',
  categoryId: 'sorting',
  title: { zh: '砖块排序（奇偶排序）', en: 'Brick Sort (Odd-Even Sort)' },
  summary: {
    zh: '交替执行奇数位和偶数位相邻比较交换，适合并行处理器。',
    en: 'Alternately compare-swap odd-indexed and even-indexed adjacent pairs; parallel-friendly.',
  },
  description: {
    zh: '砖块排序（Odd-Even Transposition Sort）反复扫描数组：第 0、2、4… 趟比较所有 (奇,奇+1) 对并交换逆序；第 1、3、5… 趟比较所有 (偶,偶+1) 对。每对比较相互独立，故可在并行处理器上以 O(n) 时间完成一趟。串行实现复杂度 O(n^2)，最坏与冒泡排序相同，但常数略小且对已基本有序数组收敛快。稳定排序。',
    en: 'Brick sort (odd-even transposition sort) repeatedly sweeps the array: even phases compare all (even,even+1) pairs, odd phases compare all (odd,odd+1) pairs. Each pair is independent, so a phase runs in O(n) on parallel processors. Serial cost is O(n^2) worst case, same as bubble sort but with a slightly smaller constant and fast convergence on nearly-sorted input. Stable.',
  },
  tags: ['sorting', 'comparison', 'stable', 'parallel'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
