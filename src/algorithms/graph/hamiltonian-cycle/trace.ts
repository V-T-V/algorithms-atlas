// =============================================================================
// 哈密顿回路 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hamiltonianCycle, type GraphInput, type HamiltonHooks } from './impl.ts';

/** 示例：A-B-C-D-A 完整四边形（有解）。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'A' },
    { from: 'A', to: 'C' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.3 },
  B: { x: 0.5, y: 0.2 },
  C: { x: 0.8, y: 0.3 },
  D: { x: 0.5, y: 0.8 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const inPath = new Set<string>();
  const pathEdges = new Set<string>(); // "from,to"
  let cur: string | null = null;
  let solved = false;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (inPath.has(id)) role = solved ? 'final' : 'frontier';
      if (id === cur) role = 'compare';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role: (pathEdges.has(`${e.from},${e.to}`) || pathEdges.has(`${e.to},${e.from}`)
        ? solved
          ? 'final'
          : 'frontier'
        : 'default') as BarRole,
    }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        {
          label: '当前路径',
          value: inPath.size ? nodeIds.filter((n) => inPath.has(n)).join('→') : '∅',
          role: 'frontier',
        },
        { label: '长度', value: `${inPath.size}/${nodeIds.length}` },
      ])
      .commit();
  };

  snap({ zh: '初始图：从 A 出发回溯搜索', en: 'Initial graph: backtrack from A' });

  const hooks: HamiltonHooks = {
    onExtend: (path) => {
      inPath.clear();
      for (const v of path) inPath.add(v);
      pathEdges.clear();
      for (let i = 0; i < path.length - 1; i++) pathEdges.add(`${path[i]},${path[i + 1]}`);
      cur = path[path.length - 1]!;
      snap({ zh: `扩展：${path.join('→')}`, en: `Extend: ${path.join('→')}` });
    },
    onBacktrack: (path) => {
      inPath.clear();
      for (const v of path) inPath.add(v);
      pathEdges.clear();
      for (let i = 0; i < path.length - 1; i++) pathEdges.add(`${path[i]},${path[i + 1]}`);
      cur = null;
      snap({
        zh: `回溯到：${path.length ? path.join('→') : '∅'}`,
        en: `Backtrack to: ${path.length ? path.join('→') : '∅'}`,
      });
    },
    onResult: (cycle) => {
      if (cycle) {
        solved = true;
        inPath.clear();
        for (const v of cycle) inPath.add(v);
        pathEdges.clear();
        for (let i = 0; i < cycle.length - 1; i++) pathEdges.add(`${cycle[i]},${cycle[i + 1]}`);
        pathEdges.add(`${cycle[cycle.length - 1]},${cycle[0]}`); // 回到起点
        snap({
          zh: `找到哈密顿回路：${cycle.join('→')}→${cycle[0]}`,
          en: `Found: ${cycle.join('→')}→${cycle[0]}`,
        });
      } else {
        snap({ zh: '无哈密顿回路', en: 'No Hamiltonian cycle' });
      }
    },
  };

  hamiltonianCycle(input, hooks);

  rec
    .begin({ zh: solved ? '完成' : '无解', en: solved ? 'Done' : 'No solution' })
    .setGraph(mkNodes(), mkEdges())
    .setAux([
      { label: '结果', value: solved ? '存在哈密顿回路' : '无解', role: solved ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
