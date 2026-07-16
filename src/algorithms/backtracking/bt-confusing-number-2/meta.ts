// 困惑数 II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-confusing-number-2',
  categoryId: 'backtracking',
  title: { zh: '困惑数 II', en: 'Confusing Number II' },
  summary: {
    zh: '回溯统计 [1,n] 中所有旋转后变成不同有效数字的「困惑数」个数。',
    en: 'Backtracking to count confusing numbers in [1,n] that differ after 180° rotation.',
  },
  description: {
    zh: '数字 0/1/6/8/9 旋转 180° 仍有效。回溯构造这些数字，再判断旋转值是否与原值不同。',
    en: 'Digits 0/1/6/8/9 stay valid under 180° rotation. Backtrack to construct them, then check whether the rotated value differs from the original.',
  },
  tags: ['backtracking', 'number-theory'],
  complexity: { time: 'O(log n · 5^k)', space: 'O(k)' },
};
