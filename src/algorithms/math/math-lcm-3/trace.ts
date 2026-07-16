// =============================================================================
// 多元素 LCM · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lcmMulti, type LcmHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 6, 8, 10];

export function buildTrace(nums: readonly (number | bigint)[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const pairs: Array<{ a: string; b: string; lcm: string }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(pairs.map((p) => ({ value: Number(p.lcm), role: 'frontier' })))
      .setAux(
        pairs.map((p, i) => ({
          label: `step${i}`,
          value: `lcm(${p.a},${p.b})=${p.lcm}`,
          role: 'pivot',
        })),
      )
      .commit();
  };

  snap({ zh: `对 [${nums.join(',')}] 求 LCM`, en: `LCM of [${nums.join(',')}]` });

  const hooks: LcmHooks = {
    onPair: (a, b, l) => {
      pairs.push({ a: a.toString(), b: b.toString(), lcm: l.toString() });
      snap({ zh: `lcm(${a}, ${b}) = ${l}`, en: `lcm(${a}, ${b}) = ${l}` });
    },
  };

  const ans = lcmMulti(nums, hooks);

  rec
    .begin({ zh: `LCM=${ans}`, en: `LCM=${ans}` })
    .setAux([{ label: '答案', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
