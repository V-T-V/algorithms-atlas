// =============================================================================
// 凸优化DP · 录制帧序列
// 用 setBars 展示当前凸壳里的直线（以斜率 m 排序），
// 当前查询点 x 标 'pivot'，取得最优的直线标 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { convexHullTrick, type ConvexHullTrickHooks, type Line } from './impl.ts';

/** 演示：4 条直线（斜率递减），对若干 x 查询最小值。 */
export const DEFAULT_INPUT: { lines: Line[]; queries: number[] } = {
  lines: [
    { m: 3, b: 2, j: 0 },
    { m: 2, b: 5, j: 1 },
    { m: 1, b: 3, j: 2 },
    { m: 0, b: 9, j: 3 },
  ],
  queries: [0, 1, 2, 3, 4, 5],
};

/** 录制演示帧序列。 */
export function buildTrace(input: { lines: Line[]; queries: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { lines, queries } = input;
  const hull: Line[] = [];
  const hotIdx = new Set<number>(); // hull 中当前最优直线的来源下标 j
  let curX: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    // 用 lines 的斜率作为柱高，标出在 hull 中的直线
    const roles: Record<number, BarRole> = {};
    lines.forEach((ln, i) => {
      const inHull = hull.some((h) => h.j === ln.j);
      if (inHull && hotIdx.has(ln.j)) roles[i] = 'final';
      else if (inHull) roles[i] = 'frontier';
      else roles[i] = 'default';
    });
    rec
      .begin(note)
      .setBars(
        rec.barsFrom(
          lines.map((l) => l.m),
          roles,
        ),
      )
      .setAux([
        { label: '当前 x', value: curX === null ? '-' : String(curX), role: 'pivot' },
        { label: '凸壳大小', value: String(hull.length), role: 'compare' },
      ])
      .commit();
  };

  snapshot({
    zh: `候选直线 ${lines.length} 条，查询 ${queries.length} 个 x`,
    en: `${lines.length} lines, ${queries.length} queries`,
  });

  const hooks: ConvexHullTrickHooks = {
    onAddLine: (line) => {
      if (!hull.some((h) => h.j === line.j)) hull.push(line);
      snapshot({
        zh: `加入直线 m=${line.m}, b=${line.b}（j=${line.j}）`,
        en: `Add line m=${line.m}, b=${line.b} (j=${line.j})`,
      });
    },
    onPopLine: (line) => {
      const idx = hull.findIndex((h) => h.j === line.j);
      if (idx >= 0) hull.splice(idx, 1);
      snapshot({ zh: `弹出冗余直线 j=${line.j}`, en: `Pop redundant line j=${line.j}` });
    },
    onQuery: (x, line, val) => {
      curX = x;
      hotIdx.clear();
      hotIdx.add(line.j);
      snapshot({
        zh: `查询 x=${x}：最优直线 j=${line.j}，值 y=${val}`,
        en: `Query x=${x}: best line j=${line.j}, y=${val}`,
      });
    },
  };

  const result = convexHullTrick(lines, queries, hooks);

  curX = null;
  hotIdx.clear();
  rec
    .begin({
      zh: `查询完成，最小值序列：[${result.map((r) => r.val).join(', ')}]`,
      en: `Done, min values: [${result.map((r) => r.val).join(', ')}]`,
    })
    .setBars(rec.barsFrom(lines.map((l) => l.m)))
    .commit();

  return rec.build();
}
