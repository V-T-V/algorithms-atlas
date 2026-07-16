// =============================================================================
// 树上启发式合并 · 录制帧序列
// 可视化：setGraph（树以无向图展示），role:当前正在合并的子树='frontier'，
//        重儿子边='final'，已得出答案='final'；setAux 展示颜色桶与答案。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dsuOnTree, type DsuOnTreeHooks, type GraphInput } from './impl.ts';

/** 演示树：7 节点，颜色如下。根 1。
 *        1(c=1) - 2(c=2) - 3(c=2)
 *         |
 *        4(c=1) - 5(c=3)
 *         |
 *        6(c=4) - 7(c=1) */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  values: [1, 2, 2, 1, 3, 4, 1],
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

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.3, y: 0.5 },
  '2': { x: 0.6, y: 0.3 },
  '3': { x: 0.88, y: 0.3 },
  '4': { x: 0.6, y: 0.7 },
  '5': { x: 0.88, y: 0.55 },
  '6': { x: 0.6, y: 0.92 },
  '7': { x: 0.88, y: 0.85 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const valueOf = new Map<string, number>();
  nodeIds.forEach((n, i) => valueOf.set(n, input.values[i] ?? 0));

  const heavyEdge = new Set<string>(); // "parent>child" 重边
  const curSubtree = new Set<string>(); // 当前在桶中的节点
  const answered = new Map<string, number>();
  let cur: string | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (answered.has(id)) role = 'final';
      else if (curSubtree.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      return {
        id,
        label: `${id}(c=${valueOf.get(id)})`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
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
        {
          label: '桶中节点',
          value: curSubtree.size ? [...curSubtree].join(', ') : '∅',
          role: 'frontier',
        },
        {
          label: '已答',
          value: [...answered.entries()].map(([v, d]) => `${v}:${d}`).join('  ') || '∅',
          role: 'final',
        },
      ])
      .commit();
  };

  render({ zh: '初始树（先求重儿子）', en: 'Initial tree (find heavy children)' });

  const hooks: DsuOnTreeHooks = {
    onEnter: (u) => {
      cur = u;
      render({ zh: `处理 ${u}`, en: `Process ${u}` });
    },
    onHeavyChild: (u, h) => {
      if (h) {
        heavyEdge.add(`${u}>${h}`);
        cur = u;
        render({ zh: `${u} 的重儿子 = ${h}`, en: `Heavy child of ${u} = ${h}` });
      }
    },
    onApply: (w, add) => {
      if (add) curSubtree.add(w);
      else curSubtree.delete(w);
      cur = w;
      render({
        zh: `${add ? '加入' : '移除'} ${w}（c=${valueOf.get(w)}）`,
        en: `${add ? 'Add' : 'Remove'} ${w}`,
      });
    },
    onAnswer: (u, d) => {
      answered.set(u, d);
      cur = u;
      render({ zh: `${u} 子树不同颜色数 = ${d}`, en: `Subtree of ${u}: ${d} distinct` });
    },
    onClear: () => {
      curSubtree.clear();
      render({ zh: '清空桶', en: 'Clear bucket' });
    },
  };

  const result = dsuOnTree(input, hooks);

  cur = null;
  rec
    .begin({ zh: '全部完成', en: 'Done' })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: `${id}=${result.distinct.get(id) ?? '?'}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        role: (heavyEdge.has(`${e.from}>${e.to}`) || heavyEdge.has(`${e.to}>${e.from}`)
          ? 'final'
          : 'default') as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
