// =============================================================================
// 一和零 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { onesAndZeros, type OnesZerosHooks } from './impl.ts';

export const DEFAULT_INPUT = { strs: ['10', '0001', '111001', '1', '0'], m: 5, n: 3 };

export function buildTrace(
  input: { strs: readonly string[]; m: number; n: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { strs, m, n } = input;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  let curItem = '';
  let ans = 0;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [
      { v: '0\\1', role: 'default' },
      ...Array.from({ length: n + 1 }, (_, k) => ({ v: k, role: 'pivot' as BarRole })),
    ];
    const grid: Cell[][] = [header];
    for (let j = 0; j <= m; j++) {
      const row: Cell[] = [{ v: j, role: 'pivot' as BarRole }];
      for (let k = 0; k <= n; k++) {
        let role: BarRole = 'default';
        if (j === m && k === n && ans > 0) role = 'final';
        row.push({ v: dp[j]![k]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([{ label: '当前串', value: curItem || '∅', role: 'compare' }])
      .commit();
  };

  snap({ zh: `背包：m=${m} 个0, n=${n} 个1`, en: `Knapsack: m=${m} zeros, n=${n} ones` });

  const hooks: OnesZerosHooks = {
    onItem: (s, zeros, ones) => {
      curItem = `${s} (0:${zeros},1:${ones})`;
      snap({
        zh: `处理串 "${s}"：${zeros} 个0，${ones} 个1`,
        en: `Process "${s}": ${zeros} zeros, ${ones} ones`,
      });
    },
    onUpdate: (j, k, val) => {
      dp[j]![k] = val;
      snap({ zh: `dp[${j}][${k}] = ${val}`, en: `dp[${j}][${k}] = ${val}` });
    },
    onResult: (max) => {
      ans = max;
      curItem = '';
      snap({ zh: `最多选 ${max} 个串`, en: `Max ${max} strings` });
    },
  };

  onesAndZeros(strs, m, n, hooks);

  rec
    .begin({ zh: `完成：${ans} 个串`, en: `Done: ${ans} strings` })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
