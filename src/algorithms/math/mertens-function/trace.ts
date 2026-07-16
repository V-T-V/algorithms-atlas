// =============================================================================
// Mertens 函数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mertens, type MertensHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number } = { n: 20 };

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;

  const muArr = new Array<number>(n + 1).fill(0);
  const mArr = new Array<number>(n + 1).fill(0);
  let cur = 0;

  rec
    .begin({ zh: `计算 Mertens 函数 M(1..${n})`, en: `Compute Mertens function M(1..${n})` })
    .setAux([{ label: 'n', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: MertensHooks = {
    onMuReady: (mu) => {
      for (let k = 1; k <= n; k++) muArr[k] = mu[k]!;
      rec
        .begin({ zh: '已线性筛得 μ 表', en: 'Linear sieve produced μ table' })
        .setAux([{ label: 'μ(1..n)', value: muArr.slice(1).join(', '), role: 'compare' }])
        .commit();
    },
    onPrefix: (k, m) => {
      mArr[k] = m;
      cur = m;
      const roles: BarRole[] = new Array(n + 1).fill('default');
      roles[k] = 'final';
      rec
        .begin({
          zh: `M[${k}] = M[${k - 1}] + μ(${k}) = ${m}`,
          en: `M[${k}] = M[${k - 1}] + μ(${k}) = ${m}`,
        })
        .setArray(mArr, roles, [{ index: k, label: 'k' }])
        .commit();
    },
  };

  mertens(n, hooks);

  rec
    .begin({ zh: `完成：M(${n}) = ${cur}`, en: `Done: M(${n}) = ${cur}` })
    .setAux([{ label: `M(${n})`, value: String(cur), role: 'final' }])
    .commit();

  return rec.build();
}
