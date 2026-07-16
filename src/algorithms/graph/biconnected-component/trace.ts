// =============================================================================
// 点双连通分量 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { biconnectedComponent, type GraphInput, type BccHooks } from './impl.ts';

/** 示例：含一个割点 C；C-A-B-C 与 C-D-E-C 两个块共用 C。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'C' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.25 },
  B: { x: 0.5, y: 0.2 },
  C: { x: 0.5, y: 0.55 },
  D: { x: 0.5, y: 0.85 },
  E: { x: 0.8, y: 0.75 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const cut = new Set<string>();
  const compColor = new Map<string, number>();
  let cur: string | null = null;
  let compCount = 0;

  const fmt = (m: Map<string, number>, id: string): string =>
    m.get(id) === undefined ? '·' : String(m.get(id));

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (cut.has(id)) role = 'pivot';
      if (onStack.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      if (compColor.has(id) && !cut.has(id)) role = 'final';
      return {
        id,
        label: `${id}\ndfn=${fmt(dfn, id)}\nlow=${fmt(low, id)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role: (compColor.has(e.from) && compColor.get(e.from) === compColor.get(e.to)
        ? 'final'
        : 'default') as BarRole,
    }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        { label: 'dfn', value: nodeIds.map((n) => `${n}:${fmt(dfn, n)}`).join('  ') },
        { label: 'low', value: nodeIds.map((n) => `${n}:${fmt(low, n)}`).join('  ') },
        { label: '割点', value: cut.size ? [...cut].join(',') : '∅', role: 'pivot' },
        { label: '块数', value: String(compCount), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: '初始无向图', en: 'Initial undirected graph' });

  const hooks: BccHooks = {
    onDiscover: (v, d) => {
      dfn.set(v, d);
      low.set(v, d);
      onStack.add(v);
      cur = v;
      snap({ zh: `访问 ${v}：dfn=low=${d}`, en: `Visit ${v}: dfn=low=${d}` });
    },
    onUpdateLow: (v, nl) => {
      low.set(v, nl);
      cur = v;
      snap({ zh: `更新 low[${v}] = ${nl}`, en: `Update low[${v}] = ${nl}` });
    },
    onCutVertex: (v) => {
      cut.add(v);
      cur = v;
      snap({ zh: `${v} 是割点`, en: `${v} is a cut vertex` });
    },
    onComponent: (comp) => {
      compCount++;
      for (const id of comp) {
        compColor.set(id, compCount);
        onStack.delete(id);
      }
      cur = null;
      snap({
        zh: `块 #${compCount}：{ ${comp.join(', ')} }`,
        en: `Block #${compCount}: { ${comp.join(', ')} }`,
      });
    },
  };

  biconnectedComponent(input, hooks);

  rec
    .begin({
      zh: `完成：${compCount} 个块，割点 ${cut.size ? [...cut].join(',') : '无'}`,
      en: `Done: ${compCount} blocks, cuts ${cut.size ? [...cut].join(',') : 'none'}`,
    })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '结果', value: `${compCount} 块 / ${cut.size} 割点`, role: 'final' }])
    .commit();

  return rec.build();
}
