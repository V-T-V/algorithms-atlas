// hash-geometric · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-geometric',
  categoryId: 'hashing',
  title: { zh: 'Geometric Hashing', en: 'Geometric Hashing' },
  summary: {
    zh: '几何哈希：把 2D 点集在仿射变换下规范化后哈希，用于点模式匹配。',
    en: 'Geometric hashing: hash 2D point sets after affine-invariant normalization for point-pattern matching.',
  },
  description: {
    zh: '几何哈希（Wolfson & Rigoutsos）：\n\n- 选一对基准点 p1, p2，建立局部坐标系。\n- 把所有其他点投影到该坐标系（旋转、缩放归一化）。\n- 量化后存入哈希表 (basis, point)。\n- 查询时对所有 basis 投票，得票最多的为匹配。\n- 用于分子对接、目标识别。',
    en: 'Geometric hashing (Wolfson & Rigoutsos):\n\n- Pick a basis pair p1, p2 and build a local coordinate frame.\n- Project all other points into that frame (rotation + scale normalization).\n- Quantize and store (basis, point) in a hash table.\n- Query votes over all bases; the winner is the match.\n- Used for molecular docking and object recognition.',
  },
  tags: ['hashing', 'geometric', 'pattern-matching', 'affine'],
  complexity: { time: 'O(n^3)', space: 'O(n^2)' },
};
