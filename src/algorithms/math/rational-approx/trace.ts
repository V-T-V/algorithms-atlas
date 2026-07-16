// =============================================================================
// 有理逼近 · 录制帧序列
// 通过 rationalApprox 的钩子，把收敛数序列录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rationalApprox, type RationalApproxHooks, type Rational } from './impl.ts';

export const DEFAULT_INPUT = { x: Math.PI, maxDen: 100 };

const fmt = (r: Rational): string => (r.den === 1n ? `${r.num}` : `${r.num}/${r.den}`);

/** 录制演示帧序列。 */
export function buildTrace(input: { x: number; maxDen: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, maxDen } = input;
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setMap(lines.slice()).commit();
  };

  lines.push({ key: '目标', value: `x ≈ ${x}`, role: 'frontier' });
  lines.push({ key: '分母上限', value: String(maxDen), role: 'default' });
  rec
    .begin({
      zh: `用连分数收敛数逼近 x ≈ ${x}（分母 ≤ ${maxDen}）`,
      en: `Approximate x ≈ ${x} via continued-fraction convergents (den ≤ ${maxDen})`,
    })
    .setMap(lines.slice())
    .commit();

  const hooks: RationalApproxHooks = {
    onConvergent: (k, c, err) => {
      lines.push({
        key: `h_${k}/k_${k}`,
        value: `${fmt(c)}（误差 ${err.toExponential(2)}）`,
        role: 'compare',
      });
      snapshot({
        zh: `收敛数 ${fmt(c)}，误差 ≈ ${err.toExponential(2)}`,
        en: `Convergent ${fmt(c)}, error ≈ ${err.toExponential(2)}`,
      });
    },
    onResult: (best, err) => {
      lines.push({ key: '最佳', value: `${fmt(best)}`, role: 'final' });
      snapshot({
        zh: `最佳逼近 ${fmt(best)}（误差 ${err.toExponential(2)}）`,
        en: `Best ${fmt(best)} (error ${err.toExponential(2)})`,
      });
    },
  };

  rationalApprox(x, maxDen, hooks);
  return rec.build();
}
