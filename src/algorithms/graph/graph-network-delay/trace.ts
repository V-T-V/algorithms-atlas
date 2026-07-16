// =============================================================================
// 网络延迟时间 · 录制帧序列
import type { BarRole, GraphEdge, GraphNode, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { networkDelayTime, type NetworkDelayHooks } from './impl.ts';

export const DEFAULT_TIMES: Array<[number, number, number]> = [
  [2, 1, 1],
  [2, 3, 1],
  [3, 4, 1],
];
export const DEFAULT_N = 4;
export const DEFAULT_K = 2;

const POS: Record<number, { x: number; y: number }> = {
  1: { x: 0.2, y: 0.5 },
  2: { x: 0.4, y: 0.3 },
  3: { x: 0.65, y: 0.5 },
  4: { x: 0.9, y: 0.5 },
};

export function buildTrace(
  times: ReadonlyArray<[number, number, number]> = DEFAULT_TIMES,
  n: number = DEFAULT_N,
  k: number = DEFAULT_K,
): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<number, number>();
  for (let i = 1; i <= n; i++) dist.set(i, Infinity);
  dist.set(k, 0);
  const settled = new Set<number>();
  let curSettle = -1;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = Array.from({ length: n }, (_, i) => {
      const id = i + 1;
      let role: BarRole = 'default';
      if (id === curSettle) role = 'compare';
      else if (settled.has(id)) role = 'final';
      const p = POS[id] ?? { x: 0.5, y: 0.5 };
      const d = dist.get(id) ?? Infinity;
      return { id: `${id}`, label: `${id}(${d === Infinity ? '∞' : d})`, x: p.x, y: p.y, role };
    });
    const edges: GraphEdge[] = times.map(([u, v, w]) => ({
      from: `${u}`,
      to: `${v}`,
      weight: w,
      directed: true,
      role: (settled.has(u) ? 'final' : 'default') as BarRole,
    }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: `${n} 节点，源 ${k}`, en: `${n} nodes, source ${k}` });

  const hooks: NetworkDelayHooks = {
    onSettle: (u, d) => {
      curSettle = u;
      settled.add(u);
      render({ zh: `确定 ${u}（dist=${d}）`, en: `Settle ${u} (dist=${d})` });
    },
    onRelax: (u, v, nd, improved) => {
      if (improved) dist.set(v, nd);
      render({
        zh: `松弛 ${u}→${v}=${nd}${improved ? '（更新）' : ''}`,
        en: `Relax ${u}→${v}=${nd}${improved ? ' (improved)' : ''}`,
      });
    },
    onResult: (t) => {
      curSettle = -1;
      render({
        zh: t < 0 ? '有不可达节点' : `总时间 = ${t}`,
        en: t < 0 ? 'Some unreachable' : `Total = ${t}`,
      });
    },
  };

  const result = networkDelayTime(times, n, k, hooks);

  rec
    .begin({
      zh: result < 0 ? '不可达' : `完成：${result}`,
      en: result < 0 ? 'Unreachable' : `Done: ${result}`,
    })
    .setAux([{ label: '时间 / time', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
