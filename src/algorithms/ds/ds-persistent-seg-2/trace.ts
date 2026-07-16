import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PersistentSegmentTree, type PersistentSegHooks } from './impl.ts';

export const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6];

export function buildTrace(arr: number[] = DEFAULT_ARR): Frame[] {
  const rec = new TraceRecorder();
  let version = 0;

  rec
    .begin({ zh: `空版本 v0`, en: `Empty version v0` })
    .setBars([{ value: 0, role: 'frontier' as BarRole }])
    .setAux([{ label: '版本', value: 'v0', role: 'frontier' }])
    .commit();

  const hooks: PersistentSegHooks = {
    onInsert: (v, value) => {
      version = v;
      rec
        .begin({ zh: `插入 ${value}，新版本 v${v}`, en: `Insert ${value}, new version v${v}` })
        .setBars(arr.slice(0, v).map((x) => ({ value: x, role: 'compare' as BarRole })))
        .setAux([
          { label: '版本', value: `v${v}`, role: 'final' },
          { label: '插入值', value: String(value), role: 'compare' },
        ])
        .commit();
    },
    onQuery: (l, r, k, result) => {
      rec
        .begin({
          zh: `k 小(${l}..${r}, k=${k}) = ${result}`,
          en: `k-th(${l}..${r}, k=${k}) = ${result}`,
        })
        .setBars(
          arr
            .slice(l - 1, r)
            .map((x) => ({ value: x, role: (x === result ? 'final' : 'sorted') as BarRole })),
        )
        .setAux([
          { label: '区间', value: `[${l},${r}]`, role: 'frontier' },
          { label: 'k', value: String(k), role: 'compare' },
          { label: '第 k 小', value: String(result), role: 'final' },
        ])
        .commit();
    },
  };

  const tree = new PersistentSegmentTree(arr, hooks);
  for (const v of arr) tree.insert(v);

  // 几个查询
  tree.kthSmallest(1, arr.length, 1); // 最小
  tree.kthSmallest(1, arr.length, arr.length); // 最大

  rec
    .begin({ zh: `共 ${version} 个版本`, en: `${version} versions total` })
    .setAux([{ label: '版本数', value: String(version), role: 'final' }])
    .commit();

  return rec.build();
}
