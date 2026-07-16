// =============================================================================
// 支配树 · 录制帧序列
// 可视化：setGraph，role:已确定 idom='final'，当前='compare'，起点='frontier'；
// 末帧以树边（idom→v）高亮展示支配树。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dominator, type DominatorHooks, type GraphInput } from './impl.ts';

/** 演示流程图（经典 diamond + 跳边）：
 *  s→a, s→c, a→b, b→c, b→t, c→t。起 s，汇 t。
 *  idom：a,c 的父=s；b 的父=a；t 的父=s（因 s→c→t 旁路 b）。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['s', 'a', 'b', 'c', 't'],
  edges: [
    { from: 's', to: 'a' },
    { from: 's', to: 'c' },
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'b', to: 't' },
    { from: 'c', to: 't' },
  ],
  start: 's',
};

const POS: Record<string, { x: number; y: number }> = {
  s: { x: 0.1, y: 0.5 },
  a: { x: 0.32, y: 0.25 },
  b: { x: 0.54, y: 0.25 },
  c: { x: 0.54, y: 0.75 },
  t: { x: 0.86, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const idom = new Map<string, string>();
  idom.set(input.start, input.start);
  const visited = new Set<string>([input.start]);
  let cur: string | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (idom.has(id)) role = 'final';
      if (id === input.start) role = 'frontier';
      if (id === cur) role = 'compare';
      return {
        id,
        label: id === input.start ? id : idom.has(id) ? `${id}\nidom=${idom.get(id)}` : id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      // 支配树边：idom[v]==e.from
      if (idom.get(e.to) === e.from && e.to !== input.start) role = 'final';
      return { from: e.from, to: e.to, directed: true, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '起点', value: input.start, role: 'frontier' },
        {
          label: 'idom',
          value: [...idom.entries()].map(([v, d]) => `${v}←${d}`).join('  ') || '∅',
        },
      ])
      .commit();
  };

  render({ zh: `初始流程图，起点 ${input.start}`, en: `Initial CFG, entry ${input.start}` });

  const hooks: DominatorHooks = {
    onVisit: (v) => {
      cur = v;
      visited.add(v);
      render({ zh: `RPO 访问 ${v}`, en: `RPO visit ${v}` });
    },
    onIntersect: (p, v) => {
      cur = v;
      render({ zh: `取前驱交集：${p} & idom[${v}]`, en: `Intersect pred ${p} for ${v}` });
    },
    onSetIdom: (v, d) => {
      idom.set(v, d);
      cur = v;
      render({ zh: `置 idom[${v}] = ${d}`, en: `Set idom[${v}] = ${d}` });
    },
  };

  const result = dominator(input, hooks);

  cur = null;
  rec
    .begin({ zh: '支配树构建完成', en: 'Dominator tree built' })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (result.idom.has(id) ? 'final' : 'default') as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        directed: true,
        role: (result.idom.get(e.to) === e.from && e.to !== input.start
          ? 'final'
          : 'default') as BarRole,
      })),
    )
    .setAux([
      {
        label: 'idom',
        value: [...result.idom.entries()].map(([v, d]) => `${v}←${d}`).join('  '),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
