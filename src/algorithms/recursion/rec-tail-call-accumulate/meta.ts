// 尾递归累加器模式 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-tail-call-accumulate',
  categoryId: 'recursion',
  title: { zh: '尾递归累加器模式', en: 'Tail Recursion with Accumulator' },
  summary: {
    zh: '把中间结果作为累加器参数下传，使递归调用成为函数尾调用，便于编译器优化。',
    en: 'Thread intermediate results through an accumulator so the recursive call is a tail call, enabling compiler optimization.',
  },
  description: {
    zh: '尾递归形式：递归调用是函数体的最后一步操作，且无后续计算。累加器 acc 把部分和向下传递。等价于循环的迭代过程。某些引擎/语言可将其优化为循环，避免栈溢出。这里实现阶乘的尾递归版本。',
    en: 'Tail recursion: the recursive call is the last operation in the function body with no further computation. The accumulator acc carries the partial result downward, mirroring loop iteration. Some engines/languages optimize it into a loop, avoiding stack overflow. We implement factorial in tail-recursive form.',
  },
  tags: ['recursion', 'tail-call', 'accumulator', 'factorial'],
  complexity: { time: 'O(n)', space: 'O(n) 栈 / O(1) 若 TCO' },
};
