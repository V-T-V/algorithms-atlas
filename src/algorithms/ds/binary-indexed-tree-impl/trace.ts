// =============================================================================
// 树状数组（区间更新版）· 录制帧序列
// setArray 展示当前数组值（逐点查询），setAux 展示 BIT 状态与查询结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BITRange, type BITRangeHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  size: 8,
  ops: [
    { op: 'rangeAdd', l: 1, r: 5, v: 3 },
    { op: 'rangeAdd', l: 3, r: 7, v: 2 },
    { op: 'rangeSum', l: 1, r: 8 },
    { op: 'rangeSum', l: 2, r: 4 },
    { op: 'rangeAdd', l: 6, r: 8, v: -1 },
    { op: 'rangeSum', l: 5, r: 8 },
  ] as const,
};

export function buildTrace(
  input: {
    size: number;
    ops: ReadonlyArray<{ op: 'rangeAdd' | 'rangeSum'; l: number; r: number; v?: number }>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const bit = new BITRange(input.size);

  // 当前数组值（每次操作后重算）
  const snapshot = (
    note: { zh: string; en: string },
    highlightRange: [number, number] | null = null,
  ): void => {
    const values: number[] = [];
    const roles: BarRole[] = [];
    const pointers: Array<{ index: number; label: string }> = [];
    for (let i = 1; i <= input.size; i++) {
      values.push(bit.pointValue(i));
      let role: BarRole = 'default';
      if (highlightRange && i >= highlightRange[0] && i <= highlightRange[1]) {
        role = 'swap';
      }
      roles.push(role);
    }
    rec
      .begin(note)
      .setArray(values, roles, pointers)
      .setAux([{ label: '数组', value: `[${values.join(', ')}]`, role: 'final' as BarRole }])
      .commit();
  };

  snapshot({ zh: '空数组（全 0）', en: 'Empty array (all zeros)' });

  const hooks: BITRangeHooks = {};

  for (const o of input.ops) {
    if (o.op === 'rangeAdd') {
      bit.rangeAdd(o.l, o.r, o.v ?? 0, hooks);
      snapshot(
        {
          zh: `区间 [${o.l}, ${o.r}] 加 ${o.v}`,
          en: `Range [${o.l}, ${o.r}] += ${o.v}`,
        },
        [o.l, o.r],
      );
    } else {
      const sum = bit.rangeSum(o.l, o.r, hooks);
      snapshot(
        {
          zh: `查询区间 [${o.l}, ${o.r}] 的和 = ${sum}`,
          en: `Sum over [${o.l}, ${o.r}] = ${sum}`,
        },
        [o.l, o.r],
      );
    }
  }

  // 终态
  const finalValues: number[] = [];
  for (let i = 1; i <= input.size; i++) finalValues.push(bit.pointValue(i));
  rec
    .begin({
      zh: `完成；最终数组 = [${finalValues.join(', ')}]`,
      en: `Done; final array = [${finalValues.join(', ')}]`,
    })
    .setArray(
      finalValues,
      finalValues.map(() => 'final' as BarRole),
      [],
    )
    .setAux([{ label: '数组', value: `[${finalValues.join(', ')}]`, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
