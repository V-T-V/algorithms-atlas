// =============================================================================
// 最小反馈弧集 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minimumFeedbackArc, type GraphInput, type FbaHooks } from './impl.ts';

/** 示例：含一个 3 元环 0→1→2→0，加一条 0→3。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '0', to: '3' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.2, y: 0.5 },
  '1': { x: 0.5, y: 0.25 },
  '2': { x: 0.5, y: 0.8 },
  '3': { x: 0.85, y: 0.5 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const placed = new Set<string>();
  const order: string[] = [];
  let cur: string | null = null;
  const feedbackSet = new Set<string>();
  let done = false;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id, i) => {
      let role: BarRole = 'default';
      const ordIdx = order.indexOf(id);
      if (ordIdx >= 0) role = 'frontier';
      if (id === cur) role = 'compare';
      if (done) role = 'final';
      return {
        id,
        label: ordIdx >= 0 ? `${id}\n#${ordIdx}` : id,
        x: POS[id]?.x ?? 0.2 + 0.2 * i,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      directed: true,
      role: (feedbackSet.has(`${e.from}>${e.to}`) ? 'warn' : done ? 'final' : 'default') as BarRole,
    }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        { label: '序', value: order.length ? order.join('→') : '∅', role: 'frontier' },
        { label: '已放', value: `${placed.size}/${nodeIds.length}` },
        {
          label: '反馈弧',
          value: feedbackSet.size ? [...feedbackSet].join(',') : '∅',
          role: 'warn',
        },
      ])
      .commit();
  };

  snap({ zh: '初始有向图：构造线性序', en: 'Initial digraph: build linear order' });

  const hooks: FbaHooks = {
    onPickSource: (v) => {
      order.push(v);
      placed.add(v);
      cur = v;
      snap({ zh: `源点 ${v} 入序头`, en: `Source ${v} to front` });
    },
    onPickSink: (v) => {
      placed.add(v);
      cur = v;
      snap({ zh: `汇点 ${v} 入序尾`, en: `Sink ${v} to back` });
    },
    onPickMax: (v, d) => {
      order.push(v);
      placed.add(v);
      cur = v;
      snap({ zh: `${v} 出−入=${d} 最大，入序`, en: `${v} max delta=${d}, added` });
    },
    onResult: (fb, ord) => {
      done = true;
      cur = null;
      order.length = 0;
      order.push(...ord);
      feedbackSet.clear();
      for (const e of fb) feedbackSet.add(`${e.from}>${e.to}`);
      snap({ zh: `反馈弧集 ${fb.length} 条`, en: `${fb.length} feedback arcs` });
    },
  };

  minimumFeedbackArc(input, hooks);

  rec
    .begin({
      zh: `完成：${feedbackSet.size} 条反馈弧`,
      en: `Done: ${feedbackSet.size} feedback arcs`,
    })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '反馈弧数', value: String(feedbackSet.size), role: 'warn' }])
    .commit();

  return rec.build();
}
