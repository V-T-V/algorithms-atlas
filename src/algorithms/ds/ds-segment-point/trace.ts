import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SegmentTreePoint, type SegmentPointHooks } from './impl.ts';

export const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6];

interface Op {
  type: 'update' | 'query';
  index?: number;
  value?: number;
  l?: number;
  r?: number;
}

export const DEFAULT_OPS: Op[] = [
  { type: 'query', l: 0, r: 7 },
  { type: 'update', index: 2, value: 100 },
  { type: 'query', l: 0, r: 7 },
  { type: 'query', l: 0, r: 2 },
];

export function buildTrace(arr: number[] = DEFAULT_ARR, ops: Op[] = DEFAULT_OPS): Frame[] {
  const rec = new TraceRecorder();
  const curArr = arr.slice();

  rec
    .begin({ zh: `初始 [${arr.join(',')}]`, en: `Init [${arr.join(',')}]` })
    .setBars(arr.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: '初始', value: `[${arr.join(',')}]`, role: 'frontier' }])
    .commit();

  const hooks: SegmentPointHooks = {
    onUpdate: (idx, v) => {
      curArr[idx] = v;
      rec
        .begin({ zh: `单点更新 [${idx}] = ${v}`, en: `Point update [${idx}] = ${v}` })
        .setBars(
          curArr.map((x, i) => ({
            value: x,
            role: (i === idx ? 'compare' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '索引', value: String(idx), role: 'frontier' },
          { label: '新值', value: String(v), role: 'final' },
        ])
        .commit();
    },
    onQuery: (l, r, res) => {
      rec
        .begin({ zh: `查询 [${l},${r}] sum=${res}`, en: `Query [${l},${r}] sum=${res}` })
        .setBars(
          curArr.map((x, i) => ({
            value: x,
            role: (i >= l && i <= r ? 'compare' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '区间', value: `[${l},${r}]`, role: 'frontier' },
          { label: 'sum', value: String(res), role: 'final' },
        ])
        .commit();
    },
  };

  const tree = new SegmentTreePoint(arr, hooks);

  for (const op of ops) {
    if (op.type === 'update') tree.pointUpdate(op.index!, op.value!);
    else tree.query(op.l!, op.r!);
  }

  rec
    .begin({ zh: `最终 [${curArr.join(',')}]`, en: `Final [${curArr.join(',')}]` })
    .setBars(curArr.map((v) => ({ value: v, role: 'sorted' as BarRole })))
    .setAux([{ label: '最终', value: `[${curArr.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
