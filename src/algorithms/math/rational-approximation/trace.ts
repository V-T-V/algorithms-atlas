// =============================================================================
// 有理逼近 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rationalApprox, type RationalApproximationHooks } from './impl.ts';

export const DEFAULT_INPUT: { x: number; maxDen: number } = { x: Math.PI, maxDen: 100 };

export function buildTrace(input: { x: number; maxDen: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, maxDen } = input;

  const path: Array<{ frac: string; dir: string }> = [];

  rec
    .begin({
      zh: `用 Stern-Brocot 二分逼近 ${x}（分母 ≤ ${maxDen}）`,
      en: `Stern-Brocot bisection approximating ${x} (den ≤ ${maxDen})`,
    })
    .setAux([
      { label: 'x', value: String(x), role: 'frontier' },
      { label: 'maxDen', value: String(maxDen), role: 'frontier' },
    ])
    .commit();

  const hooks: RationalApproximationHooks = {
    onMediant: (m, dir) => {
      path.push({ frac: `${m.num}/${m.den}`, dir });
      rec
        .begin({
          zh: `中位 ${m.num}/${m.den}：${dir === 'left' ? '偏大，向左' : dir === 'right' ? '偏小，向右' : '分母超界，停止'}`,
          en: `Mediant ${m.num}/${m.den}: ${dir === 'left' ? 'too big, go left' : dir === 'right' ? 'too small, go right' : 'den overflow, stop'}`,
        })
        .setAux(
          path.map((p, i) => ({
            label: `#${i + 1}`,
            value: `${p.frac} (${p.dir})`,
            role: i === path.length - 1 ? 'compare' : 'default',
          })),
        )
        .commit();
    },
  };

  const best = rationalApprox(x, maxDen, hooks);

  rec
    .begin({
      zh: `最佳逼近：${best.num}/${best.den} ≈ ${Number(best.num) / Number(best.den)}`,
      en: `Best: ${best.num}/${best.den} ≈ ${Number(best.num) / Number(best.den)}`,
    })
    .setAux([{ label: '最佳', value: `${best.num}/${best.den}`, role: 'final' }])
    .commit();

  return rec.build();
}
