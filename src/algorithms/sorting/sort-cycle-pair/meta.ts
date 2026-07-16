// 循环排序（成对循环） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-cycle-pair',
  categoryId: 'sorting',
  title: { zh: '循环排序（成对循环）', en: 'Cycle Sort (Pair Cycles)' },
  summary: {
    zh: '循环节长为 2 的循环排序变体，每轮至多两次写入，减少写次数。',
    en: 'Cycle-sort variant that processes cycles two at a time, minimizing writes per round.',
  },
  description: {
    zh: '循环排序（Cycle Sort）通过把每个元素直接送到其最终位置来排序，写入次数最少（理论最优，约 n + (cycle-1) 次）。本成对变体每轮处理一个循环节：计算当前元素 item 在未排序段中的最终位置 pos，把 item 放到 pos，取出原 pos 的元素继续，直到回到循环节起点。适合写入代价高的场景（如 EEPROM/Flash）。不稳定，原地。最坏 O(n^2) 比较。',
    en: 'Cycle sort places each element directly at its final position, minimizing writes (theoretically optimal: about n + (cycles-1) writes). This variant processes one cycle per round: compute the final position pos of the current item within the unsorted segment, place it, take the displaced element, and continue until returning to the cycle start. Useful when writes are expensive (e.g. EEPROM/Flash). Unstable, in-place. Worst O(n^2) comparisons.',
  },
  tags: ['sorting', 'comparison', 'in-place', 'min-write'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
