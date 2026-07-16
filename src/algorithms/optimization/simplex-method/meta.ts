// 单纯形法（线性规划）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'simplex-method',
  categoryId: 'optimization',
  title: { zh: '单纯形法（线性规划）', en: 'Simplex Method (LP)' },
  summary: {
    zh: '在多面体顶点间沿最速下降的边移动，求解线性规划 max cᵀx s.t. Ax ≤ b, x ≥ 0。',
    en: 'Walks along the steepest-descent edges of the polytope between vertices to solve linear programs max cᵀx s.t. Ax ≤ b, x ≥ 0.',
  },
  description: {
    zh: '单纯形法（Dantzig, 1947）求解线性规划。把 `max cᵀx, Ax ≤ b, x ≥ 0` 写成标准型（加松弛变量），构造单纯形表：\n\n```\n     x₁ x₂ ... s₁ ... | RHS\nz   -c₁-c₂ ... 0  ... | 0\ns₁  A₁₁ A₁₂ ... 1 ... | b₁\ns₂  A₂₁ A₂₂ ... 0 1.. | b₂\n```\n\n每轮：\n1. 选最负的「判别数」（进基变量）；\n2. 用最小比值规则选定离基变量（保持可行）；\n3. 旋转（高斯消元）更新表。\n\n所有判别数非负时达到最优。',
    en: 'The Simplex Method (Dantzig, 1947) solves linear programs. Writing `max cᵀx, Ax ≤ b, x ≥ 0` in standard form (adding slack variables) gives the tableau:\n\n```\n     x₁ x₂ ... s₁ ... | RHS\nz   -c₁-c₂ ... 0  ... | 0\ns₁  A₁₁ A₁₂ ... 1 ... | b₁\ns₂  A₂₁ A₂₂ ... 0 1.. | b₂\n```\n\nEach iteration:\n1. pick the most negative reduced cost (entering variable);\n2. use the min-ratio test to choose the leaving variable (stay feasible);\n3. pivot (Gaussian elimination) to update the tableau.\n\nOptimum reached when all reduced costs are non-negative.',
  },
  tags: ['optimization', 'linear-programming', 'simplex', 'exact'],
  complexity: { time: 'O(2ⁿ worst / poly avg)', space: 'O(m·n)' },
};
