// 二进制算术编码（Binary Arithmetic Coding）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-arithmetic-binary',
  categoryId: 'compression',
  title: { zh: '二进制算术编码', en: 'Binary Arithmetic Coding' },
  summary: { zh: '对 0/1 序列做算术编码。', en: 'Arithmetic coding over bit sequences.' },
  description: {
    zh: '二进制算术编码用 [low,high) 区间逐位细分，按 0/1 概率 p 分配子区间，最终输出一个浮点数代表整段比特。',
    en: 'Binary arithmetic coding refines a [low,high) interval per bit by probability p, emitting one number encoding the whole bit string.',
  },
  tags: ['compression', 'arithmetic-coding', 'binary'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
