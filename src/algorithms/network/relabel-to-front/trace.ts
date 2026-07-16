// =============================================================================
// Relabel-to-Front · 录制帧序列
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { relabelToFront, type RtfEdgeInput, type RtfHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 5,
  edges: [
    { from: 0, to: 1, cap: 10 },
    { from: 0, to: 2, cap: 10 },
    { from: 1, to: 2, cap: 2 },
    { from: 1, to: 3, cap: 4 },
    { from: 1, to: 4, cap: 8 },
    { from: 2, to: 3, cap: 9 },
    { from: 3, to: 4, cap: 10 },
  ] as RtfEdgeInput[],
  s: 0,
  t: 4,
};

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.1, y: 0.5 },
  1: { x: 0.38, y: 0.22 },
  2: { x: 0.38, y: 0.78 },
  3: { x: 0.66, y: 0.5 },
  4: { x: 0.92, y: 0.5 },
};

export function buildTrace(
  input: { n: number; edges: RtfEdgeInput[]; s: number; t: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges, s, t } = input;

  const flow = new Map<string, number>(edges.map((e) => [`${e.from}>${e.to}`, 0]));
  const heights = new Array<number>(n).fill(0);
  heights[s] = n;
  const excess = new Array<number>(n).fill(0);
  const highlightNode = new Set<number>();
  let step = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (i === s || i === t) role = 'pivot';
      if (highlightNode.has(i)) role = 'compare';
      nodes.push({
        id: String(i),
        label: `${i}\nh=${heights[i]} e=${excess[i]!.toFixed(0)}`,
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      let role: BarRole = 'default';
      if (f > 0) role = 'frontier';
      return { from: String(e.from), to: String(e.to), weight: e.cap, directed: true, role };
    });
    const aux = [
      { label: '步数', value: String(step), role: 'pivot' as BarRole },
      ...edges.map((e) => {
        const key = `${e.from}>${e.to}`;
        const f = flow.get(key) ?? 0;
        return {
          label: `${e.from}→${e.to}`,
          value: `${f}/${e.cap}`,
          role: (f > 0 ? 'frontier' : 'default') as BarRole,
        };
      }),
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
    highlightNode.clear();
  };

  render({
    zh: `初始化：h[s]=${n}，饱和推送 s 出边`,
    en: `Init: h[s]=${n}, saturate s out-edges`,
  });

  const hooks: RtfHooks = {
    onPush: (from, to, f, fromExcess) => {
      step += 1;
      const key = `${from}>${to}`;
      if (flow.has(key)) flow.set(key, (flow.get(key) ?? 0) + f);
      else {
        // 反向边流量减少（push 到反向边意味着撤销）
        const revKey = `${to}>${from}`;
        if (flow.has(revKey)) flow.set(revKey, Math.max(0, (flow.get(revKey) ?? 0) - f));
      }
      excess[from] = fromExcess;
      excess[to] = excess[to]! + f;
      highlightNode.add(from);
      highlightNode.add(to);
      render({
        zh: `push ${from}→${to}：${f} 单位`,
        en: `push ${from}→${to}: ${f} units`,
      });
    },
    onRelabel: (node, oldH, newH) => {
      step += 1;
      heights[node] = newH;
      highlightNode.add(node);
      render({
        zh: `relabel ${node}：h ${oldH} → ${newH}`,
        en: `relabel ${node}: h ${oldH} → ${newH}`,
      });
    },
    onDischarge: (node, _oldH, newH) => {
      heights[node] = newH;
    },
    onMoveToFront: (node) => {
      step += 1;
      highlightNode.add(node);
      render({
        zh: `${node} 被重标 → 移到链表前端`,
        en: `${node} relabeled → moved to front`,
      });
    },
  };

  const result = relabelToFront(n, edges, s, t, hooks);

  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: String(i),
      label: `${i}\nh=${heights[i]}`,
      x: POS[i]?.x ?? 0.5,
      y: POS[i]?.y ?? 0.5,
      role: 'final' as BarRole,
    });
  }
  rec
    .begin({ zh: `完成，最大流 = ${result}`, en: `Done, max flow = ${result}` })
    .setGraph(
      nodes,
      edges.map((e) => ({
        from: String(e.from),
        to: String(e.to),
        weight: e.cap,
        directed: true,
        role: ((flow.get(`${e.from}>${e.to}`) ?? 0) > 0 ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux(
      edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `${flow.get(`${e.from}>${e.to}`) ?? 0}/${e.cap}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
