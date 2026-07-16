// =============================================================================
// 树上欧拉序 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerTourGraph, type TreeInput, type EulerHooks } from './impl.ts';

//     0
//    / \
//   1   2
//  / \
// 3   4
export const DEFAULT_INPUT: TreeInput = {
  nodes: ['0', '1', '2', '3', '4'],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
  ],
  root: '0',
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.5, y: 0.15 },
  '1': { x: 0.3, y: 0.5 },
  '2': { x: 0.7, y: 0.5 },
  '3': { x: 0.15, y: 0.85 },
  '4': { x: 0.45, y: 0.85 },
};

export function buildTrace(input: TreeInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const inTime = new Map<string, number>();
  const outTime = new Map<string, number>();
  const visited = new Set<string>();
  const order: string[] = []; // 进入序（dfn）
  let cur: string | null = null;

  const buildTree = (): TreeNode => {
    const childrenOf = new Map<string, string[]>();
    for (const n of nodeIds) childrenOf.set(n, []);
    // 用 inTime 重建访问结构：根据欧拉序推断
    // 简化：直接用 DFS 顺序重建
    const childMap = new Map<string, string[]>();
    for (const n of nodeIds) childMap.set(n, []);
    // 遍历进入序，相邻不同节点中后者是前者孩子（当后者的 inTime 紧随前者）
    for (let i = 0; i + 1 < order.length; i++) {
      const a = order[i]!;
      const b = order[i + 1]!;
      if (
        a !== b &&
        (inTime.get(b) ?? 0) > (inTime.get(a) ?? 0) &&
        (outTime.get(b) ?? 0) <= (outTime.get(a) ?? 0)
      ) {
        if (!childMap.get(a)!.includes(b)) childMap.get(a)!.push(b);
      }
    }
    const root = nodeIds.find((n) => inTime.has(n)) ?? nodeIds[0]!;
    const build = (id: string): TreeNode => ({
      id,
      value: id,
      role:
        cur === id
          ? 'compare'
          : outTime.get(id)
            ? 'final'
            : visited.has(id)
              ? 'frontier'
              : 'default',
      children: childMap.get(id)!.map(build),
    });
    return build(root);
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (outTime.has(id)) role = 'final';
      else if (visited.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      const it = inTime.get(id);
      const ot = outTime.get(id);
      return {
        id,
        label: `${id}\nin=${it ?? '·'}\nout=${ot ?? '·'}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role: 'default' as BarRole,
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setTree(buildTree())
      .setAux([
        { label: '进入序', value: order.length ? order.join(' → ') : '∅', role: 'frontier' },
      ])
      .commit();
  };

  render({ zh: '初始树', en: 'Initial tree' });

  const hooks: EulerHooks = {
    onEnter: (v, t) => {
      inTime.set(v, t);
      visited.add(v);
      order.push(v);
      cur = v;
      render({ zh: `进入 ${v}（in=${t}）`, en: `Enter ${v} (in=${t})` });
    },
    onExit: (v, t) => {
      outTime.set(v, t);
      cur = v;
      render({ zh: `离开 ${v}（out=${t}）`, en: `Exit ${v} (out=${t})` });
    },
  };

  eulerTourGraph(input, hooks);

  cur = null;
  rec
    .begin({
      zh: `完成：进入序长度 ${order.length}`,
      en: `Done: entry-order length ${order.length}`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({ from: e.from, to: e.to, role: 'final' as BarRole })),
    )
    .setAux([{ label: '进入序', value: order.join(' → '), role: 'final' }])
    .commit();

  return rec.build();
}
