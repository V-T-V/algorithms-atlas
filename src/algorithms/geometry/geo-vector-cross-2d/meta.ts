// 二维叉积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-vector-cross-2d',
  categoryId: 'geometry',
  title: { zh: '二维叉积', en: '2D Cross Product' },
  summary: {
    zh: '二维叉积标量（带符号面积）。',
    en: 'Signed scalar cross product of two 2D vectors.',
  },
  description: {
    zh: 'a×b = a.x*b.y - a.y*b.x，等于两向量张成的平行四边形带符号面积，符号表示旋转方向。',
    en: 'a×b = a.x*b.y - a.y*b.x; equals signed area of the parallelogram, sign = orientation.',
  },
  tags: ['geometry', 'vector', 'cross-product'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
