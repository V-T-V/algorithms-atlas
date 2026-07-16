// =============================================================================
// 树链剖分·完整实现 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heavyLightDecomposition, type TreeInput, type HldHooks } from './impl.ts';

//      0
//     /|\
//    1 2 3
//   /|   |
//  4 5   6
//  |
//  7
export const DEFAULT_INPUT: TreeInput = {
  nodes: ['0', '1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '0', to: '3' },
    { from: '1', to: '4' },
    { from: '1', to: '5' },
    { from: '3', to: '6' },
    { from: '4', to: '7' },
  ],
  root: '0',
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.5, y: 0.1 },
  '1': { x: 0.25, y: 0.35 },
  '2': { x: 0.5, y: 0.35 },
  '3': { x: 0.75, y: 0.35 },
  '4': { x: 0.12, y: 0.6 },
  '5': { x: 0.38, y: 0.6 },
  '6': { x: 0.75, y: 0.6 },
  '7': { x: 0.12, y: 0.9 },
};

// 为每个重链分配一种角色色
const CHAIN_COLOR: Record<number, BarRole> = {
  0: 'frontier',
  1: 'pivot',
  2: 'final',
  3: 'compare',
  4: 'warn',
  5: 'swap',
};

export function buildTrace(input: TreeInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const size = new Map<string, number>();
  const heavy = new Map<string, string | null>();
  const top = new Map<string, string>();
  const dfn = new Map<string, number>();
  const depth = new Map<string, number>();
  let phase: 'dfs1' | 'dfs2' = 'dfs1';
  let cur: string | null = null;

  const computeTopList = (): string[] => {
    const list: string[] = [];
    for (const n of nodeIds) {
      const t = top.get(n);
      if (t && !list.includes(t)) list.push(t);
    }
    return list;
  };

  const render = (note: { zh: string; en: string }): void => {
    const topList = computeTopList();
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (top.has(id)) {
        const ti = topList.indexOf(top.get(id) ?? id);
        role = CHAIN_COLOR[ti] ?? 'frontier';
      }
      if (id === cur) role = 'compare';
      const labels = [
        `sz=${size.get(id) ?? '·'}`,
        `d=${depth.get(id) ?? '·'}`,
        `top=${top.get(id) ?? '·'}`,
        `dfn=${dfn.get(id) ?? '·'}`,
      ];
      return {
        id,
        label: `${id}\n${labels.join('\n')}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      // 重边高亮
      const isHeavy = heavy.get(e.from) === e.to || heavy.get(e.to) === e.from;
      return { from: e.from, to: e.to, role: (isHeavy ? 'compare' : 'default') as BarRole };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        {
          label: '阶段',
          value: phase === 'dfs1' ? 'dfs1 求 size/heavy' : 'dfs2 求 top/dfn',
          role: 'frontier',
        },
      ])
      .commit();
  };

  render({ zh: '初始树', en: 'Initial tree' });

  const hooks: HldHooks = {
    onDfs1: (v, sz, hv) => {
      phase = 'dfs1';
      size.set(v, sz);
      heavy.set(v, hv);
      cur = v;
      render({
        zh: `${v}: size=${sz}, heavy=${hv ?? '∅'}`,
        en: `${v}: size=${sz}, heavy=${hv ?? '∅'}`,
      });
    },
    onDfs2: (v, t, d) => {
      phase = 'dfs2';
      top.set(v, t);
      dfn.set(v, d);
      cur = v;
      render({ zh: `${v}: top=${t}, dfn=${d}`, en: `${v}: top=${t}, dfn=${d}` });
    },
  };

  // depth 在 dfs1 阶段已建立，但 hooks 里没透出，我们提前计算一遍给显示用
  // 简化：直接再跑一次仅算 depth（不影响正确性，只为可视化）
  const depthMap = new Map<string, number>();
  const adj2 = new Map<string, string[]>();
  for (const n of nodeIds) adj2.set(n, []);
  for (const e of input.edges) {
    adj2.get(e.from)!.push(e.to);
    adj2.get(e.to)!.push(e.from);
  }
  {
    const st: Array<{ v: string; d: number }> = [{ v: input.root ?? nodeIds[0]!, d: 0 }];
    const seen = new Set<string>();
    while (st.length > 0) {
      const { v, d } = st.pop()!;
      if (seen.has(v)) continue;
      seen.add(v);
      depthMap.set(v, d);
      depth.set(v, d);
      for (const c of adj2.get(v) ?? []) st.push({ v: c, d: d + 1 });
    }
  }

  heavyLightDecomposition(input, hooks);

  cur = null;
  rec
    .begin({ zh: '剖分完成', en: 'Decomposition done' })
    .setGraph(
      nodeIds.map((id) => {
        const ti = computeTopList().indexOf(top.get(id) ?? id);
        return {
          id,
          label: `${id}\ntop=${top.get(id) ?? '·'}\ndfn=${dfn.get(id) ?? '·'}`,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: (CHAIN_COLOR[ti] ?? 'frontier') as BarRole,
        };
      }),
      input.edges.map((e) => {
        const isHeavy = heavy.get(e.from) === e.to || heavy.get(e.to) === e.from;
        return { from: e.from, to: e.to, role: (isHeavy ? 'compare' : 'default') as BarRole };
      }),
    )
    .setAux([{ label: '节点数', value: String(nodeIds.length), role: 'final' }])
    .commit();

  return rec.build();
}
