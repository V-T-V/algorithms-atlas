// =============================================================================
// 边双连通分量 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { edgeBiconnectedComponent, type GraphInput, type EbcHooks } from './impl.ts';

/** 示例：左环 A-B-C-A，右环 D-E-F-D，C-D 为桥。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
    { from: 'C', to: 'D' }, // 桥
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
    { from: 'F', to: 'D' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.3 },
  B: { x: 0.35, y: 0.7 },
  C: { x: 0.05, y: 0.7 },
  D: { x: 0.6, y: 0.3 },
  E: { x: 0.75, y: 0.7 },
  F: { x: 0.45, y: 0.7 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const bridges = new Set<string>(); // "from,to"
  const compColor = new Map<string, number>();
  let cur: string | null = null;
  let compCount = 0;

  const fmt = (m: Map<string, number>, id: string): string =>
    m.get(id) === undefined ? '·' : String(m.get(id));
  const isBridgeKey = (a: string, b: string): boolean =>
    bridges.has(`${a},${b}`) || bridges.has(`${b},${a}`);

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (compColor.has(id)) role = 'final';
      if (onStack.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
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
      role: (isBridgeKey(e.from, e.to)
        ? 'warn'
        : compColor.get(e.from) !== undefined && compColor.get(e.from) === compColor.get(e.to)
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
        { label: '桥', value: bridges.size ? [...bridges].join(',') : '∅', role: 'warn' },
        { label: '边双数', value: String(compCount), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: '初始无向图', en: 'Initial undirected graph' });

  const hooks: EbcHooks = {
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
    onBridge: (a, b) => {
      bridges.add(`${a},${b}`);
      cur = a;
      snap({ zh: `桥：${a}—${b}`, en: `Bridge: ${a}—${b}` });
    },
    onComponent: (comp) => {
      compCount++;
      for (const id of comp) {
        compColor.set(id, compCount);
        onStack.delete(id);
      }
      cur = null;
      snap({
        zh: `边双 #${compCount}：{ ${comp.join(', ')} }`,
        en: `Edge-BCC #${compCount}: { ${comp.join(', ')} }`,
      });
    },
  };

  edgeBiconnectedComponent(input, hooks);

  rec
    .begin({
      zh: `完成：${compCount} 个边双，${bridges.size} 条桥`,
      en: `Done: ${compCount} edge-BCCs, ${bridges.size} bridges`,
    })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '结果', value: `${compCount} 边双`, role: 'final' }])
    .commit();

  return rec.build();
}
