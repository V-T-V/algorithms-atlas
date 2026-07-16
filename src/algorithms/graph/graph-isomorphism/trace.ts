// =============================================================================
// 图同构 · 录制帧序列（仅渲染 G1，并把当前映射作为 aux 展示）
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { graphIsomorphism, type GraphInput, type IsoHooks } from './impl.ts';

/** 示例：G1 = 三角形 A-B-C；G2 = 三角形 X-Y-Z（同构）。 */
export const G1: GraphInput = {
  nodes: ['A', 'B', 'C'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
  ],
};
export const G2: GraphInput = {
  nodes: ['X', 'Y', 'Z'],
  edges: [
    { from: 'X', to: 'Y' },
    { from: 'Y', to: 'Z' },
    { from: 'Z', to: 'X' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.3, y: 0.25 },
  B: { x: 0.7, y: 0.25 },
  C: { x: 0.5, y: 0.8 },
};

export function buildTrace(
  input: { g1: GraphInput; g2: GraphInput } = { g1: G1, g2: G2 },
): Frame[] {
  const rec = new TraceRecorder();
  const { g1, g2 } = input;
  const nodeIds = g1.nodes;

  const mapping: Record<string, string> = {};
  const mappedG1 = new Set<string>();
  let curU: string | null = null;
  let result: boolean | null = null;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id, i) => {
      let role: BarRole = 'default';
      if (mappedG1.has(id)) role = result === true ? 'final' : 'frontier';
      if (id === curU) role = 'compare';
      return {
        id,
        label: mapping[id] ? `${id}→${mapping[id]}` : id,
        x: POS[id]?.x ?? 0.2 + 0.3 * i,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
  const mkEdges = (): GraphEdge[] =>
    g1.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        {
          label: '映射',
          value: Object.keys(mapping).length
            ? Object.entries(mapping)
                .map(([k, v]) => `${k}→${v}`)
                .join(', ')
            : '∅',
          role: 'compare',
        },
        {
          label: '结论',
          value: result === null ? '搜索中' : result ? '同构' : '不同构',
          role: result === false ? 'warn' : 'final',
        },
      ])
      .commit();
  };

  snap({ zh: 'G1 vs G2：建双射', en: 'G1 vs G2: build bijection' });

  const hooks: IsoHooks = {
    onMap: (m) => {
      Object.keys(mapping).forEach((k) => delete mapping[k]);
      Object.assign(mapping, m);
      mappedG1.clear();
      for (const k of Object.keys(m)) {
        mappedG1.add(k);
        curU = k;
      }
      snap({
        zh: `映射 ${Object.entries(m)
          .map(([k, v]) => `${k}→${v}`)
          .join(', ')}`,
        en: `Map ${Object.entries(m)
          .map(([k, v]) => `${k}->${v}`)
          .join(', ')}`,
      });
    },
    onBacktrack: (u, v) => {
      curU = u;
      snap({ zh: `回退 ${u}→${v}`, en: `Backtrack ${u}->${v}` });
    },
    onResult: (iso, m) => {
      result = iso;
      curU = null;
      if (m) {
        Object.keys(mapping).forEach((k) => delete mapping[k]);
        Object.assign(mapping, m);
        mappedG1.clear();
        for (const k of Object.keys(m)) mappedG1.add(k);
      }
      snap({ zh: iso ? `同构！映射确定` : '不同构', en: iso ? 'Isomorphic!' : 'Not isomorphic' });
    },
  };

  graphIsomorphism(g1, g2, hooks);

  rec
    .begin({ zh: result ? '同构' : '不同构', en: result ? 'Isomorphic' : 'Not isomorphic' })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '结论', value: result ? '同构' : '不同构', role: result ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
