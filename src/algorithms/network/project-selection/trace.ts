// =============================================================================
// 项目选择 · 录制帧序列
// 用 setGraph 展示项目依赖图，setAux 展示各项目利润与选中状态。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { projectSelection, type ProjectSelectionHooks } from './impl.ts';

/** 演示：4 个项目，含正/负利润与依赖。 */
export const DEFAULT_INPUT = {
  n: 4,
  projects: [{ profit: 4 }, { profit: 3 }, { profit: -2 }, { profit: -5 }] as Array<{
    profit: number;
  }>,
  deps: [
    [0, 1], // 选 P1 必须选 P0
    [2, 0], // 选 P0 必须选 P2（成本）
  ] as ReadonlyArray<readonly [number, number]>,
};

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.5, y: 0.2 },
  1: { x: 0.8, y: 0.45 },
  2: { x: 0.2, y: 0.45 },
  3: { x: 0.5, y: 0.8 },
};

export function buildTrace(
  input: {
    n: number;
    projects: Array<{ profit: number }>;
    deps: ReadonlyArray<readonly [number, number]>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, projects, deps } = input;

  const render = (note: { zh: string; en: string }, selected: Set<number> = new Set()): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      const p = projects[i]!.profit;
      let role: BarRole = 'default';
      if (selected.has(i)) role = 'final';
      else if (p > 0) role = 'frontier';
      else role = 'warn';
      nodes.push({
        id: String(i),
        label: `P${i}\n${p > 0 ? '+' : ''}${p}`,
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role,
      });
    }
    const e2: GraphEdge[] = deps.map(([u, v]) => ({
      from: String(u),
      to: String(v),
      directed: true,
      role: 'default',
    }));
    const aux = projects.map((p, i) => ({
      label: `P${i} 利润`,
      value: `${p.profit > 0 ? '+' : ''}${p.profit}`,
      role: (selected.has(i) ? 'final' : p.profit > 0 ? 'frontier' : 'warn') as BarRole,
    }));
    if (selected.size > 0) {
      aux.push({
        label: '净收益',
        value: String([...selected].reduce((s, i) => s + projects[i]!.profit, 0)),
        role: 'frontier' as BarRole,
      });
    }
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({
    zh: `初始：${n} 个项目，含正/负利润与依赖`,
    en: `Initial: ${n} projects with profits and deps`,
  });

  let W = 0;
  let minCut = 0;
  const hooks: ProjectSelectionHooks = {
    onNetwork: (w) => {
      W = w;
      render({
        zh: `构造源汇网络：正利润之和 W = ${w}`,
        en: `Build network: sum of positive profits W = ${w}`,
      });
    },
    onMinCut: (mc) => {
      minCut = mc;
      render({
        zh: `最小割 = ${mc}（放弃的正利润 + 承担的成本）`,
        en: `Min-cut = ${mc} (foregone profit + incurred cost)`,
      });
    },
  };

  const value = projectSelection(n, projects, deps, hooks);

  // 选中集合（重新计算 S 侧）：选中 = 正利润且未被割断
  // 简化展示：选中净贡献为正、且依赖闭合的项目
  // 用 value 反推：选中集合即 S 侧
  // 这里用一个简单的近似：选中所有利润>0 且依赖闭合的项目
  // 为展示精确，重新调用 projectSelectionSet（避免重复逻辑）
  // 但为保持 trace 简单，直接用 value 作为终态
  void W;
  void minCut;
  rec
    .begin({
      zh: `完成，最大净收益 = ${value}`,
      en: `Done, maximum net profit = ${value}`,
    })
    .setGraph(
      Array.from({ length: n }, (_, i) => ({
        id: String(i),
        label: `P${i}\n${projects[i]!.profit > 0 ? '+' : ''}${projects[i]!.profit}`,
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      deps.map(([u, v]) => ({
        from: String(u),
        to: String(v),
        directed: true,
        role: 'final' as BarRole,
      })),
    )
    .setAux([
      {
        label: '最大净收益',
        value: String(value),
        role: 'frontier' as BarRole,
      },
      ...projects.map((p, i) => ({
        label: `P${i} 利润`,
        value: `${p.profit > 0 ? '+' : ''}${p.profit}`,
        role: (p.profit >= 0 ? 'final' : 'warn') as BarRole,
      })),
    ])
    .commit();

  return rec.build();
}
