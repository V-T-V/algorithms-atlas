// =============================================================================
// 内点法（线性规划）· 录制帧序列
// setBars 展示当前 x 与目标值变化。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interiorPoint, demoProblem, type InteriorPointHooks } from './impl.ts';

export const DEFAULT_INPUT = { useDemo: true };

export function buildTrace(_input: { useDemo?: boolean } = {}): Frame[] {
  const rec = new TraceRecorder();
  const { A, b, c, expectZ } = demoProblem();

  rec
    .begin({ zh: `内点法：max ${c.join('x+')}x`, en: `Interior-point: max ${c.join('x+')}x` })
    .setBars(c.map((v, i) => ({ value: v, role: 'pivot' as BarRole, label: `c${i + 1}` })))
    .commit();

  const objs: number[] = [];

  const hooks: InteriorPointHooks = {
    onIteration: (iter, x, obj) => {
      objs.push(obj);
      if (iter % 5 === 0 || iter < 3) {
        rec
          .begin({
            zh: `迭代 ${iter + 1}：z=${obj.toFixed(3)}, x=[${x.map((v) => v.toFixed(2)).join(', ')}]`,
            en: `Iter ${iter + 1}: z=${obj.toFixed(3)}, x=[${x.map((v) => v.toFixed(2)).join(', ')}]`,
          })
          .setBars([
            ...x.map((v, i) => ({ value: v, role: 'compare' as BarRole, label: `x${i + 1}` })),
            { value: obj, role: 'final' as BarRole, label: 'z' },
          ])
          .setAux([
            { label: '迭代', value: String(iter + 1), role: 'pivot' as BarRole },
            { label: 'z', value: obj.toFixed(3), role: 'final' as BarRole },
            { label: '理论最优', value: expectZ.toFixed(2), role: 'compare' as BarRole },
          ])
          .commit();
      }
    },
  };

  const result = interiorPoint(A, b, c, { maxIterations: 100 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：z=${result.optimalValue.toFixed(3)}（理论 ${expectZ}），${result.iterations} 迭代`
        : `完成`,
      en: result.converged
        ? `Converged: z=${result.optimalValue.toFixed(3)} (theory ${expectZ}), ${result.iterations} iters`
        : `Done`,
    })
    .setBars(
      result.solution.map((v, i) => ({
        value: v,
        role: 'final' as BarRole,
        label: `x${i + 1}=${v.toFixed(2)}`,
      })),
    )
    .setAux([
      { label: 'z', value: result.optimalValue.toFixed(3), role: 'final' as BarRole },
      { label: '理论最优', value: expectZ.toFixed(2), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
