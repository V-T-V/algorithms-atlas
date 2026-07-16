// 同时找最小与最大 · 录制帧序列
// 用 setArray 展示扫描进度（高亮当前对），用 setAux 展示 min/max/比较次数。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minMax, type MinMaxHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 9, 2, 8, 5, 4, 7, 6, 0];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const pairIdx = new Set<number>();
  const minIdxSet = new Set<number>();
  const maxIdxSet = new Set<number>();
  let curMin = Infinity;
  let curMax = -Infinity;
  let cmp = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(a.length).fill('default');
    for (const i of pairIdx) roles[i] = 'compare';
    for (const i of minIdxSet) roles[i] = 'frontier';
    for (const i of maxIdxSet) roles[i] = 'pivot';
    const ptrs: Array<{ index: number; label: string }> = [...pairIdx].map((i) => ({
      index: i,
      label: 'pair',
    }));
    rec
      .begin(note)
      .setArray(a, roles, ptrs)
      .setAux([
        { label: 'min', value: `${curMin}`, role: 'frontier' as BarRole },
        { label: 'max', value: `${curMax}`, role: 'pivot' as BarRole },
        { label: '比较次数', value: String(cmp), role: 'compare' as BarRole },
        { label: '理论下界', value: String(Math.ceil((3 * a.length) / 2) - 2), role: 'default' },
      ])
      .commit();
    pairIdx.clear();
    minIdxSet.clear();
    maxIdxSet.clear();
  };

  snapshot({ zh: `共 ${a.length} 个元素，成对比较`, en: `${a.length} elements, pair-wise` });

  const hooks: MinMaxHooks = {
    onInit: (mn, mx) => {
      curMin = mn;
      curMax = mx;
      snapshot({ zh: `初值 min=${mn}, max=${mx}`, en: `Init min=${mn}, max=${mx}` });
    },
    onPair: (_p, si, li) => {
      pairIdx.add(si);
      pairIdx.add(li);
      cmp += 1;
      snapshot({ zh: `处理一对 [${si}, ${li}]`, en: `Process pair [${si}, ${li}]` });
    },
    onCompareMin: (idx, cand, _cmn, upd) => {
      cmp += 1;
      pairIdx.add(idx);
      if (upd) {
        curMin = cand;
        minIdxSet.add(idx);
      }
      snapshot({
        zh: `比 min：${cand}${upd ? ' 更新为最小' : ' 不更新'}`,
        en: `vs min: ${cand}${upd ? ' updated' : ' no'}`,
      });
    },
    onCompareMax: (idx, cand, _cmx, upd) => {
      cmp += 1;
      pairIdx.add(idx);
      if (upd) {
        curMax = cand;
        maxIdxSet.add(idx);
      }
      snapshot({
        zh: `比 max：${cand}${upd ? ' 更新为最大' : ' 不更新'}`,
        en: `vs max: ${cand}${upd ? ' updated' : ' no'}`,
      });
    },
  };

  const result = minMax(input, hooks);

  rec
    .begin({
      zh: `完成：min=${result.min}, max=${result.max}`,
      en: `Done: min=${result.min}, max=${result.max}`,
    })
    .setArray(a, new Array(a.length).fill('final'), [])
    .setAux([
      { label: 'min', value: String(result.min), role: 'frontier' as BarRole },
      { label: 'max', value: String(result.max), role: 'pivot' as BarRole },
      { label: '总比较', value: String(result.comparisons), role: 'final' as BarRole },
      { label: '复杂度', value: '⌈3n/2⌉−2', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
