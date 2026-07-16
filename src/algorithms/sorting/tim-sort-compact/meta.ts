// 紧凑 Tim 排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tim-sort-compact',
  categoryId: 'sorting',
  title: { zh: '紧凑 Tim 排序', en: 'Compact Tim Sort' },
  summary: {
    zh: '自适应归并：自然 run 检测 + 小段插入 + 自底向上归并。',
    en: 'Adaptive merge: detect natural runs, insertion-sort small runs, merge bottom-up.',
  },
  description: {
    zh:
      '紧凑 Tim 排序（Compact Tim Sort）是工业级 TimSort 的精简版，保留其两大核心思想：' +
      '\n- **自然 run 检测**：扫描数组，把已升序段直接当作一个 run；降序段原地翻转为升序。' +
      '\n- **小段插入**：不足 `MIN_MERGE`（这里取 16）的 run 用插入排序补齐。' +
      '\n然后自底向上两两归并，得到稳定结果。相比完整版省略了 run 栈不变式与 gallop 归并，' +
      '但保留了「对部分有序数据接近线性」的自适应特性。' +
      '\n时间最坏 `O(n log n)`、最好 `O(n)`；空间 `O(n)`；稳定。',
    en:
      'Compact Tim Sort is a slimmed industrial TimSort that keeps its two core ideas: ' +
      '\n- **Natural-run detection**: ascending stretches become runs as-is; descending ones are ' +
      'flipped to ascending in place. ' +
      '\n- **Small-run insertion**: runs shorter than MIN_MERGE (16 here) are extended by insertion sort. ' +
      'Runs are then merged bottom-up in pairs, yielding a stable result. It omits the run-stack ' +
      'invariants and galloping merge of full TimSort, yet keeps the "near-linear on partly-sorted data" ' +
      'adaptivity. Worst O(n log n), best O(n); space O(n); stable.',
  },
  tags: ['sorting', 'adaptive', 'merge', 'insertion', 'stable'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
