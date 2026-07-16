// =============================================================================
// 第 k 个斐波那契数 · 录制帧序列
// setArray 展示已生成的斐波那契序列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kFib, type KFibHooks } from './impl.ts';

export const DEFAULT_INPUT = 10;

/** 录制演示帧序列。input 为要求的项号 k。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const seq: number[] = [];
  let highlightIdx = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(seq.length).fill('final');
    if (highlightIdx >= 0 && highlightIdx < seq.length) roles[highlightIdx] = 'pivot';
    rec
      .begin(note)
      .setArray([...seq], roles, highlightIdx >= 0 ? [{ index: highlightIdx, label: 'i' }] : [])
      .commit();
  };

  snap({ zh: `求第 ${input} 个斐波那契数`, en: `Compute F(${input})` });

  const hooks: KFibHooks = {
    onStep: (i, value) => {
      seq[i] = value;
      highlightIdx = i;
      snap({ zh: `F(${i}) = ${value}`, en: `F(${i}) = ${value}` });
    },
    onDone: () => {
      highlightIdx = -1;
    },
  };

  kFib(input, hooks);

  rec
    .begin({
      zh: `完成：F(${input}) = ${seq[input] ?? 0}`,
      en: `Done: F(${input}) = ${seq[input] ?? 0}`,
    })
    .setArray([...seq], new Array(seq.length).fill('final'), [])
    .commit();
  return rec.build();
}
