// SR1 对称秩一更新 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-sr1',
  categoryId: 'optimization',
  title: { zh: 'SR1 对称秩一更新', en: 'SR1 (Symmetric Rank-One) Update' },
  summary: {
    zh: '最简单的对称拟牛顿更新：H ← H + vvᵀ/(vᵀy)，不保正定但近似更准。',
    en: 'Simplest symmetric quasi-Newton update: H ← H + vvᵀ/(vᵀy); not positive-definite-preserving but often more accurate.',
  },
  description: {
    zh: 'SR1（Symmetric Rank-One）是拟牛顿家族中更新公式最简单的成员：用一对 (s,y) 定义 v = s − H·y，做秩一修正 H ← H + (v·vᵀ)/(vᵀ·y)。与 BFGS/DFP 不同，SR1 不保证 H 始终正定，因此不能直接用于无条件极小化（搜索方向可能非下降），但它对海森的近似往往更精确（秩一比秩二更节省信息）。SR1 因此在「信赖域」框架（允许非下降试探）中表现出色，是 SR1-信赖域方法的基础，对非凸或负曲率问题尤其有用。',
    en: 'SR1 (Symmetric Rank-One) has the simplest update formula in the quasi-Newton family: with the pair (s,y), define v = s − H·y and apply the rank-one correction H ← H + (v·vᵀ)/(vᵀ·y). Unlike BFGS/DFP, SR1 does not preserve positive-definiteness, so the search direction may not be descent — but its Hessian approximation is often more accurate (rank-one carries less noise than rank-two). SR1 therefore shines inside trust-region frameworks (which tolerate non-descent trial steps) and underlies SR1-trust-region methods, especially useful for non-convex or negative-curvature problems.',
  },
  tags: ['optimization', 'quasi-newton', 'sr1', 'rank-one'],
  complexity: { time: 'O(k·n²)', space: 'O(n²)' },
};
