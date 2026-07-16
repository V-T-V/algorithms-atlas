import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { WaveletTree, type WaveletTreeHooks } from './impl.ts';

export const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6];
export const DEFAULT_QUERIES = [
  { l: 0, r: 7, k: 1 },
  { l: 0, r: 7, k: 4 },
  { l: 0, r: 7, k: 8 },
];

export function buildTrace(
  arr: number[] = DEFAULT_ARR,
  queries: Array<{ l: number; r: number; k: number }> = DEFAULT_QUERIES,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `建树 [${arr.join(',')}]`, en: `Build [${arr.join(',')}]` })
    .setBars(arr.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: '初始', value: `[${arr.join(',')}]`, role: 'frontier' }])
    .commit();

  const hooks: WaveletTreeHooks = {
    onQuery: (l, r, k, result) => {
      rec
        .begin({
          zh: `k 小 [${l},${r}] k=${k} = ${result}`,
          en: `k-th [${l},${r}] k=${k} = ${result}`,
        })
        .setBars(
          arr
            .slice(l, r + 1)
            .map((v) => ({ value: v, role: (v === result ? 'final' : 'sorted') as BarRole })),
        )
        .setAux([
          { label: '区间', value: `[${l},${r}]`, role: 'frontier' },
          { label: 'k', value: String(k), role: 'compare' },
          { label: '第 k 小', value: String(result), role: 'final' },
        ])
        .commit();
    },
  };

  const t = new WaveletTree(arr, hooks);
  for (const q of queries) t.kth(q.l, q.r, q.k);

  rec
    .begin({ zh: `共 ${queries.length} 查询`, en: `${queries.length} queries` })
    .setAux([{ label: '查询数', value: String(queries.length), role: 'final' }])
    .commit();

  return rec.build();
}
