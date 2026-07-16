// 缕排序 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-strand-2',
  categoryId: 'sorting',
  title: { zh: '缕排序', en: 'Strand Sort' },
  summary: {
    zh: '反复从剩余元素抽出递增子链，归并到结果中。',
    en: 'Repeatedly pull an increasing subsequence (strand) from the remainder and merge it into the result.',
  },
  description: {
    zh: '缕排序（Strand Sort）每轮从剩余元素中抽取一个递增子链（strand）：取剩余首元素为 strand 起点，扫描剩余，把所有比 strand 末元素大的依次追加到 strand 并从剩余移除；然后把 strand 归并进已排序结果。重复直到剩余为空。对几乎有序或链表友好。时间 O(n^2) 最坏，O(n log n) 平均（归并主导），稳定。',
    en: "Strand sort extracts an increasing subsequence (strand) each round: the first remaining element starts the strand; scan the remainder appending every element larger than the strand's tail, removing it from the remainder; then merge the strand into the sorted result. Repeat until the remainder is empty. Friendly to nearly-sorted input and linked lists. Worst O(n^2), average O(n log n) (merge dominated). Stable.",
  },
  tags: ['sorting', 'comparison', 'stable', 'merge'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
