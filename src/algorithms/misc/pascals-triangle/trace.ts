// 杨辉三角 · 录制帧序列

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pascalsTriangle, type PascalHooks } from './impl.ts';

export const DEFAULT_INPUT = { numRows: 6 };

export function buildTrace(input: { numRows: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { numRows } = input;
  const grid: number[][] = [];

  const render = (note: { zh: string; en: string }): void => {
    // 用 array2d 展示三角形（左对齐，缺失格留空）
    const cells: Cell[][] = grid.map((row, r) => {
      const line: Cell[] = [];
      for (let c = 0; c < numRows; c++) {
        if (c < row.length) {
          line.push({ v: row[c], role: 'final' as BarRole });
        } else {
          line.push({ v: '', role: 'default' as BarRole });
        }
      }
      void r;
      return line;
    });
    const rowSums = grid.map((row) => row.reduce((s, x) => s + x, 0));
    rec
      .begin(note)
      .setGrid(cells)
      .setAux([
        ...rowSums.map((s, r) => ({
          label: `第 ${r} 行和`,
          value: String(s),
          role: 'frontier' as BarRole,
        })),
      ])
      .commit();
  };

  render({ zh: `生成 ${numRows} 行杨辉三角`, en: `Generate ${numRows} rows of Pascal's triangle` });

  const hooks: PascalHooks = {
    onRow: (row, values) => {
      grid[row] = [...values];
      render({
        zh: `第 ${row} 行 = [${values.join(', ')}]（和=${values.reduce((s, x) => s + x, 0)}=2^${row}）`,
        en: `Row ${row} = [${values.join(', ')}] (sum=${values.reduce((s, x) => s + x, 0)}=2^${row})`,
      });
    },
    onEntry: () => {},
  };

  pascalsTriangle(numRows, hooks);

  rec
    .begin({ zh: `完成：共 ${numRows} 行`, en: `Done: ${numRows} rows` })
    .setGrid(
      grid.map((row) =>
        Array.from({ length: numRows }, (_, c) => ({
          v: c < row.length ? row[c] : '',
          role: 'sorted' as BarRole,
        })),
      ),
    )
    .setAux([
      {
        label: '末行和',
        value: String(grid[numRows - 1]?.reduce((s, x) => s + x, 0) ?? 0),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
