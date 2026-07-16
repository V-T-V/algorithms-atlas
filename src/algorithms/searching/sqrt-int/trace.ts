// =============================================================================
// 整数平方根 · 录制帧序列
// setAux 展示二分区间 [lo,hi] 与 mid*mid 比较；setArray 展示候选 mid。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sqrtInt, type SqrtIntHooks } from './impl.ts';

export const DEFAULT_INPUT = 27;

/** 录制演示帧序列。input 为待开方的非负整数。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const x = input;
  let lo = 0;
  let hi = 0;
  let mid = 0;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'x', value: String(x), role: 'final' },
        { label: '[lo,hi]', value: `[${lo}, ${hi}]`, role: 'frontier' },
        { label: 'mid', value: String(mid), role: 'pivot' },
        { label: 'mid*mid', value: String(mid * mid), role: 'compare' },
        { label: 'ans', value: String(ans) },
      ])
      .commit();
  };

  snap({ zh: `求 floor(√${x})`, en: `floor(sqrt(${x}))` });

  const hooks: SqrtIntHooks = {
    onProbe: (curLo, curHi, curMid, cmp) => {
      lo = curLo;
      hi = curHi;
      mid = curMid;
      snap({
        zh: `mid=${mid}，${mid * mid} ${cmp === 'less' ? '<' : cmp === 'equal' ? '=' : '>'} ${x}`,
        en: `mid=${mid}, ${cmp}`,
      });
    },
    onShrink: (newLo, newHi) => {
      lo = newLo;
      hi = newHi;
    },
    onDone: (root) => {
      ans = root;
      snap({ zh: `结果 floor(√${x}) = ${root}`, en: `floor(sqrt(${x})) = ${root}` });
    },
  };

  sqrtInt(input, hooks);
  return rec.build();
}
