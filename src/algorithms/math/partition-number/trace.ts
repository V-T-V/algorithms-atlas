// =============================================================================
// 整数划分数 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partitionNumber, type PartitionHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 6, mod: 1_000_000_007 };

export function buildTrace(input: { n: number; mod: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, mod } = input;
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  let curI = -1;
  let curK = -1;
  let result = 0;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [
      { v: 'n\\k', role: 'default' },
      ...Array.from({ length: n + 1 }, (_, k) => ({ v: k, role: 'pivot' as BarRole })),
    ];
    const grid: Cell[][] = [header];
    for (let i = 0; i <= n; i++) {
      const row: Cell[] = [{ v: i, role: 'pivot' as BarRole }];
      for (let k = 0; k <= n; k++) {
        let role: BarRole = 'default';
        if (i === curI && k === curK) role = 'compare';
        else if (i === n && k >= 1 && k <= n && result > 0) role = 'final';
        else if (table[i]![k]! > 0) role = 'frontier';
        row.push({ v: table[i]![k]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `计算 p(${n})（整数划分）`, en: `Compute p(${n})` });

  const hooks: PartitionHooks = {
    onCell: (i, k, val) => {
      table[i]![k] = val;
      curI = i;
      curK = k;
      snap({ zh: `p(${i},${k}) = ${val}`, en: `p(${i},${k}) = ${val}` });
    },
    onResult: (val) => {
      result = val;
      curI = -1;
      curK = -1;
      snap({ zh: `p(${n}) = ${val}`, en: `p(${n}) = ${val}` });
    },
  };

  partitionNumber(n, mod, hooks);

  rec
    .begin({ zh: `完成：p(${n}) = ${result}`, en: `Done: p(${n}) = ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
