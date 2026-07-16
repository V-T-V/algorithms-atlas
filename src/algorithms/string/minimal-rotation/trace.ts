// =============================================================================
// 最小表示 · 录制帧序列
// setArray 展示双倍串（字符码），pointer 标注候选 i、j 与偏移 k。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minimalRotation, type MinimalRotationHooks } from './impl.ts';

export const DEFAULT_INPUT = 'dacba';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const ss = s + s;
  const nn = ss.length;
  let curI = -1;
  let curJ = -1;
  let curK = -1;
  let roleTip: BarRole = 'default';

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's+s', value: ss },
    { label: 'i', value: curI < 0 ? '-' : String(curI), role: 'compare' },
    { label: 'j', value: curJ < 0 ? '-' : String(curJ), role: 'frontier' },
    { label: 'k', value: curK < 0 ? '-' : String(curK) },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(nn).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (curI >= 0) {
      pointers.push({ index: curI, label: 'i' });
      roles[curI] = roleTip;
    }
    if (curJ >= 0) {
      pointers.push({ index: curJ, label: 'j' });
      roles[curJ] = roleTip;
    }
    if (curK >= 0 && curI + curK < nn) {
      pointers.push({ index: curI + curK, label: 'k' });
      roles[curI + curK] = 'compare';
    }
    rec.begin(note).setArray(CODE(ss), roles, pointers).setAux(aux()).commit();
    roleTip = 'default';
  };

  snap({ zh: `最小循环移位：${s}`, en: `Min rotation: ${s}` });

  const hooks: MinimalRotationHooks = {
    onCompare: (i, j, k) => {
      curI = i;
      curJ = j;
      curK = k;
      snap({ zh: `比较 ${i}+k 与 ${j}+k`, en: `Compare ${i}+k vs ${j}+k` });
    },
    onAdvance: (from, to) => {
      roleTip = 'warn';
      snap({ zh: `候选 ${from} 落后，新候选 ${to}`, en: `${from} loses, new ${to}` });
    },
    onDone: () => {},
  };

  const start = minimalRotation(s, hooks);
  const result = s.slice(start) + s.slice(0, start);
  curI = -1;
  rec
    .begin({
      zh: `完成：起点 ${start}，最小表示 '${result}'`,
      en: `Done: start ${start}, '${result}'`,
    })
    .setArray(CODE(ss), new Array(nn).fill('default'), [{ index: start, label: 'min' }])
    .setAux(aux())
    .commit();
  return rec.build();
}
