import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { FenwickPoint, type FenwickPointHooks } from './impl.ts';

export const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6];

interface Op {
  type: 'add' | 'query';
  index?: number;
  delta?: number;
  l?: number;
  r?: number;
}

export const DEFAULT_OPS: Op[] = [
  { type: 'query', l: 1, r: 8 },
  { type: 'add', index: 3, delta: 100 },
  { type: 'query', l: 1, r: 8 },
  { type: 'query', l: 1, r: 3 },
];

export function buildTrace(arr: number[] = DEFAULT_ARR, ops: Op[] = DEFAULT_OPS): Frame[] {
  const rec = new TraceRecorder();
  const curArr = arr.slice();

  rec
    .begin({ zh: `初始 [${arr.join(',')}]`, en: `Init [${arr.join(',')}]` })
    .setBars(arr.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: '初始', value: `[${arr.join(',')}]`, role: 'frontier' }])
    .commit();

  const hooks: FenwickPointHooks = {
    onPointAdd: (i, delta) => {
      curArr[i - 1] = curArr[i - 1]! + delta;
      rec
        .begin({ zh: `单点加 [${i}] +=${delta}`, en: `Point add [${i}] +=${delta}` })
        .setBars(
          curArr.map((x, idx) => ({
            value: x,
            role: (idx === i - 1 ? 'compare' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '索引', value: String(i), role: 'frontier' },
          { label: 'delta', value: String(delta), role: 'compare' },
        ])
        .commit();
    },
    onRangeQuery: (l, r, res) => {
      rec
        .begin({ zh: `查询 [${l},${r}] sum=${res}`, en: `Query [${l},${r}] sum=${res}` })
        .setBars(
          curArr.map((x, idx) => ({
            value: x,
            role: (idx >= l - 1 && idx <= r - 1 ? 'compare' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '区间', value: `[${l},${r}]`, role: 'frontier' },
          { label: 'sum', value: String(res), role: 'final' },
        ])
        .commit();
    },
  };

  const f = FenwickPoint.fromArray(arr, hooks);
  for (const op of ops) {
    if (op.type === 'add') f.pointAdd(op.index!, op.delta!);
    else f.rangeSum(op.l!, op.r!);
  }

  rec
    .begin({ zh: `最终 [${curArr.join(',')}]`, en: `Final [${curArr.join(',')}]` })
    .setBars(curArr.map((v) => ({ value: v, role: 'sorted' as BarRole })))
    .setAux([{ label: '最终', value: `[${curArr.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
