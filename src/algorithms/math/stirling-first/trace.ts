// =============================================================================
// 第一类 Stirling 数 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stirlingFirstTable } from './impl.ts';

export const DEFAULT_INPUT = { n: 5, mod: 1_000_000_007 };

export function buildTrace(input: { n: number; mod: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, mod } = input;
  let table: number[][] = [];
  let curI = -1;
  let curK = -1;

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
        else if (k > 0 && k <= i) role = 'frontier';
        row.push({ v: table[i]![k]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  table = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  snap({ zh: `计算 s(n,k) 表（n≤${n}）`, en: `Compute s(n,k) table (n<=${n})` });

  table = stirlingFirstTable(n, mod, {
    onCell: (i, k, val) => {
      table[i]![k] = val;
      curI = i;
      curK = k;
      snap({ zh: `s(${i},${k}) = ${val}`, en: `s(${i},${k}) = ${val}` });
    },
  });

  // 验证：第 n 行之和 = n!
  let rowSum = 0;
  for (let k = 0; k <= n; k++) rowSum = (rowSum + table[n]![k]!) % mod;
  let fact = 1;
  for (let i = 2; i <= n; i++) fact = (fact * i) % mod;

  rec
    .begin({
      zh: `完成；第 ${n} 行和 = ${rowSum} (=${n}! mod ${mod})`,
      en: `Done; row ${n} sum = ${rowSum} (=${n}! mod ${mod})`,
    })
    .setGrid(renderGrid())
    .setAux([
      { label: `${n}! mod`, value: String(fact), role: 'final' },
      { label: '行和', value: String(rowSum), role: 'final' },
    ])
    .commit();

  return rec.build();
}
