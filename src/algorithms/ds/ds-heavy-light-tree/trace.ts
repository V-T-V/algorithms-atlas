// =============================================================================
// 树链剖分 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HeavyLightDecomposition, type HldHooks } from './impl.ts';

export const DEFAULT_INPUT: {
  n: number;
  edges: Array<[number, number]>;
  root: number;
  query: [number, number];
} = {
  n: 9,
  edges: [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [4, 7],
    [4, 8],
  ],
  root: 0,
  query: [7, 6],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges, root, query } = input;

  rec
    .begin({
      zh: `树链剖分：n=${n}，根 ${root}，查询 LCA(${query[0]},${query[1]})`,
      en: `HLD: n=${n}, root ${root}, query LCA(${query[0]},${query[1]})`,
    })
    .commit();

  const hooks: HldHooks = {
    onDfs1: (u, size, heavy) => {
      rec
        .begin({
          zh: `节点 ${u}: size=${size}, heavy=${heavy}`,
          en: `Node ${u}: size=${size}, heavy=${heavy}`,
        })
        .setAux([{ label: `${u}`, value: `s${size},h${heavy}`, role: 'sorted' }])
        .commit();
    },
    onDfs2: (u, top, dfn) => {
      rec
        .begin({ zh: `节点 ${u}: top=${top}, dfn=${dfn}`, en: `Node ${u}: top=${top}, dfn=${dfn}` })
        .setAux([{ label: `${u}`, value: `t${top},d${dfn}`, role: 'frontier' }])
        .commit();
    },
    onChainJump: (u, top) => {
      rec
        .begin({
          zh: `跳链：节点 ${u}（top=${top}）跳到父 ${top}`,
          en: `Jump chain: node ${u} (top=${top}) → parent ${top}`,
        })
        .setAux([{ label: '跳链', value: String(u), role: 'compare' }])
        .commit();
    },
  };

  const hld = new HeavyLightDecomposition({ n, edges, root }, hooks);
  const lca = hld.lca(query[0], query[1]);
  rec
    .begin({
      zh: `LCA(${query[0]},${query[1]}) = ${lca}`,
      en: `LCA(${query[0]},${query[1]}) = ${lca}`,
    })
    .setAux([{ label: 'LCA', value: String(lca), role: 'final' }])
    .commit();

  return rec.build();
}
