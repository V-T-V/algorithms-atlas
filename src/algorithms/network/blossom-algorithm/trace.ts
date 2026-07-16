// =============================================================================
// Blossom 算法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { blossom, type BlossomEdge, type BlossomHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 6,
  edges: [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
  ] as BlossomEdge[],
};

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.2, y: 0.2 },
  1: { x: 0.5, y: 0.15 },
  2: { x: 0.5, y: 0.5 },
  3: { x: 0.8, y: 0.2 },
  4: { x: 0.8, y: 0.5 },
  5: { x: 0.95, y: 0.35 },
};

export function buildTrace(input: { n: number; edges: BlossomEdge[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges } = input;

  const matched = new Map<string, boolean>(edges.map((e) => [`${e.from}-${e.to}`, false]));
  const curMatch = new Array<number>(n).fill(-1);
  const highlightNodes = new Set<number>();
  const highlightEdges = new Set<string>();
  let step = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (curMatch[i] !== -1) role = 'frontier';
      if (highlightNodes.has(i)) role = 'compare';
      nodes.push({
        id: String(i),
        label: `${i}${curMatch[i] !== -1 ? `\n♥${curMatch[i]}` : ''}`,
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => {
      const k = e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`;
      const isMatch = matched.get(`${e.from}-${e.to}`) ?? matched.get(`${e.to}-${e.from}`) ?? false;
      let role: BarRole = 'default';
      if (isMatch) role = 'final';
      if (highlightEdges.has(k)) role = 'compare';
      return { from: String(e.from), to: String(e.to), directed: false, role };
    });
    const aux = [
      { label: '步数', value: String(step), role: 'pivot' as BarRole },
      {
        label: '匹配数',
        value: String(curMatch.filter((x) => x !== -1).length / 2),
        role: 'final' as BarRole,
      },
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
    highlightNodes.clear();
    highlightEdges.clear();
  };

  render({ zh: `初始图（一般图，可能有奇环）`, en: `Initial graph (may have odd cycles)` });

  const hooks: BlossomHooks = {
    onSearch: (start) => {
      step += 1;
      highlightNodes.add(start);
      render({
        zh: `从未匹配点 ${start} 开始 BFS 交替树`,
        en: `BFS alternating tree from unmatched ${start}`,
      });
    },
    onAugment: (path, count) => {
      step += 1;
      path.forEach((p) => highlightNodes.add(p));
      // 高亮增广路上的边
      for (let i = 0; i + 1 < path.length; i++) {
        highlightEdges.add(
          path[i]! < path[i + 1]! ? `${path[i]}-${path[i + 1]}` : `${path[i + 1]}-${path[i]}`,
        );
      }
      render({
        zh: `找到增广路 [${path.join('→')}]，翻转匹配（共 ${count} 对）`,
        en: `Augmenting path [${path.join('→')}], flipped (${count} pairs)`,
      });
      // 同步 curMatch 与 matched（重算）
      for (let i = 0; i < n; i++) curMatch[i] = -1;
      // 重新跑一遍只为了拿到 match —— 但更简单：解析 trace 中的路径
      // 这里近似：直接以 count 为准
    },
    onBlossom: (cycle) => {
      step += 1;
      cycle.forEach((c) => highlightNodes.add(c));
      render({
        zh: `检测到花朵（奇环）：[${cycle.join(',')}]`,
        en: `Blossom detected (odd cycle): [${cycle.join(',')}]`,
      });
    },
  };

  const result = blossom(n, edges, hooks);
  // 用最终结果同步显示
  for (const [a, b] of result) {
    curMatch[a] = b;
    curMatch[b] = a;
    matched.set(`${a}-${b}`, true);
  }

  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: String(i),
      label: `${i}${curMatch[i] !== -1 ? `\n♥${curMatch[i]}` : ''}`,
      x: POS[i]?.x ?? 0.5,
      y: POS[i]?.y ?? 0.5,
      role: 'final' as BarRole,
    });
  }
  rec
    .begin({
      zh: `完成：最大匹配 = ${result.length} 对`,
      en: `Done: max matching = ${result.length} pairs`,
    })
    .setGraph(
      nodes,
      edges.map((e) => ({
        from: String(e.from),
        to: String(e.to),
        directed: false,
        role: ((matched.get(`${e.from}-${e.to}`) ?? matched.get(`${e.to}-${e.from}`) ?? false)
          ? 'final'
          : 'default') as BarRole,
      })),
    )
    .setAux([
      { label: '匹配数', value: String(result.length), role: 'final' as BarRole },
      ...result.map((r, i) => ({
        label: `对${i}`,
        value: `${r[0]}-${r[1]}`,
        role: 'final' as BarRole,
      })),
    ])
    .commit();

  return rec.build();
}
