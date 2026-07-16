// Difference Array · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'difference-array',
  categoryId: 'design',
  title: { zh: '差分数组', en: 'Difference Array' },
  summary: {
    zh: '差分数组支持 O(1) 区间更新，O(n) 还原，是前缀和的逆运算。',
    en: 'A difference array supports O(1) range updates and O(n) restore — the inverse of prefix sum.',
  },
  description: {
    zh: '差分数组（Difference Array）是前缀和的逆运算，专攻「多次区间加法、最后一次性还原」场景：\n\n- 设原数组 a，差分数组 d 满足 `d[i] = a[i] - a[i-1]`（`d[0] = a[0]`）。\n- 反之 `a[i] = d[0] + d[1] + ... + d[i]`（差分的前缀和 = 原数组）。\n- **区间加**：给 a[l..r] 每个元素加 val，只需 `d[l] += val; d[r+1] -= val`（O(1)！）。\n- **还原**：对 d 求一次前缀和即得更新后的 a（O(n)）。\n\n适合「离线、多次区间修改、少量查询」的批量更新。本实现通过钩子暴露每次更新与最终还原。',
    en: 'A difference array is the inverse of prefix sum, tailored for "many range additions, then a single restore" scenarios:\n\n- For array a, the difference array d satisfies `d[i] = a[i] - a[i-1]` (`d[0] = a[0]`).\n- Conversely `a[i] = d[0] + d[1] + ... + d[i]` (prefix sum of d recovers a).\n- **Range add**: to add val to every element of a[l..r], just do `d[l] += val; d[r+1] -= val` (O(1)!).\n- **Restore**: one prefix-sum pass over d yields the updated a (O(n)).\n\nIdeal for "offline, many range updates, few queries" batches. Hooks expose each update and the final restore.',
  },
  tags: ['design', 'difference-array', 'range-update'],
  complexity: { time: 'O(1) 更新 / O(n) 还原', space: 'O(n)' },
};
