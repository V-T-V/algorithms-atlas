// 跳跃查找（变体）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-jump-2',
  categoryId: 'searching',
  title: { zh: '跳跃查找（变体）', en: 'Jump Search (Variant)' },
  summary: {
    zh: '以步长 √n 跳过元素，定位目标所在块后线性回扫。',
    en: 'Jump by step size √n to bracket the target block, then linear-scan backward.',
  },
  description: {
    zh: '跳跃查找（Jump Search）：\n1. 步长 step = √n\n2. 从 i=0 开始，每次 i += step，跳过 arr[i] < target 的块\n3. 当 arr[i] >= target（或越界）时停止\n4. 在 [i-step, min(i, n-1)] 内线性回扫查找 target\n\n适合有序数组。复杂度 O(√n)（最坏跳 √n 次再扫 √n 次）。',
    en: 'Jump Search: (1) step = √n; (2) advance i by step while arr[i] < target; (3) linear scan the bracketed block [i-step, min(i,n-1)] backward for target. Sorted array. Complexity O(√n).',
  },
  tags: ['searching', 'jump-search', 'linear-scan'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
