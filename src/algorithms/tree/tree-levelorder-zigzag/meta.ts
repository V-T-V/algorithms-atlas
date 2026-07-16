// 锯齿层序遍历（双栈）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-levelorder-zigzag',
  categoryId: 'tree',
  title: { zh: '锯齿层序遍历（双栈）', en: 'Zigzag Level Order (Dual Stack)' },
  summary: {
    zh: '用两个栈交替实现锯齿层序，偶数层先左后右、奇数层先右后左。',
    en: 'Zigzag level order via two alternating stacks; even layers L-then-R, odd layers R-then-L.',
  },
  description: {
    zh:
      '锯齿层序遍历（双栈版）：用 `currentStack` 与 `nextStack` 两个栈交替推进，避免「层序+反转」中反转的开销。' +
      '\n- 当前层为偶数层（从左到右）：弹出 currentStack，把子节点按**先左后右**压入 nextStack。' +
      '\n- 当前层为奇数层（从右到左）：弹出 currentStack，把子节点按**先右后左**压入 nextStack。' +
      '\n- 一层处理完交换两个栈，层数 +1。' +
      '\n时间 `O(n)`，空间 `O(w)`（w 为最大层宽）。',
    en:
      'Zigzag level order (dual stack): two stacks alternate, avoiding the reversal of the ' +
      '"BFS + reverse" approach. ' +
      '\n- Even layer (left→right): pop currentStack, push children left-then-right into nextStack. ' +
      '\n- Odd layer (right→left): pop currentStack, push children right-then-left into nextStack. ' +
      '\n- Swap the two stacks after each layer; increment the level. ' +
      'Time O(n), space O(w) (max width).',
  },
  tags: ['tree', 'traversal', 'level-order', 'zigzag', 'stack'],
  complexity: { time: 'O(n)', space: 'O(w)' },
};
