// 自适应 Nelder-Mead · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'adaptive-nelder-mead',
  categoryId: 'optimization',
  title: { zh: '自适应 Nelder-Mead', en: 'Adaptive Nelder-Mead' },
  summary: {
    zh: 'Gao & Han 提出的维度自适应形变系数，使经典单纯形法在高维更稳健。',
    en: 'Gao & Han dimension-adaptive reflection/expansion/contraction coefficients, making the classic simplex robust in higher dimensions.',
  },
  description: {
    zh: '经典 Nelder-Mead 的形变系数（α=1, γ=2, ρ=0.5, σ=0.5）是固定常数，在高维（n≳10）上容易停滞。\n\nGao-Han **自适应**版把系数随维度 n 调整：\n- 反射 `α = 1`\n- 扩张 `γ = 1 + 2/n`\n- 收缩 `ρ = 0.75 - 1/(2n)`\n- 缩边 `σ = 1 - 1/n`\n\n直观理解：维度越高，每步「试探」得更保守，避免单纯形塌陷。\n\n其余（排序、质心、反射/扩张/收缩/缩边流程）与经典版一致。',
    en: 'Classic Nelder-Mead uses fixed coefficients (α=1, γ=2, ρ=0.5, σ=0.5) that stall in higher dimensions (n≳10).\n\nGao-Han **adaptive** coefficients depend on dimension n:\n- reflection `α = 1`\n- expansion `γ = 1 + 2/n`\n- contraction `ρ = 0.75 - 1/(2n)`\n- shrink `σ = 1 - 1/n`\n\nIntuition: in higher dimensions each probe is more conservative, preventing the simplex from collapsing.\n\nThe sort/centroid/reflect/expand/contract/shrink flow is otherwise identical to the classic version.',
  },
  tags: ['optimization', 'derivative-free', 'simplex', 'adaptive'],
  complexity: { time: 'O(k·n²)', space: 'O(n²)' },
};
