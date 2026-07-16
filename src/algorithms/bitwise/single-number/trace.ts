// 只出现一次的数 · 录制帧序列
// 用 setBars 展示数组元素 + setAux 展示异或累积器。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { singleNumber, type SingleNumberHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 1, 2, 1, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let acc = 0;

  const snapshot = (note: { zh: string; en: string }, idx: number = -1) => {
    const roles: Record<number, BarRole> = {};
    if (idx >= 0) roles[idx] = 'compare';
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, roles))
      .setAux([{ label: '异或累积 / XOR acc', value: String(acc), role: 'pivot' as BarRole }])
      .commit();
  };

  snapshot({ zh: `初始：全部异或，累积 = 0`, en: `Initial: XOR all, acc = 0` });

  const hooks: SingleNumberHooks = {
    onXor: (i, _v, newAcc) => {
      acc = newAcc;
      snapshot(
        {
          zh: `异或 arr[${i}]=${input[i]} → 累积 = ${acc}`,
          en: `XOR arr[${i}]=${input[i]} → acc = ${acc}`,
        },
        i,
      );
    },
  };

  const result = singleNumber(input, hooks);
  void result;

  rec
    .begin({ zh: `只出现一次的数 = ${acc}`, en: `Single number = ${acc}` })
    .setBars(
      input.map((v) => ({
        value: v,
        role: (v === acc ? 'final' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .commit();

  return rec.build();
}
