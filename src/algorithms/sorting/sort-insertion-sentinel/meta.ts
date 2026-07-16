// 插入排序（哨兵优化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-insertion-sentinel',
  categoryId: 'sorting',
  title: { zh: '插入排序（哨兵优化）', en: 'Insertion Sort (Sentinel)' },
  summary: {
    zh: '先把最小值移到首位作哨兵，内层循环省去边界判断。',
    en: 'Move the minimum to the front as a sentinel so the inner loop skips boundary checks.',
  },
  description: {
    zh: '插入排序（Insertion Sort）逐个把元素插入已排序前缀。朴素版内层循环需判断 j>0，本哨兵版先扫描一次把全局最小值交换到 a[0]，于是内层 while 永远不会越界（a[0] 必然是最小，停在 j=0），省去每次比较的边界检查，常数更小。整体复杂度不变 O(n^2)，最优 O(n)。稳定，原地。',
    en: 'Insertion sort inserts each element into the sorted prefix. The naive inner loop checks j>0 each time; this sentinel variant first swaps the global minimum to a[0], so the inner while never runs off the front (a[0] is smallest), removing the boundary check for a smaller constant. Complexity is still O(n^2) worst, O(n) best. Stable, in-place.',
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place', 'insertion'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
