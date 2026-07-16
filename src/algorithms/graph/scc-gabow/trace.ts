// =============================================================================
// Gabow SCC · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sccGabow, type GraphInput, type GabowHooks } from './impl.ts';

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

  const idMap = new Map<string, number>();
  const onStack = new Set<string>();
  const S: string[] = [];
  const B: number[] = [];
  const done = new Set<string>();
  const sccOf = new Map<string, number>();
  let cur: string | null = null;
  let exam: { from: string; to: string } | null = null;
  let sccCount = 0;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (done.has(id)) role = 'final';
      if (onStack.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      return {
        id,
        label: `${id}${idMap.has(id) ? `\nid=${idMap.get(id)}` : ''}`,
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
      role: (exam && exam.from === e.from && exam.to === e.to
        ? 'compare'
        : sccOf.get(e.from) !== undefined && sccOf.get(e.from) === sccOf.get(e.to)
          ? 'final'
          : 'default') as BarRole,
    }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        { label: 'path 栈 S', value: S.length ? S.join('→') : '∅', role: 'frontier' },
        { label: 'boundary 栈 B', value: B.length ? B.join(',') : '∅', role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: '初始图（Gabow 双栈）', en: 'Initial graph (Gabow dual stacks)' });

  const hooks: GabowHooks = {
    onDiscover: (v, id) => {
      idMap.set(v, id);
      cur = v;
      snap({ zh: `访问 ${v}：id=${id}，入 S/B`, en: `Visit ${v}: id=${id}, push S/B` });
    },
    onExamine: (u, v, kind) => {
      exam = { from: u, to: v };
      cur = u;
      const z = { tree: '树边', back: '回边', cross: '横叉边' };
      const e = { tree: 'tree', back: 'back', cross: 'cross' };
      snap({ zh: `考察 ${u}→${v}（${z[kind]}）`, en: `Examine ${u}→${v} (${e[kind]})` });
      exam = null;
    },
    onComponent: (comp) => {
      sccCount++;
      for (const id of comp) {
        done.add(id);
        sccOf.set(id, sccCount);
        onStack.delete(id);
        const idx = S.lastIndexOf(id);
        if (idx >= 0) S.splice(idx, 1);
      }
      cur = null;
      snap({
        zh: `发现 SCC #${sccCount}：{ ${comp.join(', ')} }`,
        en: `SCC #${sccCount}: { ${comp.join(', ')} }`,
      });
    },
  };

  sccGabow(input, hooks);

  rec
    .begin({ zh: `完成：共 ${sccCount} 个 SCC`, en: `Done: ${sccCount} SCCs` })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        directed: true,
        role: (sccOf.get(e.from) === sccOf.get(e.to) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: 'SCC 总数', value: String(sccCount), role: 'final' }])
    .commit();

  return rec.build();
}
