// =============================================================================
// 并查集（路径压缩）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { DsuPath, type DsuPathHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number; edges: Array<[number, number]> } = {
  n: 6,
  edges: [
    [0, 1],
    [2, 3],
    [1, 2],
    [4, 5],
    [3, 4],
  ],
};

export function buildTrace(
  input: { n: number; edges: Array<[number, number]> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges } = input;

  rec
    .begin({ zh: `并查集 n=${n}，依次 union 边`, en: `DSU n=${n}, union edges in order` })
    .setAux([{ label: 'n', value: String(n), role: 'frontier' }])
    .commit();

  const dsu = new DsuPath(n);
  for (let i = 0; i < n; i++) {
    rec
      .begin({ zh: `makeSet(${i})`, en: `makeSet(${i})` })
      .setAux([{ label: '初始', value: `parent[${i}]=${i}`, role: 'sorted' }])
      .commit();
  }

  const hooks: DsuPathHooks = {
    onUnion: (ra, rb) => {
      rec
        .begin({
          zh: `union：把根 ${ra} 挂到根 ${rb} 下，分量数=${dsu.count}`,
          en: `union: root ${ra} → root ${rb}, count=${dsu.count}`,
        })
        .setAux([
          { label: '合并', value: `${ra}→${rb}`, role: 'compare' },
          { label: '分量数', value: String(dsu.count), role: 'final' },
        ])
        .commit();
    },
    onCompress: (x, root) => {
      rec
        .begin({
          zh: `路径压缩：parent[${x}] = ${root}`,
          en: `Path compress: parent[${x}] = ${root}`,
        })
        .setAux([{ label: '压缩', value: `${x}→${root}`, role: 'frontier' }])
        .commit();
    },
  };
  // 把 hooks 挂上（重新建一遍以录制）
  const dsu2 = new DsuPath(n, hooks);
  for (let i = 0; i < n; i++) dsu2.parent[i] = i;

  for (const [u, v] of edges) {
    dsu2.union(u, v);
  }

  rec
    .begin({
      zh: `完成，连通分量数 = ${dsu2.count}`,
      en: `Done, connected components = ${dsu2.count}`,
    })
    .setAux([{ label: '分量数', value: String(dsu2.count), role: 'final' }])
    .commit();

  return rec.build();
}
