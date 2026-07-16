// DFP 拟牛顿（DFP Quasi-Newton）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-quasi-dfp-2',
  categoryId: 'optimization',
  title: { zh: 'DFP 拟牛顿', en: 'DFP Quasi-Newton' },
  summary: {
    zh: '用秩 2 更新近似逆 Hessian，无需二阶导。',
    en: 'Rank-2 update approximates the inverse Hessian; no second derivatives needed.',
  },
  description: {
    zh: 'DFP：H_{k+1}=H+ss^T/(y^Ts)-Hy y^T H/(y^THy)。比 BFGS 稍早，原理类似。',
    en: 'DFP: H_{k+1}=H+ss^T/(y^Ts)-Hy y^T H/(y^THy). Earlier than BFGS, similar idea.',
  },
  tags: ['optimization', 'quasi-newton'],
  complexity: { time: 'O(k·n²)', space: 'O(n²)' },
};
