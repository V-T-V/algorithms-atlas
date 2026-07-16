// Adams-Moulton 隐式多步法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-adams-moulton',
  categoryId: 'numerical',
  title: { zh: 'Adams-Moulton 隐式多步法', en: 'Adams-Moulton Implicit Multistep' },
  summary: {
    zh: '隐式线性多步法：用当前及历史点的导数值构造 k 步公式，对刚性方程更稳定。',
    en: 'Implicit linear multistep: uses derivative values at the current and past points; more stable for stiff problems.',
  },
  description: {
    zh: 'Adams-Moulton（AM）是隐式多步法，用未来点 t_{n+1} 的导数。\n\n4 阶 AM 公式：\n```\ny_{n+1} = y_n + h·(9·f_{n+1} + 19·f_n - 5·f_{n-1} + f_{n-2}) / 24\n```\n（f_{n+1} = f(t_{n+1}, y_{n+1})，待求）\n\n通常与 Adams-Bashforth（显式）组成「预测-校正」（PECE）：\n1. 预测：AB4 算出 y_{n+1}^P\n2. 校正：用 y_{n+1}^P 算 f_{n+1}^P，代入 AM4 公式得 y_{n+1}\n3. 再算 f_{n+1}\n\n起始用 RK4 自举。复杂度 O(n)。',
    en: 'Adams-Moulton (AM) is an implicit multistep method using f at the future point t_{n+1}. The 4th-order formula: y_{n+1}=y_n+h·(9·f_{n+1}+19·f_n-5·f_{n-1}+f_{n-2})/24. Usually paired with Adams-Bashforth (explicit) in a predictor-corrector (PECE): predict with AB4, evaluate f, correct with AM4, re-evaluate. Start with RK4 bootstrap. Complexity O(n).',
  },
  tags: ['numerical', 'ode', 'multistep', 'implicit', 'predictor-corrector'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
