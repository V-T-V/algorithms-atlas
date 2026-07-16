// =============================================================================
// k 逆序对数组 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kInversePairs, type KInverseHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 3, k: 1 };

export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, k } = input;
  // 展示完整表（行 m=1..n，列 j=0..k）
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(k + 1).fill(0));
  table[0]![0] = 1;
  let curM = -1;
  let curK = -1;
  let ans = 0;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [
      { v: 'm\\k', role: 'default' },
      ...Array.from({ length: k + 1 }, (_, j) => ({ v: j, role: 'pivot' as BarRole })),
    ];
    const grid: Cell[][] = [header];
    for (let m = 1; m <= n; m++) {
      const row: Cell[] = [{ v: m, role: 'pivot' as BarRole }];
      for (let j = 0; j <= k; j++) {
        let role: BarRole = 'default';
        if (m === n && j === k && ans > 0) role = 'final';
        else if (m === curM && j === curK) role = 'compare';
        row.push({ v: table[m]![j]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `n=${n}, k=${k}`, en: `n=${n}, k=${k}` });

  const hooks: KInverseHooks = {
    onCell: (m, j, val) => {
      table[m]![j] = val;
      curM = m;
      curK = j;
      snap({ zh: `dp[${m}][${j}] = ${val}`, en: `dp[${m}][${j}] = ${val}` });
    },
    onResult: (t) => {
      ans = t;
      curM = -1;
      curK = -1;
      snap({ zh: `方案数 = ${t}`, en: `Count = ${t}` });
    },
  };

  kInversePairs(n, k, 1_000_000_007, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
