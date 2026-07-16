// FSE 非对称数值系统（Finite State Entropy）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-fse',
  categoryId: 'compression',
  title: { zh: 'FSE 非对称数值系统', en: 'Finite State Entropy' },
  summary: { zh: '状态机驱动的快速熵编码。', en: 'State-machine-driven fast entropy coder.' },
  description: {
    zh: 'FSE(zstd 使用)是非对称数值系统(ANS)的有限状态实现，速度接近 Huffman 而压缩率接近算术编码。',
    en: 'FSE (used by zstd) is a finite-state variant of ANS: near-Huffman speed with near-arithmetic compression.',
  },
  tags: ['compression', 'fse', 'ans', 'entropy'],
  complexity: { time: 'O(n)', space: 'O(table)' },
};
