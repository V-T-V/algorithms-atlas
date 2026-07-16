// =============================================================================
// 贝尔数 · 录制帧序列（展示 Bell 三角）
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bellNumber, type BellHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 5, mod: 1_000_000_007 };

export function buildTrace(input: { n: number; mod: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, mod } = input;
  const triangle: number[][] = [];
  let curRow = -1;
  let result = 0;

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    for (let i = 0; i < triangle.length; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < triangle[i]!.length; j++) {
        let role: BarRole = 'default';
        if (i === curRow) role = 'frontier';
        if (j === 0 && i === n) role = 'final';
        row.push({ v: triangle[i]![j]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([{ label: `B(${n})`, value: String(result), role: 'final' }])
      .commit();
  };

  snap({ zh: `计算 B(${n})（Bell 三角）`, en: `Compute B(${n}) (Bell triangle)` });

  const hooks: BellHooks = {
    onRow: (i, row) => {
      triangle[i] = [...row];
      curRow = i;
      snap({
        zh: `第 ${i} 行：[${row.join(', ')}]；B(${i}) = ${row[0]}`,
        en: `Row ${i}: [${row.join(', ')}]; B(${i}) = ${row[0]}`,
      });
    },
    onResult: (val) => {
      result = val;
      curRow = -1;
      snap({ zh: `B(${n}) = ${val}`, en: `B(${n}) = ${val}` });
    },
  };

  bellNumber(n, mod, hooks);

  rec
    .begin({ zh: `完成：B(${n}) = ${result}`, en: `Done: B(${n}) = ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
