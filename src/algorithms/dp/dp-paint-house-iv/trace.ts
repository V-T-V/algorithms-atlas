// =============================================================================
// 粉刷房屋（k 色）· 录制帧序列
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { paintHouseK, type PaintHouseHooks } from './impl.ts';

export const DEFAULT_COST: ReadonlyArray<readonly number[]> = [
  [1, 5, 3],
  [2, 3, 1],
  [8, 4, 1],
  [4, 2, 1],
];

export function buildTrace(cost: ReadonlyArray<readonly number[]> = DEFAULT_COST): Frame[] {
  const rec = new TraceRecorder();
  const n = cost.length;
  const k = cost[0]?.length ?? 0;
  const dpGrid: number[][] = Array.from({ length: n }, () => new Array<number>(k).fill(0));
  let curRow = -1;
  let ans = 0;

  const render = (note: { zh: string; en: string }): void => {
    const rows: Cell[][] = dpGrid.map((row, i) =>
      row.map((v, j) => ({
        v: String(v),
        role: (i === curRow ? 'pivot' : 'default') as Cell['role'],
      })),
    );
    rec
      .begin(note)
      .setGrid(rows)
      .setAux([{ label: '当前房', value: curRow < 0 ? '-' : String(curRow), role: 'pivot' }])
      .commit();
  };

  render({ zh: '成本矩阵', en: 'Cost matrix' });

  const hooks: PaintHouseHooks = {
    onRow: (i, dp) => {
      dpGrid[i] = [...dp];
      curRow = i;
      render({ zh: `房 ${i}: dp=[${dp.join(',')}]`, en: `House ${i}: dp=[${dp.join(',')}]` });
    },
    onDone: (c) => {
      ans = c;
      curRow = -1;
      render({ zh: `最小成本=${c}`, en: `min cost=${c}` });
    },
  };

  paintHouseK(cost, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setAux([{ label: '最小总成本', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
