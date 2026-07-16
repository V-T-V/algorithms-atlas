// =============================================================================
// 预流推进最大流 · 录制帧序列
// 用 setGraph 展示流网络，节点标注「超额流/高度」；setAux 展示各边 flow/cap。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pushRelabel, type PushRelabelEdgeInput, type PushRelabelHooks } from './impl.ts';

/** 演示网络：5 节点，源 0，汇 4，最大流 = 18。 */
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
  ] as PushRelabelEdgeInput[],
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
  input: { n: number; edges: PushRelabelEdgeInput[]; s: number; t: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges, s, t } = input;

  const height = new Array<number>(n).fill(0);
  const excess = new Array<number>(n).fill(0);
  height[s] = n;
  // 边上当前流量（用于展示）
  const flow = new Map<string, number>(edges.map((e) => [`${e.from}>${e.to}`, 0]));
  const activeNodes = new Set<number>();

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (i === s || i === t) role = 'pivot';
      else if (activeNodes.has(i)) role = 'compare';
      else if (excess[i]! > 0) role = 'warn';
      nodes.push({
        id: String(i),
        label: `${i}\ne=${excess[i]}/h=${height[i]}`,
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      return {
        from: String(e.from),
        to: String(e.to),
        weight: e.cap,
        directed: true,
        role: (f > 0 ? 'frontier' : 'default') as BarRole,
      };
    });
    const aux = edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      return {
        label: `${e.from}→${e.to}`,
        value: `${f}/${e.cap}`,
        role: (f > 0 ? 'frontier' : 'default') as BarRole,
      };
    });
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({ zh: `初始：h[${s}]=${n}，其余 h=0`, en: `Init: h[${s}]=${n}, others h=0` });

  const hooks: PushRelabelHooks = {
    onPush: (u, v, f) => {
      // 更新展示流量
      if (u === s) {
        const key = `${u}>${v}`;
        flow.set(key, (flow.get(key) ?? 0) + f);
      } else {
        // 反推正向流量变化
        const keyForward = `${u}>${v}`;
        if (flow.has(keyForward)) flow.set(keyForward, (flow.get(keyForward) ?? 0) + f);
      }
      if (v !== t && v !== s) activeNodes.add(v);
      if (u !== s) activeNodes.add(u);
      render({
        zh: `PUSH ${u}→${v}，推送 ${f}`,
        en: `PUSH ${u}→${v}, flow ${f}`,
      });
      activeNodes.delete(u);
    },
    onRelabel: (u, oldH, newH) => {
      height[u] = newH;
      activeNodes.add(u);
      render({
        zh: `RELABEL ${u}：h=${oldH}→${newH}`,
        en: `RELABEL ${u}: h=${oldH}→${newH}`,
      });
    },
    onDischarge: (u, ex) => {
      excess[u] = ex;
      activeNodes.add(u);
    },
  };

  const result = pushRelabel(n, edges, s, t, hooks);

  // 终态
  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: String(i),
      label: `${i}\ne=${i === t ? result : 0}`,
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
