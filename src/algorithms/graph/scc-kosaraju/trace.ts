// =============================================================================
// Kosaraju SCC · 录制帧序列
// 可视化：setGraph（节点+边）。第一遍 DFS 标 frontier，第二遍每棵树同色 'final'。
// setAux 展示完成序栈与当前发现的分量。

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { type GraphInput, type SccKosarajuHooks } from './impl.ts';

/** 演示图：环 1 = 0→1→2→0；环 2 = 3→4→5→3；4→1 桥接。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
    { from: '4', to: '1' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.2, y: 0.3 },
  '1': { x: 0.2, y: 0.55 },
  '2': { x: 0.2, y: 0.8 },
  '3': { x: 0.7, y: 0.3 },
  '4': { x: 0.7, y: 0.55 },
  '5': { x: 0.7, y: 0.8 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const phase: Array<'pass1' | 'pass2'> = [];
  const visited = new Set<string>();
  const order: string[] = [];
  const assigned = new Set<string>();
  const sccOf = new Map<string, number>();
  const inCurTree = new Set<string>();
  let cur: string | null = null;
  let sccCount = 0;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (sccOf.has(id)) role = 'final';
      else if (phase[phase.length - 1] === 'pass1' && visited.has(id)) role = 'frontier';
      else if (phase[phase.length - 1] === 'pass2' && inCurTree.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      return {
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      directed: true,
      role: (sccOf.get(e.from) !== undefined && sccOf.get(e.from) === sccOf.get(e.to)
        ? 'final'
        : 'default') as BarRole,
    }));

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        {
          label: phase[phase.length - 1] === 'pass1' ? '完成序栈' : '当前 SCC',
          value:
            phase[phase.length - 1] === 'pass1'
              ? order.join('→')
              : inCurTree.size
                ? `[${[...inCurTree].join(',')}]`
                : '∅',
          role: 'frontier',
        },
        { label: '已发现 SCC', value: String(sccCount), role: 'final' },
      ])
      .commit();
  };

  phase.push('pass1');
  snapshot({ zh: '第一遍 DFS：求完成序', en: 'Pass 1: DFS for finish order' });

  const hooks: SccKosarajuHooks = {
    onVisit1: (v) => {
      visited.add(v);
      cur = v;
      snapshot({ zh: `访问 ${v}`, en: `Visit ${v}` });
    },
    onFinish1: (v) => {
      order.push(v);
      cur = v;
      snapshot({
        zh: `${v} 完成，入栈（栈: ${order.join('→')}）`,
        en: `${v} finished; stack ${order.join('→')}`,
      });
    },
    onVisit2: (root, v) => {
      if (sccCount === 0 || !inCurTree.has(root)) {
        // 新树开始（root 不在集合里说明新树）
      }
      inCurTree.add(v);
      cur = v;
      snapshot({ zh: `反图 DFS：从 ${root} 访问 ${v}`, en: `Rev-DFS from ${root}: visit ${v}` });
    },
    onComponent: (comp) => {
      sccCount++;
      for (const id of comp) {
        assigned.add(id);
        sccOf.set(id, sccCount);
      }
      cur = null;
      snapshot({
        zh: `发现 SCC #${sccCount}：{ ${comp.join(', ')} }`,
        en: `SCC #${sccCount}: { ${comp.join(', ')} }`,
      });
      inCurTree.clear();
    },
  };

  // pass1
  sccKosarajuPass1(input, hooks);
  // pass2
  phase.push('pass2');
  inCurTree.clear();
  snapshot({
    zh: '第二遍 DFS：在反图上按栈序摘树',
    en: 'Pass 2: DFS on reverse graph by stack order',
  });
  sccKosarajuPass2(input, order, hooks);

  rec
    .begin({ zh: `完成：共 ${sccCount} 个 SCC`, en: `Done: ${sccCount} SCCs` })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: 'SCC 总数', value: String(sccCount), role: 'final' }])
    .commit();

  return rec.build();
}

// —— 分阶段执行：与 impl 共用逻辑但分离两遍以便 trace 控制相位 ——
function sccKosarajuPass1(input: GraphInput, hooks: SccKosarajuHooks): string[] {
  const adj = new Map<string, string[]>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
  for (const list of adj.values()) list.sort();
  const visited = new Set<string>();
  const order: string[] = [];
  for (const start of input.nodes) {
    if (visited.has(start)) continue;
    const st: Array<{ v: string; ei: number }> = [{ v: start, ei: 0 }];
    visited.add(start);
    hooks.onVisit1?.(start);
    while (st.length > 0) {
      const f = st[st.length - 1]!;
      const nbrs = adj.get(f.v) ?? [];
      if (f.ei < nbrs.length) {
        const w = nbrs[f.ei]!;
        f.ei++;
        if (!visited.has(w)) {
          visited.add(w);
          hooks.onVisit1?.(w);
          st.push({ v: w, ei: 0 });
        }
      } else {
        st.pop();
        order.push(f.v);
        hooks.onFinish1?.(f.v);
      }
    }
  }
  return order;
}

function sccKosarajuPass2(input: GraphInput, order: string[], hooks: SccKosarajuHooks): void {
  const radj = new Map<string, string[]>();
  for (const n of input.nodes) radj.set(n, []);
  for (const e of input.edges) radj.get(e.to)!.push(e.from);
  for (const list of radj.values()) list.sort();
  const assigned = new Set<string>();
  for (let i = order.length - 1; i >= 0; i--) {
    const root = order[i]!;
    if (assigned.has(root)) continue;
    const comp: string[] = [];
    const st: string[] = [root];
    assigned.add(root);
    hooks.onVisit2?.(root, root);
    while (st.length > 0) {
      const u = st.pop()!;
      comp.push(u);
      for (const w of radj.get(u) ?? []) {
        if (!assigned.has(w)) {
          assigned.add(w);
          hooks.onVisit2?.(root, w);
          st.push(w);
        }
      }
    }
    hooks.onComponent?.(comp);
  }
}
