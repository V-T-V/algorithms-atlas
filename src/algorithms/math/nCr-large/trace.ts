// =============================================================================
// 大数组合数 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nCrLarge, type NCrLargeHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number; r: number } = { n: 50, r: 25 };

export function buildTrace(input: { n: number; r: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, r } = input;

  const factors: Array<{ p: string; e: number }> = [];

  rec
    .begin({ zh: `精确计算 C(${n}, ${r})`, en: `Compute exact C(${n}, ${r})` })
    .setAux([
      { label: 'n', value: String(n), role: 'frontier' },
      { label: 'r', value: String(r), role: 'frontier' },
    ])
    .commit();

  const hooks: NCrLargeHooks = {
    onMultiply: (p, e, _v) => {
      factors.push({ p: String(p), e });
      rec
        .begin({ zh: `累乘 ${p}^${e}`, en: `Multiply ${p}^${e}` })
        .setAux(
          factors.map((f, i) => ({
            label: `${f.p}^${f.e}`,
            value: '',
            role: i === factors.length - 1 ? 'compare' : 'default',
          })),
        )
        .commit();
    },
  };

  const ans = nCrLarge(n, r, hooks);

  rec
    .begin({ zh: `C(${n}, ${r}) = ${ans.toString()}`, en: `C(${n}, ${r}) = ${ans.toString()}` })
    .setAux([
      { label: '答案', value: ans.toString(), role: 'final' },
      { label: '位数', value: String(ans.toString().length), role: 'default' },
    ])
    .commit();

  return rec.build();
}
