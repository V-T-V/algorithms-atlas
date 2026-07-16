// 蒙特卡洛积分 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'monte-carlo-integration',
  categoryId: 'randomized',
  title: { zh: '蒙特卡洛积分', en: 'Monte Carlo Integration' },
  summary: {
    zh: '在区域 [a,b]×[c,d] 内随机采样，用落在被积函数下方比例乘以包围盒面积估计定积分。',
    en: 'Sample uniformly in bounding box [a,b]×[c,d]; estimate the integral by the fraction below the curve times the box area.',
  },
  description: {
    zh: '蒙特卡洛积分是数值积分的通用随机化方法，特别适合高维或被积函数不规则的情形。一维情形：要计算 ∫_a^b f(x) dx，先确定函数在 [a,b] 上的取值范围 [c,d]（包围盒），在矩形 [a,b]×[c,d] 内均匀随机投点，落在曲线 f 下方（y ≤ f(x)）的比例 P ≈ （积分 − c·(b−a)）/ 矩形面积，从而积分 ≈ c·(b−a) + P · (b−a)(d−c)。若 c=0 则简化为 P · (b−a)(d−c)。误差按 O(1/√n) 收敛（中心极限定理），与维度无关，这是它相对网格法的核心优势。本实现演示对 ∫_0^π sin(x) dx = 2、∫_0^1 x² dx = 1/3 的估计，并展示随采样数增加误差缩小的过程。',
    en: 'Monte Carlo integration is a general randomized method for numerical integration, especially suited to high dimensions or irregular integrands. In one dimension: to compute ∫_a^b f(x) dx, first determine the range [c,d] of f on [a,b] (the bounding box); sample uniformly in the rectangle [a,b]×[c,d]; the fraction landing below the curve (y ≤ f(x)) gives P ≈ (integral − c·(b−a)) / box-area, hence integral ≈ c·(b−a) + P·(b−a)(d−c). When c=0 this simplifies to P·(b−a)(d−c). The error shrinks as O(1/√n) (CLT), independent of dimension — its key advantage over grid methods. This implementation estimates ∫_0^π sin(x) dx = 2 and ∫_0^1 x² dx = 1/3, showing the error decrease as the sample count grows.',
  },
  tags: ['randomized', 'numerical', 'integration', 'monte-carlo'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
