// =============================================================================
// 莫比乌斯反演 · 录制帧序列
// 演示：σ 经反演恢复恒等函数 id(n)=n。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { moebiusInvert, divisorSum, type MoebiusInversionHooks } from './impl.ts';

export const DEFAULT_INPUT: { N: number } = { N: 16 };

export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { N } = input;

  const sigma = divisorSum(N);
  const f = new Array<number>(N + 1).fill(0);

  rec
    .begin({ zh: `演示 σ(n) → id(n) 的莫比乌斯反演`, en: `Demo Möbius inversion σ(n) → id(n)` })
    .setAux([{ label: 'σ (g)', value: sigma.slice(1, 13).join(', '), role: 'compare' }])
    .commit();

  const hooks: MoebiusInversionHooks = {
    onInvert: (n, v) => {
      f[n] = v;
      const roles: BarRole[] = new Array(N + 1).fill('default');
      roles[n] = v === n ? 'final' : 'warn'; // 正确恢复则 final
      rec
        .begin({
          zh: `f(${n}) = ${v}（期望 ${n}${v === n ? '，一致' : '，不一致'}）`,
          en: `f(${n}) = ${v} (expected ${n}${v === n ? ', match' : ', mismatch'})`,
        })
        .setArray(f, roles, [{ index: n, label: 'n' }])
        .commit();
    },
  };

  moebiusInvert(sigma, N, hooks);

  rec
    .begin({ zh: `完成：反演恢复 id(n)=n`, en: `Done: inversion recovered id(n)=n` })
    .setAux([{ label: 'f (1..N)', value: f.slice(1).join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
