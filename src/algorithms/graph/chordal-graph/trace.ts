// =============================================================================
// 弦图判定 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { chordalGraph, type GraphInput, type ChordalHooks } from './impl.ts';

/** 示例：A-B-C-A + A-C-D-A 两个三角形共享边 A-C（弦图）。
 *  再加 C-E-B 形成 4 元环 A-B-E-C-A 但缺弦 B-C？B-C 已有 → 仍是弦图。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
    { from: 'A', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'C', to: 'E' },
    { from: 'E', to: 'B' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.3 },
  B: { x: 0.5, y: 0.2 },
  C: { x: 0.5, y: 0.55 },
  D: { x: 0.2, y: 0.75 },
  E: { x: 0.8, y: 0.5 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const picked: string[] = [];
  const weight = new Map<string, number>();
  for (const v of nodeIds) weight.set(v, 0);
  let cur: string | null = null;
  let chordal = true;
  let done = false;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (picked.includes(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      if (done) role = chordal ? 'final' : 'warn';
      return {
        id,
        label: `${id}\nw=${weight.get(id)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        { label: 'MCS 序', value: picked.length ? picked.join('→') : '∅', role: 'frontier' },
        {
          label: '结论',
          value: done ? (chordal ? '是弦图' : '非弦图') : '判定中',
          role: chordal ? 'final' : 'warn',
        },
      ])
      .commit();
  };

  snap({ zh: '初始图：MCS 求 PEO', en: 'Initial graph: MCS for PEO' });

  const hooks: ChordalHooks = {
    onPick: (v) => {
      picked.push(v);
      cur = v;
      // 不更新权重（impl 已更新，这里仅用于展示）
      snap({
        zh: `MCS 选 ${v}（位置 ${picked.length}）`,
        en: `MCS picks ${v} (pos ${picked.length})`,
      });
    },
    onCheck: (v, ok) => {
      cur = v;
      if (!ok) chordal = false;
      snap({
        zh: `验证 ${v}：${ok ? '通过' : '失败（非 PEO）'}`,
        en: `Check ${v}: ${ok ? 'pass' : 'fail'}`,
      });
    },
    onResult: (c, peo) => {
      chordal = c;
      done = true;
      cur = null;
      snap({
        zh: c ? `是弦图，PEO=${peo.join('→')}` : '非弦图',
        en: c ? `Chordal; PEO=${peo.join('→')}` : 'Not chordal',
      });
    },
  };

  chordalGraph(input, hooks);

  rec
    .begin({ zh: chordal ? '是弦图' : '非弦图', en: chordal ? 'Chordal' : 'Not chordal' })
    .setGraph(mkNodes(), mkEdges())
    .setAux([
      { label: '结论', value: chordal ? '弦图' : '非弦图', role: chordal ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
