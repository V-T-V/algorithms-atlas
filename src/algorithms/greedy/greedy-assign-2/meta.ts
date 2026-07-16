// 分发饼干 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-assign-2',
  categoryId: 'greedy',
  title: { zh: '分发饼干', en: 'Assign Cookies' },
  summary: {
    zh: '每块饼干满足一个胃口不大于它的孩子；最大化满足数。',
    en: 'Each cookie satisfies a child whose greed is no larger; maximize satisfied children.',
  },
  description: {
    zh: 'LeetCode 455 分发饼干：孩子胃口 g[i]、饼干尺寸 s[j]，饼干只能给胃口 ≤ 它的孩子。排序后双指针贪心。',
    en: 'LeetCode 455 Assign Cookies: child greed g[i], cookie size s[j]; a cookie can satisfy a child with greed ≤ its size. Sort + two-pointer greedy.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n log n + m log m)', space: 'O(1)' },
};
