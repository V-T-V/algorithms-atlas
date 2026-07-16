// =============================================================================
// 超级幂 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { superPow, type SuperPowHooks } from './impl.ts';

export const DEFAULT_A = 2;
export const DEFAULT_B = [1, 0];

export function buildTrace(a: number = DEFAULT_A, b: readonly number[] = DEFAULT_B): Frame[] {
  const rec = new TraceRecorder();
  const steps: Array<{ digit: number; acc: number }> = [];

  rec
    .begin({
      zh: `计算 ${a}^[${b.join(',')}] mod 1337`,
      en: `Compute ${a}^[${b.join(',')}] mod 1337`,
    })
    .setAux([
      { label: '底数 a', value: String(a), role: 'pivot' as BarRole },
      { label: '指数 b', value: b.join(','), role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: SuperPowHooks = {
    onDigit: (digit, acc) => steps.push({ digit, acc }),
  };

  const result = superPow(a, b, hooks);

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i]!;
    rec
      .begin({
        zh: `处理位 ${s.digit}：累计结果 = ${s.acc}`,
        en: `Process digit ${s.digit}: accumulated = ${s.acc}`,
      })
      .setAux([
        { label: '当前位', value: String(s.digit), role: 'compare' as BarRole },
        { label: '累计 mod 1337', value: String(s.acc), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `结果 = ${result}`, en: `Result = ${result}` })
    .setAux([{ label: '答案', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
