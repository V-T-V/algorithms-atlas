// 跳跃查找（经典） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-jump-classic',
  categoryId: 'searching',
  title: { zh: '跳跃查找（经典）', en: 'Jump Search (Classic)' },
  summary: {
    zh: '经典跳跃查找：步长 sqrt(n)，定位块后线性扫描。',
    en: 'Classic jump search: step sqrt(n), locate a block then linear-scan.',
  },
  description: {
    zh: '经典跳跃查找（Jump Search）：步长 m = floor(sqrt(n))，从下标 m-1 起每次跳跃 m 步探测，直到 arr[pos] >= target 或越界；然后在候选块 [pos-m, pos] 内线性扫描。时间 O(sqrt(n))（sqrt(n) 次跳跃 + 最多 sqrt(n) 次线性比较），空间 O(1)。介于线性与二分之间。',
    en: 'Classic jump search: step m = floor(sqrt(n)); starting at index m-1 jump m each time until arr[pos] >= target or out of bounds; then linear-scan the candidate block [pos-m, pos]. Time O(sqrt(n)) (sqrt(n) jumps + at most sqrt(n) linear comparisons), space O(1). Sits between linear and binary.',
  },
  tags: ['searching', 'jump', 'sorted', 'classic'],
  complexity: { time: 'O(sqrt n)', space: 'O(1)' },
};
