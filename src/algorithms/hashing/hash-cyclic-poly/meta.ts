// hash-cyclic-poly · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-cyclic-poly',
  categoryId: 'hashing',
  title: { zh: 'Cyclic Polynomial', en: 'Cyclic Polynomial' },
  summary: {
    zh: '循环多项式哈希：用字节旋转异或实现 O(1) 滚动，Buzhash 的现代变体。',
    en: 'Cyclic polynomial hash: byte-rotated XOR achieves O(1) rolling; modern Buzhash variant.',
  },
  description: {
    zh: '循环多项式（Lemire）：\n\n- 为每个字节值 b 预生成随机 64 位字 f(b)。\n- 窗口哈希 = f(b[0]) XOR rotl(f(b[1]),1) XOR ... XOR rotl(f(b[L-1]),L-1)。\n- 滚动：h = rotl(h,1) XOR rotl(f(out),L) XOR f(in)，O(1)。\n- 比 Rabin-Karp 更难被构造碰撞。',
    en: 'Cyclic polynomial (Lemire):\n\n- Pre-generate random 64-bit word f(b) per byte value b.\n- Window hash = f(b[0]) XOR rotl(f(b[1]),1) XOR ... XOR rotl(f(b[L-1]),L-1).\n- Rolling: h = rotl(h,1) XOR rotl(f(out),L) XOR f(in), O(1).\n- Harder to construct collisions than Rabin-Karp.',
  },
  tags: ['hashing', 'rolling', 'buzhash', 'cyclic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
