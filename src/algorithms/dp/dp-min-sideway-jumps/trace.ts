// =============================================================================
// 最少侧跳次数 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minSideJumps, type MinSidewayJumpsHooks } from './impl.ts';

export const DEFAULT_INPUT = [0, 1, 2, 3, 0];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dpHistory: number[][] = [];
  let curPos = -1;

  const renderGrid = (): Cell[][] => {
    // 行 = 道 1,2,3；列 = 位置 0..n-1
    const header: Cell[] = [{ v: '道\\位', role: 'pivot' }];
    for (let i = 0; i < n; i++) header.push({ v: i, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let lane = 1; lane <= 3; lane++) {
      const row: Cell[] = [{ v: `道${lane}`, role: 'pivot' }];
      for (let i = 0; i < n; i++) {
        let role: BarRole = 'default';
        if (input[i] === lane) role = 'warn';
        else if (i === curPos) role = 'compare';
        else if (i < dpHistory.length) {
          const dpArr = dpHistory[i]!;
          if (dpArr[lane] !== undefined && dpArr[lane] !== Infinity) role = 'frontier';
        }
        const v = i < dpHistory.length ? `${dpHistory[i]![lane] ?? '·'}` : '·';
        row.push({ v: input[i] === lane ? 'X' : v, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `obstacles=[${input.join(', ')}]`, en: `obstacles=[${input.join(', ')}]` });

  const hooks: MinSidewayJumpsHooks = {
    onPos: (i, dpArr) => {
      dpHistory[i] = [...dpArr];
      curPos = i;
      snap({
        zh: `位置 ${i}: dp=[${dpArr.slice(1).join(', ')}]`,
        en: `Pos ${i}: dp=[${dpArr.slice(1).join(', ')}]`,
      });
    },
    onResult: (t) => {
      curPos = -1;
      snap({ zh: `最少侧跳 = ${t}`, en: `Min jumps = ${t}` });
    },
  };

  const result = minSideJumps(input, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '侧跳 / jumps', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
