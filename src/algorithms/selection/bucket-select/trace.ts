// 桶选择 · 录制帧序列
// 用 setBars 展示当前候选集合，用 setAux 展示桶分布与定位信息。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bucketSelect, type BucketSelectHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [29, 7, 52, 11, 88, 35, 64, 18, 43, 96, 3, 77], k: 5 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const a = [...arr];
  const highlight = new Set<number>();
  const sorted = new Set<number>();
  let bucketInfo = '';
  let locInfo = '';

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const s of sorted) roles[s] = 'final';
    for (const h of highlight) if (!roles[h]) roles[h] = 'compare';
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'k', value: String(k), role: 'pivot' as BarRole },
      { label: 'n', value: String(a.length), role: 'frontier' as BarRole },
    ];
    if (bucketInfo) aux.push({ label: '桶分布', value: bucketInfo, role: 'compare' as BarRole });
    if (locInfo) aux.push({ label: '定位', value: locInfo, role: 'swap' as BarRole });
    rec.begin(note).setBars(rec.barsFrom(a, roles)).setAux(aux).commit();
    highlight.clear();
  };

  snapshot({
    zh: `桶选择找第 ${k + 1} 小（共 ${a.length} 个）`,
    en: `Bucket-select rank-${k + 1} among ${a.length}`,
  });

  const hooks: BucketSelectHooks = {
    onRange: (lo, hi, B) => {
      locInfo = `范围 [${lo}, ${hi}]，桶数 ${B}`;
      snapshot({ zh: `范围 [${lo}, ${hi}]，建 ${B} 桶`, en: `Range [${lo}, ${hi}], ${B} buckets` });
      locInfo = '';
    },
    onScatter: (i) => {
      highlight.add(i);
    },
    onLocate: (b, kRel) => {
      locInfo = `第 ${k + 1} 小在桶 ${b}，桶内排名 ${kRel}`;
      snapshot({ zh: `定位到桶 ${b}（桶内 k=${kRel}）`, en: `Located bucket ${b} (k=${kRel})` });
      locInfo = '';
    },
    onRecurse: (size) => {
      bucketInfo = `递归：候选 ${size} 个`;
      snapshot({ zh: `桶内递归（候选 ${size}）`, en: `Recurse inside bucket (${size})` });
      bucketInfo = '';
    },
    onBase: (_size, v) => {
      for (let i = 0; i < a.length; i++) if (a[i] === v) sorted.add(i);
      snapshot({ zh: `基线排序，命中 ${v}`, en: `Base case, found ${v}` });
    },
  };

  const ans = bucketSelect(arr, k, hooks);
  const idx = a.indexOf(ans);
  sorted.clear();
  for (let i = 0; i < a.length; i++) sorted.add(i);
  rec
    .begin({
      zh: `第 ${k + 1} 小 = ${ans}（下标 ${idx}）`,
      en: `Rank-${k + 1} smallest = ${ans} (index ${idx})`,
    })
    .setBars(rec.barsFrom(a, Object.fromEntries([...sorted].map((i) => [i, 'final']))))
    .setAux([
      { label: '结果', value: String(ans), role: 'final' as BarRole },
      { label: 'k', value: String(k), role: 'pivot' as BarRole },
      { label: '复杂度', value: '期望 O(n)', role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
