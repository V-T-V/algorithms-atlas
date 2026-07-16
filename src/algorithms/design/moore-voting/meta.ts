// Boyer-Moore 多数投票 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'moore-voting',
  categoryId: 'design',
  title: { zh: 'Boyer-Moore 多数投票', en: 'Boyer-Moore Majority Voting' },
  summary: {
    zh: '维护候选者与计数器，O(n) 时间 O(1) 空间找多数元素。',
    en: 'Maintain a candidate and counter to find the majority in O(n) time and O(1) space.',
  },
  description: {
    zh: '若一个元素在数组中出现次数 > n/2（严格多数），Boyer-Moore 投票用「配对抵消」思想找出它：\n\n- candidate、count 初始为空/0\n- 遇到相同元素 count++；不同元素 count--；count 归零则换候选\n- 第一轮后 candidate 即为候选多数；若保证存在多数，它就是答案\n- 若不保证，需第二轮计数验证\n\n设计上是「流式算法」的典范：单遍扫描、常数空间。',
    en: 'If an element appears > n/2 times (strict majority), Boyer-Moore voting finds it via "pairwise cancellation":\n\n- candidate and count start empty/0\n- Same element: count++; different: count--; when count hits 0 swap candidate\n- After the pass candidate is the majority candidate; if a majority is guaranteed it is the answer\n- Otherwise a second counting pass verifies\n\nA canonical streaming design: single pass, constant space.',
  },
  tags: ['voting', 'design-paradigm', 'streaming'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
