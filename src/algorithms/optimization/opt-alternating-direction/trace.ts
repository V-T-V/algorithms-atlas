// =============================================================================
// 交替方向乘子法（ADMM）· 录制帧序列
// =============================================================================
// Lasso 风格示例：min (1/2)‖x - t‖² + (1/ρ₀)‖x‖₁
// 一致性形式：min f(x) + g(z) s.t. x = z
//   f(x) = (1/2)‖x - t‖²,  g(z) = λ‖z‖₁
//   proxF(v,ρ) = (ρv + t)/(ρ+1)   （融合二次项）
//   proxG(v,ρ) = sign(v)·max(|v|-λ/ρ, 0)  （软阈值）
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { admm, softThreshold, type ADMMHooks, type Vec } from './impl.ts';

export const DEFAULT_INPUT: {
  t: Vec; // 目标向量（f 是 (1/2)‖x-t‖²）
  lambda: number; // L1 系数
  rho: number;
} = {
  t: [3, -2, 1, 5, -4],
  lambda: 1,
  rho: 1,
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { t, lambda, rho } = input;
  const n = t.length;

  // proxF: (1/2)‖x-t‖² 的近端
  const proxF = (v: Vec, _rho: number): Vec => v.map((vi, i) => (_rho * vi + t[i]!) / (_rho + 1));
  // proxG: λ‖z‖₁ 的近端 → 软阈值（参数 λ/ρ）
  const proxG = (v: Vec, r: number): Vec =>
    v.map((x) => Math.sign(x) * Math.max(Math.abs(x) - lambda / r, 0));

  rec
    .begin({
      zh: `ADMM 求 Lasso：目标 t=[${t.join(', ')}]，λ=${lambda}，ρ=${rho}`,
      en: `ADMM for Lasso: target t=[${t.join(', ')}], λ=${lambda}, ρ=${rho}`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: 'λ', value: String(lambda), role: 'compare' as BarRole },
      { label: 'ρ', value: String(rho), role: 'compare' as BarRole },
      { label: '形式', value: 'min (1/2)‖x-t‖² + λ‖x‖₁', role: 'final' as BarRole },
    ])
    .commit();

  const hooks: ADMMHooks = {
    onIter: (k, x, z, y, pr, dr) => {
      rec
        .begin({
          zh: `第 ${k} 步：原残差=${pr.toExponential(2)}，对偶残差=${dr.toExponential(2)}`,
          en: `Iter ${k}: primal=${pr.toExponential(2)}, dual=${dr.toExponential(2)}`,
        })
        .setAux([
          { label: 'k', value: String(k), role: 'pivot' as BarRole },
          { label: 'primal', value: pr.toExponential(2), role: 'warn' as BarRole },
          { label: 'dual', value: dr.toExponential(2), role: 'warn' as BarRole },
          { label: 'x[0]', value: x[0]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'z[0]', value: z[0]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'y[0]', value: y[0]!.toFixed(4) },
        ])
        .commit();
    },
  };

  const x0: Vec = new Array(n).fill(0);
  const result = admm(proxF, proxG, x0, { rho, maxIter: 200, epsAbs: 1e-6, epsRel: 1e-6 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛 ${result.iterations} 步：x≈[${result.x.map((v) => v.toFixed(2)).join(', ')}]`
        : `结束 ${result.iterations} 步：x≈[${result.x.map((v) => v.toFixed(2)).join(', ')}]`,
      en: result.converged
        ? `Converged in ${result.iterations} iters: x≈[${result.x.map((v) => v.toFixed(2)).join(', ')}]`
        : `Stopped after ${result.iterations} iters: x≈[${result.x.map((v) => v.toFixed(2)).join(', ')}]`,
    })
    .setAux([
      { label: 'x*', value: result.x.map((v) => v.toFixed(3)).join(','), role: 'final' as BarRole },
      { label: 'primal', value: result.primalRes.toExponential(2), role: 'pivot' as BarRole },
      { label: 'dual', value: result.dualRes.toExponential(2), role: 'pivot' as BarRole },
      { label: 'iters', value: String(result.iterations), role: 'sorted' as BarRole },
      { label: '收敛', value: String(result.converged), role: 'final' as BarRole },
    ])
    .commit();

  // 触发 softThreshold 引用（避免未使用警告）
  void softThreshold;
  return rec.build();
}
