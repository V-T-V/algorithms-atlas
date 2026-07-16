// =============================================================================
// 粉刷房子 · 录制帧序列
// 用二维 grid 展示 dp 表：行 = 房子下标，列 = 颜色。
// 当前填的格标 'compare'，最终被采用的颜色列标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { paintHouse, type PaintHouseHooks } from './impl.ts';

const COLORS = ['红/R', '绿/G', '蓝/B'];

export const DEFAULT_INPUT: number[][] = [
  [17, 2, 17],
  [16, 16, 5],
  [14, 3, 19],
];

/** 录制演示帧序列。 */
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const costs = input;
  const n = costs.length;
  const k = n > 0 ? costs[0]!.length : 0;

  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(k).fill(-1));
  let curI = -1;
  let curC = -1;
  const finalColor = new Set<number>();

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: '房\\色', role: 'default' }];
    for (let c = 0; c < k; c++) header.push({ v: COLORS[c] ?? `色${c}`, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: `#${i}`, role: 'pivot' }];
      for (let c = 0; c < k; c++) {
        let role: BarRole = 'default';
        if (finalColor.has(c)) role = 'final';
        else if (curI === i && curC === c) role = 'compare';
        const v = dp[i]![c]!;
        row.push({ v: v < 0 ? '·' : v, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snapshot({ zh: `${n} 幢房子，${k} 种颜色`, en: `${n} houses, ${k} colors` });

  const hooks: PaintHouseHooks = {
    onFillCell: (i, c, val) => {
      dp[i]![c] = val;
      curI = i;
      curC = c;
      snapshot({
        zh: `dp[${i}][${c}] = ${val}（cost=${costs[i]![c]!} + 上一行异色最小）`,
        en: `dp[${i}][${c}] = ${val} (cost=${costs[i]![c]!} + min prev of other color)`,
      });
    },
  };

  const result = paintHouse(costs, hooks);

  // 找出最后一行最小列，标 final
  const last = dp[n - 1]!;
  let best = Infinity;
  let bestC = 0;
  for (let c = 0; c < k; c++) {
    if (last[c]! < best) {
      best = last[c]!;
      bestC = c;
    }
  }
  finalColor.add(bestC);

  curI = -1;
  curC = -1;
  rec
    .begin({
      zh: `最小总花费 = ${result}（最后一幢选 ${COLORS[bestC] ?? bestC}）`,
      en: `Min cost = ${result} (last house: ${COLORS[bestC] ?? bestC})`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: '最小花费 / min cost', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
