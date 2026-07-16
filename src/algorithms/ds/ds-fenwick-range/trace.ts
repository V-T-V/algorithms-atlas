import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { FenwickRange, type FenwickRangeHooks } from './impl.ts';

export const DEFAULT_ARR = [1, 2, 3, 4, 5, 6, 7, 8];

interface Op {
  type: 'add' | 'query';
  l?: number;
  r?: number;
  delta?: number;
  i?: number;
}

export const DEFAULT_OPS: Op[] = [
  { type: 'add', l: 2, r: 5, delta: 10 },
  { type: 'query', i: 3 },
  { type: 'query', i: 7 },
  { type: 'add', l: 1, r: 8, delta: -1 },
  { type: 'query', i: 4 },
];

export function buildTrace(arr: number[] = DEFAULT_ARR, ops: Op[] = DEFAULT_OPS): Frame[] {
  const rec = new TraceRecorder();
  const curArr = arr.slice();

  rec
    .begin({ zh: `初始 [${arr.join(',')}]`, en: `Init [${arr.join(',')}]` })
    .setBars(arr.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: '初始', value: `[${arr.join(',')}]`, role: 'frontier' }])
    .commit();

  const hooks: FenwickRangeHooks = {
    onRangeAdd: (l, r, delta) => {
      for (let i = l; i <= r; i++) curArr[i - 1] = curArr[i - 1]! + delta;
      rec
        .begin({ zh: `区间加 [${l},${r}] +=${delta}`, en: `Range add [${l},${r}] +=${delta}` })
        .setBars(
          curArr.map((x, idx) => ({
            value: x,
            role: (idx >= l - 1 && idx <= r - 1 ? 'final' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '区间', value: `[${l},${r}]`, role: 'frontier' },
          { label: 'delta', value: String(delta), role: 'compare' },
        ])
        .commit();
    },
    onPointQuery: (i, v) => {
      rec
        .begin({ zh: `查询 a[${i}]=${v}`, en: `Query a[${i}]=${v}` })
        .setBars(
          curArr.map((x, idx) => ({
            value: x,
            role: (idx === i - 1 ? 'compare' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '索引', value: String(i), role: 'frontier' },
          { label: '值', value: String(v), role: 'final' },
        ])
        .commit();
    },
  };

  const f = FenwickRange.fromArray(arr, hooks);
  for (const op of ops) {
    if (op.type === 'add') f.rangeAdd(op.l!, op.r!, op.delta!);
    else f.pointQuery(op.i!);
  }

  rec
    .begin({ zh: `最终 [${curArr.join(',')}]`, en: `Final [${curArr.join(',')}]` })
    .setBars(curArr.map((v) => ({ value: v, role: 'sorted' as BarRole })))
    .setAux([{ label: '最终', value: `[${curArr.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
