// Euler-Maclaurin 求和 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerMaclaurin } from './impl.ts';

export const DEFAULT_INPUT = {
  // 调和函数 f(x) = 1/x, 求 Σ_{k=1}^{10} 1/k = H_10
  f: (x: number): number => 1 / x,
  a: 1,
  b: 10,
  p: 3,
};

export function buildTrace(
  input: {
    f: (x: number) => number;
    a: number;
    b: number;
    p?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { f, a, b, p = 3 } = input;

  rec
    .begin({
      zh: `Euler-Maclaurin：Σ f(k)，k=${a}..${b}，${p} 个修正项`,
      en: `Euler-Maclaurin: Σ f(k), k=${a}..${b}, ${p} corrections`,
    })
    .setAux([
      { label: '起点', value: String(a), role: 'pivot' },
      { label: '终点', value: String(b), role: 'pivot' },
      { label: '修正项数', value: String(p), role: 'frontier' },
    ])
    .commit();

  // 直接求和（参考值）
  let direct = 0;
  for (let k = a; k <= b; k++) direct += f(k);
  rec
    .begin({
      zh: `直接求和：${direct.toFixed(8)}`,
      en: `Direct sum: ${direct.toFixed(8)}`,
    })
    .setAux([{ label: '直接和', value: direct.toFixed(8), role: 'compare' }])
    .commit();

  const { integral, endpoints, corrections, total } = eulerMaclaurin(f, a, b, p);
  rec
    .begin({
      zh: `积分项 ${integral.toFixed(6)} + 端点项 ${endpoints.toFixed(6)} + 修正 ${corrections.toFixed(6)}`,
      en: `Integral ${integral.toFixed(6)} + endpoints ${endpoints.toFixed(6)} + corrections ${corrections.toFixed(6)}`,
    })
    .setAux([
      { label: '积分', value: integral.toFixed(6), role: 'compare' },
      { label: '端点', value: endpoints.toFixed(6), role: 'compare' },
      { label: '修正', value: corrections.toFixed(6), role: 'compare' },
    ])
    .commit();

  rec
    .begin({
      zh: `近似 Σ ≈ ${total.toFixed(6)}（直接 ${direct.toFixed(6)}，差 ${(total - direct).toExponential(2)}）`,
      en: `Approx Σ ≈ ${total.toFixed(6)} (direct ${direct.toFixed(6)}, diff ${(total - direct).toExponential(2)})`,
    })
    .setAux([
      { label: '近似和', value: total.toFixed(6), role: 'final' },
      { label: '误差', value: (total - direct).toExponential(2), role: 'final' },
    ])
    .commit();

  return rec.build();
}
