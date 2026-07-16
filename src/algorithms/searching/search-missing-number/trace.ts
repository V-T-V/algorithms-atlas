// =============================================================================
// 找缺失数字 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { missingNumberXor, missingNumberSum, type MissingNumberHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 0, 1, 4, 6, 2]; // 缺 5（n=6，值域 0..6）

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let accXor = n;
  let accSum = 0;
  let probe = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (probe >= 0) roles[probe] = 'compare';
    rec
      .begin(note)
      .setArray(values, roles, probe >= 0 ? [{ index: probe, label: 'i' }] : [])
      .setAux([
        { label: '异或累加', value: String(accXor), role: 'pivot' },
        { label: '求和累加', value: String(accSum), role: 'frontier' },
        { label: '期望总和', value: String((n * (n + 1)) / 2), role: 'final' },
      ])
      .commit();
  };

  snapshot({
    zh: `数组长度 n=${n}，值域 0..${n}，找缺失数字`,
    en: `n=${n}, range 0..${n}, find missing`,
  });

  // 先演示异或法
  const xorHooks: MissingNumberHooks = {
    onXorStep: (i, acc) => {
      probe = i;
      accXor = acc;
      snapshot({
        zh: `异或法：i=${i}，a[i]=${values[i]}，累异或=${acc}`,
        en: `XOR: i=${i}, a[i]=${values[i]}, acc=${acc}`,
      });
    },
  };
  const byXor = missingNumberXor(input, xorHooks);

  // 再演示求和法
  const sumHooks: MissingNumberHooks = {
    onSumStep: (i, acc) => {
      probe = i;
      accSum = acc;
      snapshot({
        zh: `求和法：i=${i}，a[i]=${values[i]}，累和=${acc}`,
        en: `Sum: i=${i}, a[i]=${values[i]}, sum=${acc}`,
      });
    },
  };
  const bySum = missingNumberSum(input, sumHooks);

  rec
    .begin({
      zh: `完成：异或法=${byXor}，求和法=${bySum}（一致）`,
      en: `Done: xor=${byXor}, sum=${bySum} (consistent)`,
    })
    .setBars(values.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([
      { label: '缺失数字', value: String(byXor), role: 'final' },
      { label: '两种方法一致', value: byXor === bySum ? '✓' : '✗', role: 'final' },
    ])
    .commit();

  return rec.build();
}
