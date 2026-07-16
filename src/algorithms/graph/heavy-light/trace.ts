// =============================================================================
// 树链剖分 · 录制帧序列
// 可视化：setGraph（树），role:同一重链同色，重边='final'，当前='compare'。
// 末帧演示一条路径拆分。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heavyLight, splitPath, type GraphInput, type HeavyLightHooks } from './impl.ts';

/** 演示树：1 为根。
 *   1 - 2 - 3 - 4
 *       |
 *       5 - 6
 *       |
 *       7 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '2', to: '5' },
    { from: '5', to: '6' },
    { from: '5', to: '7' },
  ],
  root: '1',
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.08, y: 0.5 },
  '2': { x: 0.3, y: 0.5 },
  '3': { x: 0.52, y: 0.5 },
  '4': { x: 0.74, y: 0.5 },
  '5': { x: 0.3, y: 0.82 },
  '6': { x: 0.52, y: 0.82 },
  '7': { x: 0.3, y: 1.0 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const heavyEdge = new Set<string>(); // "parent>child"
  const topOf = new Map<string, string>();
  const dfnOf = new Map<string, number>();
  let pathSegs: Array<[number, number]> = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => ({
      id,
      label: `${id}\ntop=${topOf.get(id) ?? '?'}\ndfn=${dfnOf.get(id) ?? '?'}`,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: 'final' as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      const k1 = `${e.from}>${e.to}`;
      const k2 = `${e.to}>${e.from}`;
      if (heavyEdge.has(k1) || heavyEdge.has(k2)) role = 'final';
      return { from: e.from, to: e.to, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '重边', value: [...heavyEdge].join(', ') || '∅', role: 'final' },
        {
          label: '路径段',
          value: pathSegs.length ? pathSegs.map((s) => `[${s[0]},${s[1]}]`).join(' ') : '∅',
        },
      ])
      .commit();
  };

  render({ zh: '初始树', en: 'Initial tree' });

  const hooks: HeavyLightHooks = {
    onDfs1: (u, _sz, h) => {
      if (h) heavyEdge.add(`${u}>${h}`);
      render({ zh: `dfs1 ${u}：重儿子=${h ?? '∅'}`, en: `dfs1 ${u}: heavy=${h ?? '∅'}` });
    },
    onDfs2: (u, t, d) => {
      topOf.set(u, t);
      dfnOf.set(u, d);
      render({ zh: `dfs2 ${u}：链顶=${t}，dfn=${d}`, en: `dfs2 ${u}: top=${t}, dfn=${d}` });
    },
  };

  const result = heavyLight(input, hooks);

  // 演示一条路径拆分：4 → 7
  pathSegs = splitPath(result, '4', '7');
  render({
    zh: `路径 4→7 拆为 ${pathSegs.length} 段`,
    en: `Path 4→7 splits into ${pathSegs.length} segs`,
  });

  return rec.build();
}
