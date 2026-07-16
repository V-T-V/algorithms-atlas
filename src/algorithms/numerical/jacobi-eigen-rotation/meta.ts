// Jacobi 旋转求特征值 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-jacobi-eigen-rotation',
  categoryId: 'numerical',
  title: { zh: 'Jacobi 旋转求特征值（单旋转）', en: 'Jacobi Eigenvalue by Rotation' },
  summary: {
    zh: '每次消去对称矩阵最大的非对角元，用 Givens 旋转逐步逼近对角化。',
    en: 'Zero the largest off-diagonal element of a symmetric matrix each step via Givens rotation.',
  },
  description: {
    zh:
      'Jacobi 旋转法求特征值（经典单旋转版本）：适用于实对称矩阵。' +
      '\n核心思想：反复选取当前最大的非对角元 a_{pq}，构造 Givens 旋转 J 使 JᵀAJ 在 (p,q) 处变为 0，' +
      '把非对角能量逐步归零，最终 A 收敛为对角矩阵，对角元即特征值。' +
      '\n- 单次旋转公式：θ = ½·atan2(2·a_{pq}, a_{qq} − a_{pp})' +
      '\n- 旋转矩阵 J 在 (p,p),(q,q) 为 cos θ，(p,q)=−sin θ，(q,p)=sin θ' +
      '\n- 对称矩阵保对称；收敛后 V=ΠJ_k 的列即对应特征向量' +
      '\n- 与扫描式 jacobi-eigen 不同：本版每次只消「最大」元素（经典 Jacobi）' +
      '\n- 时间 `O(n³·k)`（k 次旋转），空间 `O(n²)`。',
    en:
      'Jacobi eigenvalue algorithm (classical single-rotation variant): for real symmetric matrices. ' +
      '\nCore idea: repeatedly pick the largest off-diagonal element a_{pq}, construct a Givens rotation J ' +
      'that zeroes position (p,q) of JᵀAJ, driving off-diagonal energy to zero until A becomes diagonal; ' +
      'the diagonal then holds the eigenvalues. ' +
      '\n- Rotation angle: θ = ½·atan2(2·a_{pq}, a_{qq} − a_{pp}) ' +
      '\n- J has cos θ at (p,p),(q,q), −sin θ at (p,q), sin θ at (q,p) ' +
      '\n- Symmetry is preserved; columns of V=ΠJ_k give the eigenvectors ' +
      '\n- Differs from sweep-based jacobi-eigen: this version zeros the single largest element each step ' +
      '\nTime O(n³·k) (k rotations), space O(n²).',
  },
  tags: ['numerical', 'linear-algebra', 'eigenvalue', 'jacobi', 'rotation'],
  complexity: { time: 'O(n³·k)', space: 'O(n²)' },
};
