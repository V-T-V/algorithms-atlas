// 递归生成子集（扩展法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-generate-subsets-recursive',
  categoryId: 'recursion',
  title: { zh: '递归生成子集（扩展法）', en: 'Subset Generation (Recursive Extension)' },
  summary: {
    zh: '递归扩展法：从当前位置 start 向后选元素，每层产生一个子集，避免重复。',
    en: 'Recursive extension: pick elements forward from a start index; each recursion level yields one subset without duplicates.',
  },
  description: {
    zh: '生成子集的另一种递归思路（扩展法 / combination-style）：维护当前子集 cur 和起始下标 start。每次从 start 开始枚举「下一个加入的元素」，加入后递归进入下一层（下一层 start = 当前下标 + 1），并在每次进入递归时记录当前 cur 为一个子集。相比「选/不选」二叉决策，本方法直接按字典序生成，且天然避免重复。可与去重结合用于含重复元素的输入。',
    en: 'Another recursive approach to generating subsets (the extension / combination-style method): keep the current subset cur and a start index. At each level, enumerate the "next element to add" from start onward, then recurse with the next start = current index + 1, recording cur as a subset on entry. Compared to the choose/skip binary decision, this method produces subsets directly in lexicographic order and avoids duplicates naturally. It can be combined with deduplication for inputs containing repeated elements.',
  },
  tags: ['recursion', 'backtracking', 'subset', 'combination', 'lexicographic'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
