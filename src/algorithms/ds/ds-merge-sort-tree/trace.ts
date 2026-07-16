import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { MergeSortTree, type MergeSortTreeHooks } from './impl.ts';

export const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6];
export const DEFAULT_QUERIES = [
  { ql: 0, qr: 7, k: 5 },
  { ql: 2, qr: 5, k: 4 },
  { ql: 0, qr: 3, k: 2 },
];

export function buildTrace(
  arr: number[] = DEFAULT_ARR,
  queries: Array<{ ql: number; qr: number; k: number }> = DEFAULT_QUERIES,
): Frame[] {
  const rec = new TraceRecorder();
  let builtNodes = 0;

  rec
    .begin({ zh: `建树 [${arr.join(',')}]`, en: `Build [${arr.join(',')}]` })
    .setBars(arr.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: '初始', value: `[${arr.join(',')}]`, role: 'frontier' }])
    .commit();

  const hooks: MergeSortTreeHooks = {
    onBuildNode: (_node, _l, _r, sorted) => {
      builtNodes++;
      void sorted;
    },
    onQuery: (ql, qr, k, count) => {
      rec
        .begin({
          zh: `查询 [${ql},${qr}] ≤${k} = ${count}`,
          en: `Query [${ql},${qr}] ≤${k} = ${count}`,
        })
        .setBars(
          arr.map((v, idx) => ({
            value: v,
            role: (idx >= ql && idx <= qr ? (v <= k ? 'final' : 'compare') : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '区间', value: `[${ql},${qr}]`, role: 'frontier' },
          { label: 'k', value: String(k), role: 'compare' },
          { label: '计数', value: String(count), role: 'final' },
        ])
        .commit();
    },
  };

  const t = new MergeSortTree(arr, hooks);
  for (const q of queries) t.countLE(q.ql, q.qr, q.k);

  rec
    .begin({ zh: `共 ${builtNodes} 个节点`, en: `${builtNodes} nodes built` })
    .setAux([{ label: '节点数', value: String(builtNodes), role: 'final' }])
    .commit();

  return rec.build();
}
