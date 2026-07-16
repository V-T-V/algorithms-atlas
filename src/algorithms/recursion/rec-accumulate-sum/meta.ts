// 递归数组求和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-accumulate-sum',
  categoryId: 'recursion',
  title: { zh: '递归数组求和', en: 'Recursive Array Sum' },
  summary: {
    zh: '用分治递归求和：sum(a) = a[0] + sum(a[1..])，演示最朴素的递归思维。',
    en: 'Sum via divide-and-conquer recursion: sum(a) = a[0] + sum(a[1..]).',
  },
  description: {
    zh: '将数组首元素与剩余部分的递归求和相加。基础情形为空数组返回 0。该实现用切片演示分治思想，也可用 head/tail 指针避免拷贝。O(n) 时间、O(n) 栈空间。',
    en: 'Add the first element to the recursive sum of the rest; the base case is an empty array returning 0. Uses slicing to illustrate divide-and-conquer; head/tail pointers can avoid copies. O(n) time, O(n) stack.',
  },
  tags: ['recursion', 'sum', 'array', 'divide-and-conquer'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
