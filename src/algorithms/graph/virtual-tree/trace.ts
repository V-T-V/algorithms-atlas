// =============================================================================
// 虚树 · 录制帧序列
// 可视化：setGraph（原树），role:关键点='pivot'，LCA 补点='frontier'，虚树边='final'。
// setAux 展示关键点与虚树边。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { virtualTree, type GraphInput, type VirtualTreeHooks } from './impl.ts';

/** 演示树（根 1）：
 *   1 - 2 - 3
 *   |
 *   4 - 5
 *   |
 *   6 - 7
 * 关键点 {3,5,7}：LCA(3,5)=1, LCA(5,7)=4 → 虚树含 {1,3,4,5,7} */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '1', to: '4' },
    { from: '4', to: '5' },
    { from: '4', to: '6' },
    { from: '6', to: '7' },
  ],
  root: '1',
};

export const DEFAULT_KEYS = ['3', '5', '7'];

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.12, y: 0.5 },
  '2': { x: 0.34, y: 0.28 },
  '3': { x: 0.56, y: 0.28 },
  '4': { x: 0.34, y: 0.72 },
  '5': { x: 0.56, y: 0.72 },
  '6': { x: 0.34, y: 0.96 },
  '7': { x: 0.56, y: 0.96 },
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: GraphInput = DEFAULT_INPUT,
  keys: readonly string[] = DEFAULT_KEYS,
): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const keySet = new Set(keys);
  const added = new Set<string>();
  const vtEdgeSet = new Set<string>(); // "par>child"
  let cur: string | null = null;
  let lcaPair: { a: string; b: string; l: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (keySet.has(id)) role = 'pivot';
      else if (added.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (vtEdgeSet.has(`${e.from}>${e.to}`) || vtEdgeSet.has(`${e.to}>${e.from}`)) role = 'final';
      return { from: e.from, to: e.to, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '关键点', value: [...keySet].join(', '), role: 'pivot' },
        {
          label: 'LCA',
          value: lcaPair ? `${lcaPair.a}∩${lcaPair.b}=${lcaPair.l}` : '∅',
          role: 'frontier',
        },
      ])
      .commit();
  };

  render({ zh: `原树，关键点 { ${keys.join(', ')} }`, en: `Tree, keys { ${keys.join(', ')} }` });

  const hooks: VirtualTreeHooks = {
    onLca: (a, b, l) => {
      lcaPair = { a, b, l };
      cur = l;
      render({ zh: `LCA(${a},${b}) = ${l}`, en: `LCA(${a},${b}) = ${l}` });
      lcaPair = null;
    },
    onAddVertex: (v) => {
      added.add(v);
      cur = v;
      render({ zh: `虚树加入 ${v}`, en: `Add ${v} to virtual tree` });
    },
    onTreeEdge: (par, child) => {
      vtEdgeSet.add(`${par}>${child}`);
      cur = child;
      render({ zh: `虚树边 ${par}→${child}`, en: `Virtual edge ${par}→${child}` });
    },
  };

  const result = virtualTree(input, keys, hooks);

  cur = null;
  rec
    .begin({
      zh: `虚树构建完成：${result.vertices.length} 节点，${result.edges.length} 边`,
      en: `Done: ${result.vertices.length} vertices, ${result.edges.length} edges`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (keySet.has(id) ? 'pivot' : added.has(id) ? 'frontier' : 'default') as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        role: (vtEdgeSet.has(`${e.from}>${e.to}`) || vtEdgeSet.has(`${e.to}>${e.from}`)
          ? 'final'
          : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '虚树节点', value: result.vertices.join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
