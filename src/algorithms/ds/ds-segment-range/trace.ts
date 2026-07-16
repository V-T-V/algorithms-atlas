import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SegmentTreeRange, type SegmentRangeHooks } from './impl.ts';

export const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6];

interface Op {
  type: 'update' | 'query';
  l: number;
  r: number;
  value?: number;
}

export const DEFAULT_OPS: Op[] = [
  { type: 'update', l: 1, r: 3, value: 10 },
  { type: 'query', l: 0, r: 7 },
  { type: 'update', l: 5, r: 6, value: 0 },
  { type: 'query', l: 0, r: 7 },
];

export function buildTrace(arr: number[] = DEFAULT_ARR, ops: Op[] = DEFAULT_OPS): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始 [${arr.join(',')}]`, en: `Init [${arr.join(',')}]` })
    .setBars(arr.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: '初始', value: `[${arr.join(',')}]`, role: 'frontier' }])
    .commit();

  const curArr = arr.slice();

  const hooks: SegmentRangeHooks = {
    onUpdate: (l, r, v) => {
      for (let i = l; i <= r; i++) curArr[i] = v;
      rec
        .begin({ zh: `区间赋值 [${l},${r}] = ${v}`, en: `Range update [${l},${r}] = ${v}` })
        .setBars(
          curArr.map((x, idx) => ({
            value: x,
            role: (idx >= l && idx <= r ? 'final' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '区间', value: `[${l},${r}]`, role: 'frontier' },
          { label: '值', value: String(v), role: 'compare' },
        ])
        .commit();
    },
    onQuery: (l, r, res) => {
      rec
        .begin({ zh: `查询 [${l},${r}] max=${res}`, en: `Query [${l},${r}] max=${res}` })
        .setBars(
          curArr.map((x, idx) => ({
            value: x,
            role: (idx >= l && idx <= r ? 'compare' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '区间', value: `[${l},${r}]`, role: 'frontier' },
          { label: 'max', value: String(res), role: 'final' },
        ])
        .commit();
    },
  };

  const tree = new SegmentTreeRange(arr, hooks);

  for (const op of ops) {
    if (op.type === 'update') tree.rangeUpdate(op.l, op.r, op.value!);
    else tree.query(op.l, op.r);
  }

  rec
    .begin({ zh: `最终 [${curArr.join(',')}]`, en: `Final [${curArr.join(',')}]` })
    .setBars(curArr.map((v) => ({ value: v, role: 'sorted' as BarRole })))
    .setAux([{ label: '最终', value: `[${curArr.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
