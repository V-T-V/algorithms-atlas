// =============================================================================
// Karger 随机化最小割 · 录制帧序列
// 用 graph 展示顶点与边的收缩过程，aux 展示试验进度与当前最优割。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kargerMinCut, type Edge, type KargerHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 4,
  edges: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ] as Edge[],
  trials: 8,
  seed: 42,
};

interface BuildTraceInput {
  n?: number;
  edges?: Edge[];
  trials?: number;
  seed?: number;
}

/** 把 0..n-1 的顶点排成正 n 边形，返回归一化坐标。 */
function circleLayout(n: number): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  const cx = 0.5;
  const cy = 0.5;
  const r = 0.35;
  for (let i = 0; i < n; i++) {
    const theta = -Math.PI / 2 + (2 * Math.PI * i) / n;
    pts.push({ x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) });
  }
  return pts;
}

/** 录制演示帧序列（展示一次代表性试验的收缩过程）。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const n = input.n ?? DEFAULT_INPUT.n;
  const edges = input.edges ?? DEFAULT_INPUT.edges;
  const trials = input.trials ?? DEFAULT_INPUT.trials;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const rec = new TraceRecorder();
  const layout = circleLayout(n);

  // 跟踪当前试验的并查集等价类（用一个简单的 leader 映射）
  // 用「每个原始顶点 → 代表」来表达超顶点；用颜色区分不同超顶点
  let leader: number[] = Array.from({ length: n }, (_, i) => i);
  let bestCut = Number.MAX_SAFE_INTEGER;
  let trialNo = -1;
  let lastCut = -1;

  const roleForLeader = (l: number): BarRole => {
    // 给不同代表分配不同语义色（复用有限角色集）
    const palette: BarRole[] = ['frontier', 'compare', 'pivot', 'sorted', 'warn', 'final'];
    return palette[l % palette.length] ?? 'default';
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = layout.map((p, i) => ({
      id: `v${i}`,
      x: p.x,
      y: p.y,
      label: `${i}`,
      role: roleForLeader(leader[i]!),
    }));
    const graphEdges: GraphEdge[] = edges.map(([a, b]) => ({
      from: `v${a}`,
      to: `v${b}`,
      role: leader[a] === leader[b] ? ('warn' as BarRole) : ('default' as BarRole),
    }));
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '顶点数', value: String(n), role: 'frontier' },
      { label: '边数', value: String(edges.length), role: 'pivot' },
      { label: '试验', value: trialNo >= 0 ? `${trialNo + 1}/${trials}` : '—', role: 'default' },
      { label: '本次割', value: lastCut >= 0 ? String(lastCut) : '—', role: 'swap' },
      { label: '最优割', value: Number.isFinite(bestCut) ? String(bestCut) : '—', role: 'final' },
    ];
    rec.begin(note).setGraph(nodes, graphEdges).setAux(aux).commit();
  };

  render({
    zh: `Karger 最小割：${n} 顶点、${edges.length} 条边，${trials} 次试验（种子 ${seed}）`,
    en: `Karger min-cut: ${n} vertices, ${edges.length} edges, ${trials} trials (seed ${seed})`,
  });

  // 自定义一次「可视化」试验：复用单试验逻辑，通过钩子更新 leader
  // 这里直接调用 kargerMinCut，并利用 onContract 更新 leader 进行可视化
  const findRepr = (arr: number[], x: number): number => {
    while (arr[x] !== x) {
      arr[x] = arr[arr[x]!]!;
      x = arr[x]!;
    }
    return x;
  };

  const hooks: KargerHooks = {
    onTrialStart: (t) => {
      trialNo = t;
      leader = Array.from({ length: n }, (_, i) => i); // 重置
      lastCut = -1;
      render({
        zh: `第 ${t + 1} 次试验开始`,
        en: `Trial ${t + 1} starts`,
      });
    },
    onContract: (u, _v, superV, remaining) => {
      // 把 u 所在集合合并到 superV 代表
      const ru = findRepr(leader, u);
      leader[ru] = superV;
      render({
        zh: `收缩边 (${u}, ${_v}) → 超顶点 ${superV}，剩余 ${remaining} 顶点`,
        en: `Contract edge (${u}, ${_v}) → super-vertex ${superV}, ${remaining} vertices left`,
      });
    },
    onTrialEnd: (_t, cut) => {
      lastCut = cut;
      render({
        zh: `本次割 = ${cut === Number.MAX_SAFE_INTEGER ? 'N/A' : cut}`,
        en: `Cut = ${cut === Number.MAX_SAFE_INTEGER ? 'N/A' : cut}`,
      });
    },
    onBestUpdate: (cut) => {
      bestCut = cut;
      render({
        zh: `新最优割：${cut}`,
        en: `New best cut: ${cut}`,
      });
    },
  };

  // 用固定种子跑（注意：trace 里只展示一次完整试验的可视化是理想情况；
  // 但为兼顾多次试验的进度感，这里跑全部 trials 并为每次试验重置 leader）
  kargerMinCut(n, edges, trials, seed, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：${trials} 次试验后估计最小割 = ${bestCut}`,
      en: `Done: estimated min-cut = ${bestCut} after ${trials} trials`,
    })
    .setGraph(
      layout.map((p, i) => ({
        id: `v${i}`,
        x: p.x,
        y: p.y,
        label: `${i}`,
        role: 'final' as BarRole,
      })),
      edges.map(([a, b]) => ({ from: `v${a}`, to: `v${b}`, role: 'default' as BarRole })),
    )
    .setAux([
      { label: '最优割', value: String(bestCut), role: 'final' },
      { label: '试验次数', value: String(trials), role: 'frontier' },
      { label: '种子', value: String(seed), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
